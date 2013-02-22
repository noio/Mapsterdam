var feedItems = [];

// Feed Fetchers
function fetchAT5(itemCallback){
    var rq = new Request.JSONP({
      'url':'http://api.at5.nl/v1/news.json?token=df93d1934c7cf764e740fe2dfffddadf71a89025&num=25&latitude=52.374761&longitude=4.895782&radius=15',
      'callbackKey':'callback',
      'onComplete':function(o){
        for (var i = 0; i < o.items.length; i++){
          var item = o.items[i];
          if (!(item.latitude==undefined)){
              item.latLng = new google.maps.LatLng(parseFloat(item.latitude),parseFloat(item.longitude));
              itemCallback(item)
          }
        }
      }
    }).send()
}

// Managing items.
function addFeedItem(item){
    // Create feed item
    var itemLi = new Element('li.item.unselected');
    
    // Create header
    var headerBox =  new Element('div.header.clearfix')
    if (item.image != undefined){
        var img = new Element('div.img').grab(new Element('img',{'src':item.image}));
        headerBox.grab(img,'top');
    }
    headerBox.grab(new Element('h5',{'html':item.title}));

    
    // Create slide-able detail box
    var detailBox = new Element('div.details').grab(new Element('p',{html:item.excerpt}));
    itemLi.addEvent('click', function(e){
        window.core.feedItem = itemLi;
        window.core.render();
    });
    
    
    // Create buttons
    // TODO show markers in Street View
    var buttonSV = new Element('a.button.sv', {'html': 'Bekijk op straat!','href': '#',
        'events': {'click': function(event) {
            event.preventDefault();
            event.stopPropagation();
            var cats = findCategories(item.excerpt);
            window.core.showCategories = cats;
            window.core.layersChanged = true;
            
            window.core.zoomLevel = 'Street View';
            window.core.poi = item.latLng;
            window.core.zoomChanged = true;
            window.core.focusChanged = true;
            

            window.core.render();
        }}});
    var buttonZoom = new Element('a.button.zoom', {'html': 'Zoom', 'href':'#',
        'events': {'click': function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            var cats = findCategories(item.excerpt);
            window.core.showCategories = cats;
            window.core.layersChanged = true;
            
            window.core.zoomLevel = 'in';
            window.core.poi = item.latLng;
            window.core.zoomChanged = true;
            window.core.focusChanged = true;
            window.core.render();
            // var id = getPolyForPoint(item.latLng);
            // if (id == null){
            //     id = getClosestPoly(item.latLng);
            // }
            // if (id != null){
            //     zoomToBounds( sd2010[id]['borders'] );
            // }
            // showLayer(cats);
        }}});
        
    // Extend the itemLi with some functions
    
    itemLi.open = function(){
        this.getElement('.details').slide('show');
        this.getElement('div.img').setStyles({'width':'225px','max-height':'250px'});
        window.core.feedItem.retrieve("marker").setAnimation(google.maps.Animation.BOUNCE);
    }.bind(itemLi);
    
    itemLi.close = function(){
        this.getElement('.details').slide('hide');
        this.getElement('div.img').setStyles({'width':'90px','max-height':'90px'});
        this.retrieve('marker').setAnimation(null);
    }.bind(itemLi);
    
    // GRABBY TIMES
    $$('#feed ul')[0].grab(itemLi);
    itemLi.grab(headerBox);
    itemLi.grab(detailBox);
    detailBox.adopt([buttonSV]);//,buttonZoom]);
    detailBox.slide('hide');
    
    var marker = makeEventMarker(item);
    
    google.maps.event.addListener(marker, 'click', function() {
        window.core.feedItem = itemLi;
        // TODO focus on the item
        window.core.render();
    });
    
    itemLi.store('marker',marker);
    feedItems.push(itemLi);
}


