(function() {
    'use strict';

    // var vec_layer, cva_layer, map, zoomControl;
    //
    // map = L.map('map', {
    //     crs: L.CRS.EPSG4326,
    //     preferCanvas: true,
    //     center: {
    //         lon: 109.4032,
    //         lat: 24.3120
    //     },
    //     zoom: 15,
    //     zoomControl: false,
    //     attributionControl: false,
    //     keyboard: false
    // });
    // zoomControl = L.control.zoom({
    //     position: 'bottomright',
    //     zoomInText: '+',
    //     zoomOutText: '-',
    //     zoomInTitle: '放大',
    //     zoomOutTitle: '缩小'
    // }).addTo(map);
    // vec_layer = L.tileLayer.wmts('http://t0.tianditu.com/vec_c/wmts', {
    //     tileSize: 256,
    //     layer: 'vec',
    //     style: 'default',
    //     format: 'tile',
    //     tilematrixSet: 'c',
    //     minZoom: 1,
    //     maxZoom: 17,
    //     // detectRetina: true
    // }).addTo(map);
    //
    // cva_layer = L.tileLayer.wmts('http://t0.tianditu.com/cva_c/wmts', {
    //     tileSize: 256,
    //     layer: 'cva',
    //     style: 'default',
    //     format: 'tile',
    //     tilematrixSet: 'c',
    //     minZoom: 1,
    //     maxZoom: 17,
    //     // detectRetina: true
    // }).addTo(map);
    var mapControl = (function() {
        var map,
            layers,
            mapOptions,
            vec_layer,
            zoom,
            cva_layer;
        layers = []
        mapOptions = {
            crs: L.CRS.EPSG4326,
            preferCanvas: true,
            center: {
                lon: 109.4032,
                lat: 24.3120
            },
            zoom: 15,
            zoomControl: false,
            attributionControl: false,
            keyboard: false
        };
        zoom = L.control.zoom({
            position: 'bottomright',
            zoomInText: '+',
            zoomOutText: '-',
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        });
        vec_layer = L.tileLayer.wmts('http://t0.tianditu.com/vec_c/wmts', {
            tileSize: 256,
            layer: 'vec',
            style: 'default',
            format: 'tile',
            tilematrixSet: 'c',
            minZoom: 1,
            maxZoom: 17,
            // detectRetina: true
        });
        cva_layer = L.tileLayer.wmts('http://t0.tianditu.com/cva_c/wmts', {
            tileSize: 256,
            layer: 'cva',
            style: 'default',
            format: 'tile',
            tilematrixSet: 'c',
            minZoom: 1,
            maxZoom: 17,
            // detectRetina: true
        })
        layers = layers.concat([vec_layer, cva_layer]);

        return {
            init: function(id) {
                id = id || 'map';
                map = L.map(id, mapOptions);
                map._addLayers(layers);
                map.addControl(zoom);
                return map;
            },

            resetMap: function() {
                if (map) {
                    layers.forEach(function (item, index) {
                        map.removeLayer(item);
                    })
                    map._addLayers(layers);
                }
            }
        }
    }())

    var gamePanel = (function() {
        var _clock,
            _score = 0,
            _time = 0,
            $gamePanel = $('#game-panel'),
            $timeClock = $('#time-clock'),
            $gameScore = $('#game-score');

            function timeClock(callback, time) {
                time = time || 1000;
                return setInterval(function() {
                    callback(time);
                }, time);
            }

            function removePanel() {
                $gamePanel.transition('fly up');
            }

        return {
            init: function() {
                if (!$gamePanel.is(':hidden')) {
                    $gamePanel.transition('fly down');
                }
            },

            startClock: function(time) {
                _clock = timeClock(function(time) {
                    _time = _time + time/1000;
                    $timeClock.text(_time +'S');
                })
            },
            setScore: function(scorce) {
                _score = scorce;
                $gameScore.text(_score + '分');
            },
            clearClock: function() {
                clearTimeout(_clock);
                removePanel();
            },
        }
    }())



    var gameControl = {

        init: function() {
            var _self = this;
            this.$canvasB = $('#canvasDiv');
            this.$startBtn = $('#start-btn');
            this.$endModal = $('#game-over');
            this.mapControl = mapControl;
            this.map = mapControl.init();
            this.S = S;
            this.bindEvent();
            this.gamePanel = gamePanel;
        },

        start: function() {
            var _self = this;
            this.mapControl.resetMap();
            this.maxArr = this.getMaxImg();
            console.log(this.maxArr)
            this.$startBtn.hide();
            this.$canvasB.show();
            this.preventMapEvent();
            this.S.init(function() {
                _self.$canvasB.hide();
                _self.startKickAss();
                _self.gamePanel.init();
                _self.gamePanel.startClock();
            })
        },

        startKickAss: function() {
            var _self = this;
            this.KICKASSGAME =  startBrowserBlaster(function(num) {
                _self.updateDestroy(num);
            });
        },

        updateDestroy: function(num) {
            this.gamePanel.setScore(num * 10);
            if (num == this.maxArr) {
                this.gamePanel.clearClock();
                this.stop();
            }
        },

        stop: function() {
            var _self = this;
            //解决结束后有部分光效未清除
            $('span.KICKASSELEMENT').hide();
            // this.map.viewreset();
            this.mapControl.resetMap();
            this.KICKASSGAME.destroy();
            this.unPreventMapEvent();
            this.$endModal
                .modal({
                    closable: false,
                    onDeny: function() {
                        _self.$startBtn.show();
                    },
                    onApprove: function() {
                        _self.start();
                    }
                })
                .modal('show');

        },

        bindEvent: function() {
            var _self = this;
            this.$startBtn.on("click", function() {
                _self.start();
            })
        },

        preventMapEvent: function() {
            var _handles = this.map._handlers;
            for (var i in _handles) {
               _handles[i] && _handles[i].disable();
            }
        },

        unPreventMapEvent: function() {
            var _handles = this.map._handlers;
            for (var i in _handles) {
                _handles[i] && _handles[i].enable();
            }
        },

        getMaxImg: function() {
            return $('img').length;
        },

        isOnSreen: function(element) {
            var elementOffset,
                _self = this;
            this.win = this.win || document.getElementsByTagName('body')[0];
            this.winOffset = this.winOffset || {
                left: _self.win.scrollLeft,
                top: _self.win.scrollTop,
                right: _self.win.scrollLeft + _self.win.clientWidth,
                bottom: _self.win.scrollTop + _self.win.clientHeight
            };
            elementOffset = {
                left: element.offsetLeft,
                top: element.offsetTop,
                right: element.offsetLeft + element.offsetWidth,
                bottom: element.scrollTop + element.offsetHeight
            }
            return !(elementOffset.left > this.winOffset.right || this.winOffset.left > elementOffset.right || elementOffset.top > this.winOffset.bottom || this.winOffset.top > elementOffset.bottom);
        },
    }

    gameControl.init();

}());