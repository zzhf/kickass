(function() {
    'use strict';

    var vec_layer, cva_layer, map, zoomControl;

    map = L.map('map', {
        crs: L.CRS.EPSG4326,
        preferCanvas: true,
        center: {
            lon: 109.4032,
            lat: 24.3120
        },
        zoom: 15,
        zoomControl: false,
        attributionControl: false
    });
    zoomControl = L.control.zoom({
        position: 'bottomright',
        zoomInText: '+',
        zoomOutText: '-',
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);
    vec_layer = L.tileLayer.wmts('http://t0.tianditu.com/vec_c/wmts', {
        tileSize: 256,
        layer: 'vec',
        style: 'default',
        format: 'tile',
        tilematrixSet: 'c',
        minZoom: 1,
        maxZoom: 17,
        detectRetina: true
    }).addTo(map);

    cva_layer = L.tileLayer.wmts('http://t0.tianditu.com/cva_c/wmts', {
        tileSize: 256,
        layer: 'cva',
        style: 'default',
        format: 'tile',
        tilematrixSet: 'c',
        minZoom: 1,
        maxZoom: 17,
        detectRetina: true
    }).addTo(map);
}());