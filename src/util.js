(function(L, $) {
    'use strict';

    TDTWechat.Util = {
        loadScript: function(url, callback) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function() {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'commplete') {
                    callback && callback();
                    script.onload = script.onreadystatechange = null;
                }
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        parseXML: function(data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }
            try {
                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                console.log("Invalid XML: " + data);
            }
            return xml;
        },

        addMap: function(options) {
            var map, opts,
                zoomControl = null,
                loctionControl = null,
                vec_layer = null,
                lzLayer = null,
                cva_layer = null,
                options = options || {};

            opts = $.extend(true, {
                name: 'map',
                mapoptions: {
                    crs: L.CRS.EPSG4326,
                    // preferCanvas: true,
                    center: {
                        lon: 109.4032,
                        lat: 24.3120
                    },
                    zoom: 15,
                    zoomControl: false,
                    attributionControl: false
                },
                zoomControl: true,
                locationControl: true,
                tdtLayers: false,
                lzLayer: true,
                rightLocationControl: false,
                locationControlCallback: null,
                rightLocationControlCallback: null
            }, options);

            if (localStorage.getItem('lonlat')) {
                var lonlat = JSON.parse(localStorage.getItem('lonlat'));
                opts.mapoptions.center.lon = lonlat.longitude;
                opts.mapoptions.center.lat = lonlat.latitude;
            }

            map = L.map(opts.name, opts.mapoptions);

            if (opts.zoomControl) {
                zoomControl = L.control.zoom({
                    position: 'bottomright',
                    zoomInText: '+',
                    zoomOutText: '-',
                    zoomInTitle: '放大',
                    zoomOutTitle: '缩小'
                }).addTo(map);
            };

            if (opts.locationControl) {
                L.control.location({
                    callback: function() {
                        opts.locationControlCallback && opts.locationControlCallback();
                    }
                }).addTo(map);
            };

            if (opts.rightLocationControl) {
                L.control.location({
                    position: 'bottomright',
                    locationText: '<div class="bg-location"><i class = "icon-location fs8 i-location"></i></div>',
                    locationTitle: '',
                    callback: function() {
                        opts.rightLocationControlCallback && opts.rightLocationControlCallback();
                    }
                }).addTo(map);
            };

            if (opts.tdtLayers) {
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
            }
            // http://222.84.136.150:8070/dfc/services/ogc/wmts/TEST
            if (opts.lzLayer) {
                lzLayer = L.tileLayer.wmts('http://222.84.136.150:8070/dfc/services/ogc/wmts/GOVMAP', {
                    tileSize: 256,
                    layer: 'GOVMAP',
                    style: 'default',
                    format: 'image/png',
                    minZoom: 9,
                    maxZoom: 17,
                    tilematrixSet: 'CustomCRS4326ScaleGOVMAP',
                    detectRetina: true
                }).addTo(map);
                lzLayer = L.tileLayer.wmts('http://222.84.136.150:8070/dfc/services/ogc/wmts/GOVMAPZJ', {
                    tileSize: 256,
                    layer: 'GOVMAPZJ',
                    style: 'default',
                    format: 'image/png',
                    minZoom: 9,
                    maxZoom: 17,
                    tilematrixSet: 'CustomCRS4326ScaleGOVMAPZJ',
                    detectRetina: true
                }).addTo(map);
            }

            return map;
        },
        getCenter: function() {
            var center = {
                x: 109.4032,
                y: 24.3120
            }
            if (localStorage.getItem('lonlat')) {
                var lonlat = JSON.parse(localStorage.getItem('lonlat'));
                center.x = lonlat.longitude;
                center.y = lonlat.latitude;
            }
            return center;
        },
        parseURL: function(url, param) {
            var url = url;
            var paramStr = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var j;
            var paramObj = {};
            for (var i = 0; j = paramStr[i]; i++) {
                paramObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }

            var returnValue = paramObj[param.toLowerCase()];

            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        },
        getIcon: function(index) {
            index = index || 1;
            var icon = L.icon({
                iconUrl: './../img/leaflet-icon/mk.png',
                iconSize: [35, 35],
                iconAnchor: [12, 41],
                popupAnchor: [6, -40],
                shadowSize: [41, 41]
            });
            return icon;
        },
        getPointerIcon: function() {
            return L.icon({
                iconUrl: './../img/leaflet-icon/pointer.png',
                iconSize: [10, 10],
                iconAnchor: [0, 35],
                popupAnchor: [6, -40],
                shadowSize: [41, 41]
            })
        },

        getCenterIcon: function() {
            return L.icon({
                iconUrl: './../img/leaflet-icon/circle.png',
                iconSize: [16, 16],
                iconAnchor: [12, 41],
                popupAnchor: [6, -40],
                shadowSize: [41, 41]
            });
        },

        getSmallIcon: function() {
            return L.icon({
                iconUrl: './../img/leaflet-icon/mk.png',
                iconSize: [24, 24],
                iconAnchor: [12, 41],
                popupAnchor: [6, -40],
                shadowSize: [41, 41]
            })
        },

        getBigIcon: function() {
            return L.icon({
                iconUrl: './../img/leaflet-icon/location-big.png',
                iconSize: [35, 35],
                iconAnchor: [15, 48],
                popupAnchor: [6, -40],
                shadowSize: [41, 41]
            })
        },

        encryptParams: function(obj) {
            var str = '';
            for (var item in obj) {
                str += '&' + item + '=' + obj[item];
            }
            return encodeURI(str);
        },
        decryptParams: function(url) {
            var obj = {},
                url = decodeURI(url),
                paramStr = url.substring(url.indexOf('?') + 1, url.length).split('&');
            for (var i = 0, len = paramStr.length; i < len; i++) {
                if (paramStr[i] == '') {
                    continue;
                }
                var param = paramStr[i],
                    index = param.indexOf('=');
                obj[param.substring(0, index)] = param.substring(index + 1, param.length);
            }
            return obj;
        },
        getDistance: function(Alon, Alat, Blon, Blat) {
            var distance = Math.sin(this.rad(Alat)) * Math.sin(this.rad(Blat)) + Math.cos(this.rad(Alat)) * Math.cos(this.rad(Blat)) * Math.cos(this.rad(Alon - Blon));
            return 6371 * Math.acos(distance);
        },
        rad: function(degree) {
            return degree * Math.PI / 180.0
        }
    }

})(L, $)