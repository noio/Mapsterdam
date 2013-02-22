var LOCATION_DE_DAM = new google.maps.LatLng(52.357730285566895, 4.893229007720947);
var MAX_ICON_DIST = 60;

var Core = new Class({
    initialize: function() {
        // Set up the map
        var mapOptions = {
          'center': LOCATION_DE_DAM,
          'zoom': 12, 'disableDefaultUI': true, 'streetViewControl': true, 'minZoom': 12, 
          'disableDoubleClickZoom': true, 'draggable': false, 'scrollwheel': true
        };
        window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        setMapStyle(zoomOutStyle);
        // We get the map's default panorama and set up some defaults.
        // Note that we don't yet set it visible.

        window.panorama = window.map.getStreetView();
        window.panorama.setPosition(LOCATION_DE_DAM);
        window.panorama.setVisible(false);
        
        window.personMarkers = {}
        
        this.markers = {
            people:[],
            houses:[]
        }
        
        this.layers = [];
        this.layersChanged = false;
        this.feedItem = null;
        this.downSampling = 2;
        
        this.poi = LOCATION_DE_DAM;
        this.zoomLevel = 'out';
        this.roi = null;
        this.focusChanged = false;
        this.zoomChanged = true;

        google.maps.event.addListener(window.panorama,'closeclick',function(){
            this.zoomChanged = true;
            this.zoomLevel = 'out';
            this.render();
        }.bind(this));

        google.maps.event.addListener(window.panorama,'position_changed',function(){
            this.poi = window.panorama.getPosition();
            this.focusChanged = true;
            this.render();
        }.bind(this));

        drawPolyDict(sd2010);
    },
    render: function() {
        if (this.focusChanged) {
            var code = getPolyForPoint(this.poi, bc2010);
            if (code == null){
                code = getClosestPoly(this.poi, bc2010);
            }
            this.roi = code;
            this.renderPeopleSV();
        }
        
        if (this.layersChanged) {
            this.renderPeopleSV();
            this.layersChanged = false;
            // UPDATE LEGEND
            var legend = $$('#legend ul')[0];
            legend.empty();
            for (var i = 0; i < this.showCategories.length; i ++){
                var category  = layerCategories[this.showCategories[i]]
                var catName   = this.showCategories[i];
                var catLi     = (new Element('li')).grab(new Element('h4',{'html':catName})).inject(legend);
                var layerList = (new Element('ul')).inject(catLi);
                for (var j = 0; j < category.layers.length; j ++){
                    var layer = window.layerMeta[category.layers[j]];
                    var imgsource = 'images/legend-icons/legend_'+category.layers[j]+'.png'
                    var imbox = new Element('div.imbox').grab(new Element('img',{'src':imgsource}));
                    var descr = new Element('span',{'html':layer.description});
                    var li    = new Element('li.clearfix').grab(imbox).grab(descr);
                    li.inject(layerList);
                } 
            }
        }

        if (this.zoomChanged) {
            var zl = this.zoomLevel;
            if (zl == 'out') {
                window.panorama.setVisible(false);
                window.map.zoom = 12;
                window.map.center = LOCATION_DE_DAM;
                this.poi = LOCATION_DE_DAM;
                if (typeof(window.personMarkers) != 'undefined') {
                    for (var code in window.personMarkers){
                        for (var i = 0;i < window.personMarkers[code].length; i++) {
                            window.personMarkers[code][i].hide();
                        }
                    }
                }            
            }
            else if (zl == 'in') {
                window.panorama.setVisible(false);

            }
            else if (zl == 'Street View') {
                window.panorama.setVisible(true);
            }
            this.zoomChanged = false;
        }

        if (this.focusChanged) {

            if (this.zoomLevel == 'out') {
                window.map.center = this.poi;
            }
            else if (this.zoomLevel == 'in') {
                if (this.roi != null){
                    zoomToBounds( sd2010[this.roi.substr(0,1)]['borders'] );
                }
            }
            else if (this.zoomLevel == 'Street View') {
                if (!window.panorama.getPosition().equals(this.poi)) {
                    window.panorama.setPosition(this.poi);
                }
                if (typeof(window.personMarkers) != 'undefined') {
                    for (var code in window.personMarkers){
                        for (var i = 0;i < window.personMarkers[code].length; i++) {
                            var marker = window.personMarkers[code][i];
                            var dist = google.maps.geometry.spherical.computeDistanceBetween(this.poi,marker.latLng);
                            if (dist < MAX_ICON_DIST) {
                                marker.show();
                            } else {
                                marker.hide();
                            }
                        }
                    }
                }
            }
            this.focusChanged = false;
        }

        $$(".item").each(function(item) {
            item.close();
        });

        if (this.feedItem != null){
            new Fx.Scroll($('sidebar')).toElement(this.feedItem);
            this.feedItem.open();
        }
    },
    
    renderPeopleSV: function(){
        var regionArea = getPolyArea(bc2010[this.roi].borders);
        var visibleArea = Math.pow(MAX_ICON_DIST,2)*Math.PI;
        var percentage = visibleArea/regionArea;
        var nMarkers = Math.round(percentage*layers.totale_bevolking[this.roi]/this.downSampling);
        for (var n = 0; n<this.markers.people.length;n++) {
            var pos = this.markers.people[n].latLng;
            var d = google.maps.geometry.spherical.computeDistanceBetween(this.poi, pos);
            if (d <= MAX_ICON_DIST){
                nMarkers -= 1;
            } else {
                this.markers.people[n].hide();
                this.markers.people.splice(n,1);
            }
        }
        console.log(nMarkers);
        console.log(this.markers.people);
        for (var i = 0;i < nMarkers;i++) {
            var randDist = Math.random()*(MAX_ICON_DIST-10) + 10;
            var randHeading = Math.random()*360;
            var latLng = google.maps.geometry.spherical.computeOffset(this.poi, randDist, randHeading);
            var marker = new PersonMarker(latLng);
            console.log(marker)
            var roi = marker.latLng;
            for (var j = 0;j < this.showCategories.length;j++) {
                var cat = layerCategories[this.showCategories[j]];
                console.log(cat)
                var values = [];
                if (cat.area_type == 'sd') {
                    roi = roi[0];
                }
                for (var k = 0;k<cat.layers.length;k++){
                    values.push(layers[cat][k][this.roi]);
                }
                if (cat.data_type == 'percentage') {
                    var layer = rouletteSelect(this.layers, values, 100);
                } else {
                    var layer = rouletteSelect(cat.layers, values);
                }
                marker.addLayer(layer);
            }
            console.log(marker);
            this.markers.people.push(marker);
        }
    },
    
    updateLegend: function(){
        
    }
    
});


