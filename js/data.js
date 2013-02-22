var layerMarkers = {}

function showLayer(layerName) {
    myScript = Asset.javascript('json_data/layers/'+layerName+'.js',{
        onLoad:function(){
            var layerData = layers[layerName];
			layerMarkers[layerName] = []
            for (var code in layerData){
                value = layerData[code];
        		if (typeof(layerMeta) == 'undefined' || layerMeta[layerName].area_type=="old"){
        		    code = buurtcodes_old_to_new[code]
        		}
            	if (code in bc2010){
            		var polygons = bc2010[code]['borders'];
            		var nPoints = Math.ceil(value);
            		var randomPoints = randomPointsInPolygons(polygons, nPoints);
            		imageUrl = layerMeta[layerName].icon_small
            		for (var j = 0; j < nPoints; j ++){
            		    
            			var markerImage = new google.maps.MarkerImage(imageUrl);
            				markerImage.size = new google.maps.Size(32,32);        
            				markerImage.scaledSize = new google.maps.Size(32,32);
            			var marker = new google.maps.Marker({
            			  'position': new google.maps.LatLng(randomPoints[j][0],randomPoints[j][1]),
            			  'title': code,
            			  'map': window.map,
            			  'icon':markerImage
            			});
                        layerMarkers[layerName].push(marker);
        			}
        		}
        	}
        }
    });
}
  
