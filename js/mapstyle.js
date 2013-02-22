var zoomOutStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      { visibility: "off" } 
    ]
  },{
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      { visibility: "on" },
      { hue: "#EFE2AC" },
      { saturation: -80 },
      { lightness: -10 }
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { visibility: "on" },
      { hue: "#EFE2AC" },
      { saturation: -80 },
      { lightness: -10 }
    ]
      },{
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { hue: "#EFE2AC" },
      { visibility: "on" },
      { saturation: -50 },
      { lightness: 20 }
    ]
  },{
    featureType: "administrative",
    elementType: "labels",
    stylers: [
      { visibility: "on" },
      { hue: "#EFE2AC" },
      { saturation: 0 },
      { lightness: 0 },
      { gamma: 0.0 }
    ]
  },{
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      { hue: "#EFE2AC" },
      { lightness: 0 },
      { visibility: "on" },
      { saturation: 40 },
      { gamma: 0 },
    ]
  }
];

var meminStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      { visibility: "off" } 
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { visibility: "on" },
      { saturation: -100 },
      { lightness: -70 }
    ]
  },{
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      { visibility: "on" },
      { saturation: -100 },
      { lightness: -70 }
    ]
  },{
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { visibility: "on" },
      { saturation: -100 },
      { lightness: 40 }
    ]
  },{
    featureType: "administrative",
    elementType: "labels",
    stylers: [
      { visibility: "on" },
      { saturation: -100 },
      { lightness: -10 },
      { gamma: 0.0 }
    ]
  }
];