// function makePeople(region) {
//     
//     if (!(region in window.personMarkers)) {
// 
//         window.personMarkers[region] = [];
//         var polygons = bc2010[region]['borders'];
//         var nPoints = Math.round(layers.totale_bevolking[region]/window.core.downSampling);
//         var randomPoints = randomPointsInPolygons(polygons, nPoints);
//         for (var j = 0; j < nPoints; j ++){
//             var loc = new google.maps.LatLng(randomPoints[j][0],randomPoints[j][1]);
//             window.personMarkers[region].push(new PersonMarker(loc, region));
//         }
//     }
//     for (var i = 0; i < window.personMarkers[region].length;i++){
//         window.personMarkers[region][i].resetLayers();
//     }
//     
//     for(var i = 0;i < window.core.showCategories.length;i++) {
//         var components = layerCategories[window.core.showCategories[i]].layers;
//         var allPersonMarkers = window.personMarkers[region].slice();
//         
//         if (layerCategories[window.core.showCategories[i]].area_type == "sd") {
//             var reg = region[0];
//         } else {
//             var reg = region;
//         }
//         var perc = false;
//         if (layerCategories[window.core.showCategories[i]].data_type == "percentage") {
//             var perc = true;
//         }
//         
//         for(var k = 0; k < components.length;k++){
//             if (perc) {
//                 var val = (layers[components[k]][reg]*0.01)*layers.totale_bevolking[region];
//                 var n = Math.round(val/window.core.downSampling);
//             }
//             else {
//                 var n = Math.round(layers[components[k]][reg]/window.core.downSampling);
//             }
//             // console.log(n);
//             while (n > 0 && allPersonMarkers.length > 0) {
//                 var person = allPersonMarkers.getRandom();
//                 person.addLayer(components[k]);
//                 allPersonMarkers = allPersonMarkers.erase(person);
//                 n -= 1 ;
//             }
//         }
//     }
// }
