var feedItems = [];

var FeedItem = new Class({
    initialize: function(item){
		
		var foundKeywordsExcerpt = findCategories(item.excerpt);
		var foundKeywordsTitle = findCategories(item.title);
		
		this.categories = foundKeywordsExcerpt['categories'].concat(foundKeywordsTitle['categories']);	
		
		
		//console.log(item.title + ':' + this.categories);
	
        // Create feed item
        this.element = new Element('li.item.unselected');
        this.element.store('feedItem',this);
        // Create header
        var headerBox =  new Element('div.header.clearfix')
        headerBox.grab(new Element('h5',{'html':item.title}));
        if (item.images.length > 0){
            var img = new Element('div.img').grab(new Element('img',{'src':item.images[0].thumb}));
            headerBox.grab(img,'top');
        }
        // Create slide-able detail box
        var detailBox = new Element('div.details')
		detailBox.grab(new Element('p',{html:foundKeywordsExcerpt['text']}));
        this.element.addEvent('click', function(e){
            //window.core.zoomIn(this.region[0]);
            window.core.setFeedItem(this);
			window.core.setCategories(this.categories);
        }.bind(this));
        // Create buttons
        var buttonSV = new Element('a.button.sv', {'html': 'Bekijk op straat!','href': '#',
            events: {'click': function(event) {
                event.preventDefault();
                event.stopPropagation();
                //var cats = ['populatie', 'opleiding','inkomen'];
                window.core.zoomToStreetView(item.latLng);
                
            }}
        });
        var sourceLink = new Element('a.button.source', {'html': "Bron", 'href': item.link,'target':'_blank'});
        var buttonMinus = new Element('a.button.minus',{'html':'M','href':'#',
            'events':{click:function(event){
                event.stopPropagation()
                this.closeDetails();
            }.bind(this)}
        })
        // GRABBY TIMES
        $$('#feed ul')[0].grab(this.element);
        this.element.grab(headerBox);
        this.element.grab(detailBox);
        detailBox.grab(new Element('div.buttons').adopt([buttonSV,sourceLink,buttonMinus]));//,buttonZoom]);
        detailBox.slide('hide');
        this.marker = makeEventMarker(item);
        this.position = this.marker.getPosition();
        google.maps.event.addListener(this.marker, 'click', function(event){
            window.core.setFeedItem(this);
        }.bind(this));
        this.region = getClosestPoly(this.marker.getPosition(),sd2010);
    },
    
    grow: function(){
        this.marker.scaledSize = new google.maps.Size(96,108);
    },
    
    shrink: function(){
        this.marker.scaledSize = new google.maps.Size(32,36);
    },
    
    openDetails: function(){
        this.element.getElement('.details').slide('show');
        this.element.getElements('div.img').setStyles({'width':'235px','max-height':'250px'});
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        if (window.core.zoomLevel == ZOOM_LEVEL_OUT) {
            window.core.zoomSD(this.region);
        }
    },
    closeDetails: function(){
        this.element.getElement('.details').slide('hide');
        this.element.getElements('div.img').setStyles({'width':'90px','max-height':'90px'});
        this.marker.setAnimation(null);
    },
    hide: function(){
        this.element.hide();
        this.marker.setMap(null);
    },
    show: function(){
        this.element.show();
        if (this.marker.map == null){
            this.marker.setMap(window.map);
        }
    }
})

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
    var feedItem = new FeedItem(item);
    feedItems.push(feedItem);
}

