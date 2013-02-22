var layers = {};
var layerMeta = {
    // AANGIFTES
    "diefstal_motorvoertuigen":
    {
        "description": "Diefstal motorvoertuigen",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "zakkenrollers":
    {
        "description": "Zakkenrollers",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "straatroof":
    {
        "description": "Straatroof",
        "category": "Aangiftes",
        "area_type": "old",
        "icon_small": "images/icons/criminal_32.png"
    },

    "overval":
    {
        "description": "Overval",
        "category": "Aangiftes",
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
        "description": "Surinamers",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Suriname.png"
    },

    "antillianen":
    {
        "description": "Antillianen",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "turken":
    {
        "description": "Turken",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "marokkanen":
    {
        "description": "Marokkanen",
        "category": "Aantal allochtonen",
        "area_type": "new",
        "icon_small": "images/flags/Netherlands Antilles.png"
    },

    "autochtonen":
    {
        "description": "Aantal autotochtonen",
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

    // OVERIG
    "prijs_koopwoningen":
    {
        "description": "Prijs per m2 koopwoningen",
        "category": "Overig",
        "area_type": "old"
    },

    // WERKLOOSHEID
    "werkloos_niet_werkzoekend":
    {
        "description": "Percentage Werkloosheid 15 - 64 jarigen niet-werkende werkzoekende",
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
        "description": "Percentage van de bevolking met Lagere School als hoogst genoten opleiding",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "lagermiddelbaar":
    {
        "description": "Percentage van de bevolking met een Lager Middelbaar schoolniveau als hoogst genoten opleiding",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "hogermiddelbaar":
    {
        "description": "Percentage van de bevolking met een Hoger Middelbaar schoolniveau als hoogst genoten opleiding",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },

    "hbowo":
    {
        "description": "Percentage van de bevolking met een HBO of WO opleiding als hoogst genoten opleiding",
        "category": "opleiding",
        "area_type": "stadsdeel"
    },
};

var layerCategories = {
    "populatie": {
        "layers": ['autochtonen', 'turken', 'marokkanen', 'surinamers'],
        "area_type": "new",
        "data_type": "absolute",
        "applies_to": "people"
    },
    "opleiding": {
        "layers": ['lager', 'lagermiddelbaar', 'hogermiddelbaar', 'hbowo'],
        "area_type": "sd",
        "data_type": "percentage",
        "applies_to": "people"
    }
};