var PersonMarker = new Class({
    initialize: function(latLng, region){
        if (typeof(region) == 'undefined'){
            region = getClosestPoly(latLng,bc2010);
        }
        
        this.base       = 'person';
        this.latLng     = latLng;
        this.regionCode = region;
        this.layers     = [];
        this.marker     = new google.maps.Marker({
            'clickable': true,
            'icon':'images/icons-people/'+this.base+'.png',
            'position': this.latLng
        });
        // this.info_window = new google.maps.InfoWindow({
        //     'content': "No layers are visible",
        //     'position':this.latLng
        // });
        // google.maps.event.addListener(this.marker, 'click', function() {
        //         
        //     info_window.open(window.panorama);
        // });
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
        var filename = 'images/icons-people/'+this.base+'.png'
        if (this.layers.length > 0){
            filename = ['images/icons-people/'+this.base+'_',this.layers.join('_') , '.png'].join('');
        }
        this.marker.setIcon(filename);
    },
    
    show: function(){
        this.marker.setMap(window.panorama);
        this.update()
    },
    
    hide: function(){
        this.marker.setMap(null);
    }
    
});
