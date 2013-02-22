function checkPointInPolygon(poly, x, y){
    var i, j, c = 0;
    var npol = poly.length;
    for (i = 0, j = npol-1; i < npol; j = i++) {
        // console.log(poly[i]);
        if ((((poly[i][1] <= y) && (y < poly[j][1])) ||
        ((poly[j][1] <= y) && (y < poly[i][1]))) &&
        (x < (poly[j][0] - poly[i][0]) * (y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]))
            c =! c;
    }
    return c;
}

function randomPointsInPolygons(polys, num){
    num       = (num != undefined) ? num : 1;
    max_tries = 10000*num
    
    var bounds = getPolyBounds(polys);
    
    var minlat = bounds.getSouthWest().lat();
    var minlng = bounds.getSouthWest().lng();
    var maxlat = bounds.getNorthEast().lat();
    var maxlng = bounds.getNorthEast().lng();
    
    var points = [];
    var tries  = 0;
    while (points.length < num && tries < max_tries){
        randomlat = minlat + Math.random()*(maxlat-minlat);
        randomlng = minlng + Math.random()*(maxlng-minlng);
        tries ++;
        for (var j = 0; j <polys.length; j ++){
            poly = polys[j];
            if (checkPointInPolygon(poly, randomlat, randomlng)){
                points.push([randomlat,randomlng])
            }
        }
    }
    return points
}

function getPolyForPoint(location, polydict){
    
    polydict = typeof(polydict) != 'undefined' ? polydict : sd2010;
    
    // Assumes a dictionary of buurten/stadsdelen, in which each contains an array of polygons.
    for (var id in polydict){
        for (var i = 0;i < polydict[id]['borders'].length;i++) {
            if (checkPointInPolygon(polydict[id]['borders'][i],location.lat(),location.lng()) ) {
                //console.log(polydict[id]['borders']);
                return id;
            }
        }
    }
    return null
}

function getPolyArea(polys){
    // Returns area of a list of polygons in square meters
    area = 0;
    for (var i = 0; i < polys.length;i++){
        var arr = new google.maps.MVCArray();
        for (var j = 0; j < polys[i].length; j++){
            arr.push( new google.maps.LatLng(polys[i][j][0], polys[i][j][1] ));
        }
        area += google.maps.geometry.spherical.computeArea(arr);
    }
    return area;
}

function getClosestPoly(location, polydict){
    
    polydict = typeof(polydict) != 'undefined' ? polydict : sd2010;
    
    var closestId = null;
    var closestDist = Infinity;
    // Assumes a dictionary of buurten/stadsdelen, in which each contains an array of polygons.
    for (var id in polydict){
        for (var i = 0;i < polydict[id]['borders'].length;i++) {
            for (var j = 0;j < polydict[id]['borders'][i].length;j++){
                node = new google.maps.LatLng(polydict[id]['borders'][i][j][0], polydict[id]['borders'][i][j][1]);
                var dist = google.maps.geometry.spherical.computeDistanceBetween(location, node);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestId = id;
                }
            }
        }
    }
    return closestId;
}

function getPolyBounds(polygons){
    
    // Takes a bounding rectangle of the polygons given and zomms the map to this rectangle
    var lat_min = Infinity;
    var lat_max = -Infinity;
    var lng_min = Infinity;
    var lng_max = -Infinity;
    //console.log(polygons);
    for (var i = 0;i<polygons.length;i++){
        for (var j = 0;j<polygons[i].length;j++){
            var lat = polygons[i][j][0];
            var lng = polygons[i][j][1];
            if (lat < lat_min){
                lat_min = lat;
            }
            if (lat > lat_max){
                lat_max = lat;
            }
            if (lng < lng_min){
                lng_min = lng;
            }
            if (lng > lng_max){
                lng_max = lng;
            }
        }
    }
    var sw = new google.maps.LatLng(lat_min,lng_min);
    var ne = new google.maps.LatLng(lat_max,lng_max);
    return new google.maps.LatLngBounds(sw, ne);
}


function rouletteSelect(values, probabilities, normalization){
    // Selects a random value from first input, with probabilities
    // corresponding to second input array.
    
    var i = 0;
    if (typeof(normalization) == 'undefined'){
        normalization = 0.0;
        for (i = 0; i < probabilities.length; i ++){
            normalization += probabilities[i]
        }
    }
    for (i = 0; i < probabilities.length; i ++){
        probabilities[i] = probabilities[i]/normalization;
    }
    cum_probs = []
    for (i = 0; i < probabilities.length; i ++){
        cum_probs[i] = 0.0;
        for (var j = 0; j <= i; j++){
            cum_probs[i] += probabilities[j]
        }
    }
    var r = Math.random();
    for (i = 0; i < cum_probs.length; i ++){
        if (r <= cum_probs[i]){
            return values[i];
        }
    }
    return null;
}