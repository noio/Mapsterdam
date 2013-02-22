var LOCATION_DE_DAM = new google.maps.LatLng(52.357730285566895, 4.893229007720947);
var MAX_ICON_DIST = 60;
var MAX_NEWS_DIST = 70;

var ZOOM_LEVEL_STREETVIEW = 'sv'
var ZOOM_LEVEL_SD         = 'sd'
var ZOOM_LEVEL_BC         = 'bc'
var ZOOM_LEVEL_OUT        = 'out'

var SAMPLING_RATE_STREETVIEW = 1;
var SAMPLING_RATE_BC         = 500;
var SAMPLING_RATE_SD         = 2000;
var Core = new Class({
    initialize: function() {
        // Set up the map
        var mapOptions = {
          'center': LOCATION_DE_DAM,
          'zoom': 12, 'disableDefaultUI': true,'minZoom': 12,
          'disableDoubleClickZoom': true, 'draggable': false, 'scrollwheel': false
        };
        window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        setMapStyle(zoomOutStyle);
        // We get the map's default panorama and set up some defaults.
        // Note that we don't yet set it visible.
        window.panorama = window.map.getStreetView();
        window.panorama.setPosition(LOCATION_DE_DAM);
        window.panorama.setVisible(false);
        window.panorama.setOptions({
            'addressControl':false,
            'panControlOptions': {'position': google.maps.ControlPosition.RIGHT_TOP},
            'zoomControlOptions':{'position': google.maps.ControlPosition.RIGHT_TOP},            
        });
        
        this.sVMarkers = {
            people:[],
            houses:[]
        }
        this.mVMarkers = {
            people:[],
            houses:[]
        };


        this.downSampling = 1;
        this.regionPolys = {}
        
        this.categories = [];
        this.feedItem = null;
        
        this.createLegend();
        
        this.zoomOut();
        this.renderBuurtPolygons();
        
        
        
        google.maps.event.addListener(window.panorama,'closeclick',function(){
            this.zoomOut();
        }.bind(this));

        google.maps.event.addListener(window.panorama,'position_changed',function(){
            this.poi = window.panorama.getPosition();
            this.roi = getClosestPoly(this.poi, bc2010);
            this.updateLegend();
            this.renderPeopleSV();
        }.bind(this));
        
        google.maps.event.addListener(window.panorama, 'visible_changed',function(){
            if (window.panorama.getVisible()){
                this.zoomToStreetView(window.panorama.getPosition());
            }
        }.bind(this));
    },
    
    zoomToStreetView: function(location) {
        
        this.zoomLevel = ZOOM_LEVEL_STREETVIEW;
        this.poi = location;
        this.roi = getClosestPoly(location, bc2010);
        if (!window.panorama.getVisible()) {
            window.panorama.setPosition(this.poi);
            window.panorama.setVisible(true);
        }
        this.downSampling = SAMPLING_RATE_STREETVIEW;
        this.renderPeopleSV();
        this.updateFeed();
        this.updateLegend();
    },
    zoomBC: function(bc) {
        this.zoomLevel = ZOOM_LEVEL_BC;
        window.panorama.setVisible(false);
        this.roi = bc;
        this.downSampling = SAMPLING_RATE_BC;
        zoomToBounds( bc2010[this.roi].borders);
        this.poi = window.map.getCenter();
        window.map.setOptions({'streetViewControl': true, 
        'streetViewControlOptions': {'position': google.maps.ControlPosition.RIGHT_TOP}
        });
        
        this.updateFeed();
        this.renderBuurtPolygons();
        this.renderPeopleMV();
        this.updateLegend();
    },
    zoomSD: function(sd) {
        this.zoomLevel = ZOOM_LEVEL_SD;
        window.panorama.setVisible(false);
        this.roi = sd;
        this.downSampling = SAMPLING_RATE_SD;
        zoomToBounds( sd2010[this.roi].borders );
        this.poi = window.map.getCenter();
        window.map.setOptions({'streetViewControl': true, 
        'streetViewControlOptions': {'position': google.maps.ControlPosition.RIGHT_TOP}
        });
        
        this.updateFeed();
        this.renderBuurtPolygons();
        this.renderPeopleMV();
        this.updateLegend();        
    },
    zoomOut: function() {
        this.zoomLevel = ZOOM_LEVEL_OUT;
        window.panorama.setVisible(false);
        window.map.setZoom(12);
        window.map.setCenter(LOCATION_DE_DAM);
        this.poi = LOCATION_DE_DAM;
        this.roi = 'Amsterdam';
        window.map.setOptions({'streetViewControl': true, 
        'streetViewControlOptions': {'position': google.maps.ControlPosition.RIGHT_TOP}
        });
                
        this.resetMarkers();   
        this.updateFeed();
        this.renderBuurtPolygons();
        this.updateLegend();
    },
    setCategories: function(cats) {
        this.categories = cats;
        if (this.zoomLevel == ZOOM_LEVEL_STREETVIEW) {
            this.renderPeopleSV();
        } else if (this.zoomLevel == ZOOM_LEVEL_SD || this.zoomLevel == ZOOM_LEVEL_BC) {
            this.renderPeopleMV();
        }
        this.updateLegend();
    },
    toggleCategory: function(category) {
        idx = this.categories.indexOf(category);
        if (idx >= 0){
            this.categories.splice(idx,1);
        } else {
            this.categories.push(category);
        }
        if (this.zoomLevel == ZOOM_LEVEL_STREETVIEW) {
            this.renderPeopleSV();
        } else if (this.zoomLevel == ZOOM_LEVEL_SD || this.zoomLevel == ZOOM_LEVEL_BC) {
            this.renderPeopleMV();
        }
        this.updateLegend();
    },
    
    setFeedItem: function(item) {
        this.feedItem = item;
        
        for (var i = 0; i < feedItems.length; i ++){
            feedItems[i].closeDetails();
        }
        if (this.feedItem != null){
            new Fx.Scroll($('sidebar')).toElement(this.feedItem.element);
            this.feedItem.openDetails();
        }
        this.updateFeed();
    },
    resetMarkers: function(){
        for (var type in this.sVMarkers){
            for (var i = 0;i<this.sVMarkers[type].length;i++){
                this.sVMarkers[type][i].hide();
            }
            this.sVMarkers[type] = [];
        }
        for (var type in this.mVMarkers){
            for (var i = 0;i<this.mVMarkers[type].length;i++){
                this.mVMarkers[type][i].hide();
            }
            this.mVMarkers[type] = [];
        }
    },
    renderPeopleSV: function(){
        var regionArea  = getPolyArea(bc2010[this.roi].borders);
        var visibleArea = Math.pow(MAX_ICON_DIST,2)*Math.PI;
        var percentage  = visibleArea/regionArea;
        var nMarkers    = Math.round(percentage*layers.totale_bevolking[this.roi]/this.downSampling);
        this.sVMarkers.people = this.sVMarkers.people.filter(function(m){
            if (google.maps.geometry.spherical.computeDistanceBetween(m.latLng, this.poi) < MAX_ICON_DIST){
                return true
            } else {
                m.hide();
                return false;
            }
        }.bind(this))
        nMarkers -= this.sVMarkers.people.length;
        // Create extra markers
        for (var i = 0;i < nMarkers;i++) {
            var randDist    = Math.random()*(MAX_ICON_DIST-10) + 10;
            var randHeading = Math.random()*360;
            var latLng      = google.maps.geometry.spherical.computeOffset(this.poi, randDist, randHeading);
            var marker      = new PersonMarker(latLng);
            marker.show();
            this.sVMarkers.people.push(marker);
        }
        // Update marker 'clothes'
        for (var j = 0; j < this.sVMarkers.people.length; j ++){
            this.sVMarkers.people[j].dressup();
        }
    },
    
    renderPeopleMV: function() {
        this.resetMarkers();

        // Select neighbors in current area
        var buurten = [];
        var inhabs = 0;
        for (var buurt in bc2010) {
            if (buurt[0] == this.roi[0]) {
                inhabs += layers.totale_bevolking[buurt];
                buurten.push(buurt);
            }
        }
        if (this.zoomLevel == ZOOM_LEVEL_BC){
            //inhabs = layers.totale_bevolking[this.roi];
            var sampling = inhabs/200.0;
        } else {
            var sampling = inhabs/70.0;
        }
        
        if (sampling <100) {
            //this.downSampling = 20;
            this.downSampling = Math.round(sampling/10)*10;
        } else if (sampling < 1000){
            this.downSampling = Math.round(sampling/100)*100;
            //this.downSampling = 1000;
        } else if (sampling < 10000){
            this.downSampling = Math.round(sampling/1000)*1000;
            //this.downSampling = 2000;
        } else {
            this.downSampling = Math.round(sampling/10000)*10000;
        }
        // iterate over buurten
        for (var i = 0; i < buurten.length; i++) {
            var nMarkers = Math.ceil(layers.totale_bevolking[buurten[i]] / this.downSampling);
            var locations = randomPointsInPolygons(bc2010[buurten[i]].borders, nMarkers);
            var markers = [];
            for (var j = 0; j < nMarkers; j++) {
                var marker = new PersonMarker(locations[j], buurten[i]);
                marker.dressup();
                marker.shrink();
                this.mVMarkers.people.push(marker);
            }

        }
    },

    
    renderRegionPolygons: function(){
        for (var code in sd2010) {
            var poly = drawPolygons(sd2010[code].borders,0.5,sd2010[code].color);
            this.regionPolys[code] = poly;
            google.maps.event.addListener(poly, 'mouseover', function(event){
                this.setOptions({'fillOpacity':0.9});
                $$('body').setStyle('cursor','pointer');
            });
            google.maps.event.addListener(poly, 'mouseout',function(event){
                this.setOptions({'fillOpacity':0.5});
                $$('body').setStyle('cursor','');
            });
            google.maps.event.addListener(poly, 'click', function(c, event){
                this.zoomSD(c);
            }.bind(this, code));
        }

    },
    renderBuurtPolygons: function() {
        for (buurt in this.regionPolys) {
           this.regionPolys[buurt].setMap(null);
        }
        this.regionPolys = {};
        this.renderRegionPolygons();
        if (this.zoomLevel == ZOOM_LEVEL_BC || this.zoomLevel == ZOOM_LEVEL_SD) {
            if (typeof(this.regionPolys[this.roi]) != 'undefined') {
                this.regionPolys[this.roi].setMap(null);
            }
            if (typeof(this.regionPolys[this.roi[0]]) != 'undefined') {
                this.regionPolys[this.roi[0]].setMap(null);
            }
            for (var buurt in bc2010) {
                if (buurt[0] == this.roi[0]) {
                    var poly = drawPolygons(bc2010[buurt].borders,0.5, sd2010[buurt[0]].color,4);
                    this.regionPolys[buurt] = poly;
                    
                    google.maps.event.addListener(poly, 'mouseover', function(event){
                        this.setOptions({'fillOpacity':0.9});
                        $$('body').setStyle('cursor','pointer');
                    });
                    google.maps.event.addListener(poly, 'mouseout',function(event){
                        this.setOptions({'fillOpacity':0.5});
                        $$('body').setStyle('cursor','');
                    });
                        google.maps.event.addListener(poly, 'click', function(c, event){
                                this.zoomBC(c);
                        }.bind(this, buurt));
                }
            }
        }
    },
    createLegend: function(){
        var legend = $$('#legend ul')[0];
        legend.empty();
        $('legend').addEvent('click',function(event){
            $$('#legend .top').slide('toggle');
            legend.slide('toggle')
        });
        for (var catName in layerCategories){
            var category = layerCategories[catName]
            var catLi    = new Element('li#'+catName).inject(legend);
            var checkbox = new Element('input[type="checkbox"]').set('checked',this.categories.indexOf(catName) >= 0);
            checkbox.addEvent('click',function(event){
                if (event.target.get('checked')){
                    $(event.target).getParent().getParent().getElements('li ul').slide('out');
                    $(event.target).getParent().getElement('ul').slide('in');
                }
                this.toggleCategory(event.target.getParent().get('id'));
                event.stopPropagation();
            }.bind(this));
            catLi.grab(checkbox);
            catLi.grab(new Element('h4',{'html':catName}))
            var layerList = (new Element('ul')).inject(catLi);
            for (var j = 0; j < category.layers.length; j ++){
                var layer = window.layerMeta[category.layers[j]];
                var imgsource = 'images/legend-icons/'+category.layers[j]+'.png'
                var imbox = new Element('div.imbox').grab(new Element('img',{'src':imgsource}));
                var descr = new Element('span',{'html':layer.description});
                var num   = new Element('span.num',{'html':'()'})
                var li    = new Element('li.clearfix#layer-'+category.layers[j]).grab(imbox).grab(descr).grab(num);
                li.inject(layerList);
            }
            layerList.slide('hide');
            catLi.addEvent('click',function(event){
                event.stopPropagation();
                this.getParent().getElements('li ul').slide('out');
                this.getElement('ul').slide('toggle');
            })
        }
    },
    
    updateLegend: function(){
        $$('#legend input').each(function(i){
            if (this.categories.indexOf(i.getParent().get('id')) >= 0){
                i.set('checked',true);
            } else {
                i.set('checked',false);
            }
        }.bind(this));
        if (this.zoomLevel == ZOOM_LEVEL_SD){
            $('region').set('html',sd2010[this.roi[0]].name)
        } else if (this.zoomLevel == ZOOM_LEVEL_BC){
            $('region').set('html',bc2010[this.roi].name)
        } else if (this.zoomLevel == ZOOM_LEVEL_OUT){
            $('region').set('html','Amsterdam')
        } else if (this.zoomLevel == ZOOM_LEVEL_STREETVIEW){
            $('region').set('html',bc2010[this.roi].name)
        }
        
        for (var catName in layerCategories){
            var catLayers = layerCategories[catName].layers;
            for (var i = 0; i < catLayers.length; i ++){
                var layerName = catLayers[i];
                var num = $$('#legend #layer-'+layerName+' .num');
                var str = layers[layerName][this.roi]
                if (str == null) {
                    str = '0';
                }
                if (layerCategories[catName].data_type == 'percentage'){
                    str+='%';
                } else {
                    str+=" A'dammers";
                }
                num.set('html','<br/>('+ str +')')
            }
        }

        $$('#legend .person-downsampling').set('html',this.downSampling);
        $$('#legend .person-name').set('html',(this.downSampling > 1)?'Amsterdammers':'Amsterdammer');
    },
    
    updateFeed: function(){
        for (var i = 0; i < feedItems.length; i++){
            var pos = feedItems[i].marker.getPosition()
            var inRange = true;
            if (this.zoomLevel == ZOOM_LEVEL_SD || this.zoomLevel == ZOOM_LEVEL_BC){
                // Check if feed item pos inside roi.
                if (getClosestPoly(this.poi, sd2010) != feedItems[i].region){
                    inRange = false;
                }
            } else if (this.zoomLevel == ZOOM_LEVEL_STREETVIEW) {
                // Check if feed item pos in range
                if (google.maps.geometry.spherical.computeDistanceBetween(pos, this.poi) > MAX_NEWS_DIST){
                    inRange = false;
                }
            }
            if (inRange){
                feedItems[i].show();
            } else {
                feedItems[i].hide();
            }
        }
    }
    
});
