var PersonMarker = new Class({
    initialize: function(latLng, region){
        if (typeof(region) == 'undefined'){
            this.region = getClosestPoly(latLng, bc2010);
        } else {
            this.region = region;
        }
        
        this.base       = 'person';
        this.latLng     = latLng;
        this.regionCode = region;
        this.layers     = [];
        this.marker     = new google.maps.Marker({
            'clickable': false,
            'icon':'images/icons/'+this.base+'.png',
            'position': this.latLng
        });
        this.show();
    },
    
    addLayer:function(layer){
        if (this.layers.indexOf(layer) == -1){
            this.layers.push(layer);
            this.layers.sort();
        }
        this.update()
    },
    
    removeLayer: function(layer){
        var idx = this.layers.indexOf(layer);
        if (idx != -1) {
            this.layers.splice(idx,1);
        }
        this.update()
    },
    
    resetLayers: function(){
        this.layers = [];
        this.update();
    },
    
    update: function(){
        var filename = 'images/icons/'+this.base+'.png'
        if (this.layers.length > 0){
            filename = ['images/icons/'+this.base+'_',this.layers.join('_') , '.png'].join('');
        }
        this.marker.setIcon(new google.maps.MarkerImage(filename));
    },
    
    show: function(){
        this.marker.setMap(window.panorama);
        this.update()
    },
    
    hide: function(){
        this.marker.setMap(null);
    },
    
    shrink: function(){
        this.marker.getIcon().anchor = new google.maps.Point(35,70);
        this.marker.getIcon().scaledSize = new google.maps.Size(70,70);
        this.marker.setMap(this.marker.map);
    },
    
    grow: function(){
        this.marker.getIcon().size = new google.maps.Size(100,100);
    },
    
    dressup: function(categories, region){
        categories = (typeof(categories) != 'undefined')? categories: window.core.categories;
        region     = (typeof(region) != 'undefined') ? region: this.region;
        this.resetLayers();
        for (var j = 0;j < categories.length; j++) {
            var category = layerCategories[categories[j]];
            if (category.applies_to == this.base){
                var proportions = [];
                for (var k = 0;k<category.layers.length;k++){
                    proportions.push(layers[category.layers[k]][region]);
                }
                if (category.data_type == 'percentage') {
                    var layer = rouletteSelect(category.layers, proportions, 100);
                } else {
                    var layer = rouletteSelect(category.layers, proportions);
                }
                if (layer != null) {
                    this.addLayer(layer);
                }
            }
        }
    }
    
});
