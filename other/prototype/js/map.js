
function makeEventMarker(item) {
    imageUrl = 'images/icon-news.png'
    
    var markerImage = new google.maps.MarkerImage(imageUrl);
    markerImage.size = new google.maps.Size(32,36);        
    markerImage.scaledSize = new google.maps.Size(32,36);
    
    var marker = new google.maps.Marker({
        'position': item.latLng,
        'title': item.title,
        'map': window.map,
        'icon':markerImage
    });
    return marker;
}



function setMapStyle(mapStyle) {
    var mapType = new google.maps.StyledMapType(mapStyle, {name: "Styled"});
    window.map.mapTypes.set('style', mapType);
    window.map.setMapTypeId('style');
}

function zoomToBounds(polygons) {
    //console.log(bounds);
    // var center = bounds.getCenter();
    var bounds = getPolyBounds(polygons);
    
    window.map.fitBounds(bounds);
    //console.log(window.map.getCenter());
    //console.log(window.map.getZoom())
}

function goToStreetView(loc) {

  window.panorama.setPosition(loc);
  window.panorama.setVisible(true);
}

// THOMAS: Uitgecomment omdat anders systeem gebruikt om
//         markers bij te houden.
// function clearStreetViewMarkers(streetViewMarkers) {
//   if (streetViewMarkers) {
//     for (var i=0;i<streetViewMarkers.length;i++) {
//       streetViewMarkers[i].setMap(null);
//     }
//     streetViewMarkers.length = 0;
//   }
// }

function drawPolyDict(polydict) {
    // Takes a dictionary of buurten or stadsdelen
    
    for (code in polydict) {
        drawPolygons(polydict[code].borders,polydict[code].color);
    }
}

function drawPolygons(polygons, fillColor) {
    // Takes a stadsdelen multi-polygon, based on (lat, lng, alt)
    
    fillColor = typeof(fillColor) != 'undefined' ? fillColor : '#666666';
    
    for (var i = 0; i < polygons.length;i++){
        var arr = new google.maps.MVCArray();
        for (var j = 0; j < polygons[i].length; j++){
            arr.push( new google.maps.LatLng(polygons[i][j][0], polygons[i][j][1] ));
        }
        var gPoly = new google.maps.Polygon({
            'path':arr,
            'strokeColor': '#ffffff',
            'strokeOpacity':0.7,
            'strokeWeight':2,
            'fillColor':fillColor,
            'fillOpacity':0.5,
        });
        gPoly.setMap(window.map);
    }
}

// OVERLAY
function PointerOverlay(item) {
  this.item_ = item;
  this.map_ = window.map;
  this.canvas_ = null;
  this.setMap(map);
}

PointerOverlay.prototype = new google.maps.OverlayView();

PointerOverlay.prototype.onAdd = function() {
    var panes = this.getPanes();
    var canvas = Raphael(panes.overlayLayer,100, 100);
    this.canvas_ = canvas;
}

PointerOverlay.prototype.draw = function() {
  var overlayProjection = this.getProjection();
  var sw = overlayProjection.fromLatLngToDivPixel(this.map_.getBounds().getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.map_.getBounds().getNorthEast());
  var canvas = this.canvas_;
  canvas.setSize(ne.x - sw.x, sw.y - ne.y);
  var start = overlayProjection.fromLatLngToDivPixel(this.item_.retrieve('marker').getPosition());
  var end = this.item_.getPosition();
  var path = canvas.path("M"+(start.x)+" "+(start.y)+"L"+(end.x)+" "+(end.y));
  path.attr("stroke", "#fff");
  path.attr("stroke-width",3)
}

PointerOverlay.prototype.onRemove = function() {
  this.canvas_.remove()
  this.canvas_ = null;
}