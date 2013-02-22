var layers = {};
var layerMeta = {
    // AANGIFTES
    "diefstal_motorvoertuigen":
    {
        "description": "Aantal aangiftes diefstal motorvoertuigen",
        "category": "criminaliteit",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "straatr_zakkenr":
    {
        "description": "Straatroof en Zakkenrollers",
        "category": "criminaliteit",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "woninginbraak":
    {
        "description": "Woninginbraak",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "fietsendiefstal":
    {
        "description": "Fietsendiefstal",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "diefstal_uit_auto":
    {
        "description": "Diefstal uit auto",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "huisgeweld":
    {
        "description": "Huisgeweld per 1000 huishoudens",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    // AANTAL ALLOCHTONEN
    "surinamers":
    {
        "description": "Surinamer",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Suriname.png"
    },

    "antillianen":
    {
        "description": "Antilliaan",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "turken":
    {
        "description": "Turk",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "marokkanen":
    {
        "description": "Marokkaan",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "autochtonen":
    {
        "description": "Autochtoon",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "totale_bevolking":
    {
        "description": "Totale bevolking",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },
	
    "overig":
    {
        "description": "Overige Allochtonen",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },	

    // OVERIG
    "prijs_koopwoningen":
    {
        "description": "Prijs per m2 koopwoningen",
        "category": "Overig",
        "area_type": "old"
    },

    // WERKLOOSHEID
    "werkloos":
    {
        "description": "Werkloos",
        "category": "Werkloosheid",
        "area_type": "old"
    },

    "werkloos_met_uitkering":
    {
        "description": "Percentage 15 - 64 jarigen met een WWB uitkering (wet werk en bijstand)",
        "category": "Werkloosheid",
        "area_type": "old"
    },

    //Opleidingsniveau
    "lager":
    {
        "description": "Lagere School afgemaakt",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "lagermiddelbaar":
    {
        "description": "MAVO of VMBO afgemaakt",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "hogermiddelbaar":
    {
        "description": "HAVO of VWO afgemaakt",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "hbowo":
    {
        "description": "HBO of universiteit afgemaakt",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    // INKOMEN
    "inkomensklasse_0":
    {
        "description": "Verdient minder dan 11.600 euro",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

    "inkomensklasse_1":
    {
        "description": "Verdient tussen de 11.600 en 18.500 euro",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

    "inkomensklasse_2":
    {
        "description": "Verdient tussen de 18.500 en 27.900 euro",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

    "inkomensklasse_3":
    {
        "description": "Verdient tussen de 27.900 en 39.700 euro",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

    "inkomensklasse_4":
    {
        "description": "Verdient meer dan 39.700",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

    "woningvoorraad":
    {
        "description": "Aantal woningen in stadsdeel",
        "category": "inkomen",
        "area_type": "stadsdeel"
    },

};

var layerCategories = {
    "populatie": {
        "layers": ['autochtonen', 'turken', 'marokkanen', 'surinamers','antillianen', 'overig'],
        "area_type": "new",
        "data_type": "absolute",
        "applies_to": "person"
    },
    "opleiding": {
        "layers": ['lager', 'lagermiddelbaar', 'hogermiddelbaar', 'hbowo'],
        "area_type": "sd",
        "data_type": "percentage",
        "applies_to": "person"
    },

    "werkloosheid": {
        "layers": ['werkloos'],
        "area_type": "sd",
        "data_type": "percentage",
        "applies_to": "person"
    },

    "criminaliteit": {
        "layers": ['straatr_zakkenr'],
        "area_type": "sd",
        "data_type": "percentage",
        "applies_to": "person"
    },

    "inkomen": {
        "layers": ['inkomensklasse_0', 'inkomensklasse_1', 'inkomensklasse_2', 'inkomensklasse_3', 'inkomensklasse_4'],
        "area_type": "new",
        "data_type": "absolute",
        "applies_to": "person"
    },


};