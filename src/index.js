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
        attributionControl: false,
        keyboard: false
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
        // detectRetina: true
    }).addTo(map);

    cva_layer = L.tileLayer.wmts('http://t0.tianditu.com/cva_c/wmts', {
        tileSize: 256,
        layer: 'cva',
        style: 'default',
        format: 'tile',
        tilematrixSet: 'c',
        minZoom: 1,
        maxZoom: 17,
        // detectRetina: true
    }).addTo(map);

    // $('#start-btn').on("click", function() {
    //     $(this).hide();
    //     S.init(function() {
    //         document.getElementById('canvasDiv').style.display = 'none';
    //         startBrowserBlaster();
    //     })
    // })

    var gamePanel = (function() {
        var timeClock,
            _score = 0,
            _time = 0,
            $gamePanel = $('#game-panel'),
            $timeClock = $('#time-clock'),
            $gameScore = $('#game-score');

            timeClock = function(callback, time) {
            time = time || 1000;
            return setInterval(function() {
                callback(time);
            }, time);
        }

        return {
            init: function() {
                $gamePanel.transition('fly down');
            },

            startClock: function(time) {
                timeClock(function(time) {
                    _time = _time + time/1000;
                    $timeClock.text(_time +'S');
                })
            },
            setScore: function(scorce) {
                _score = scorce;
                $gameScore.text(_score + '分');
            },
            clearClock: function() {
                clearTimeout(timeClock);
            }
        }
    }())

    var gameControl = {

        init: function() {
            var _self = this;
            this.$canvasB = $('#canvasDiv');
            this.$startBtn = $('#start-btn');
            this.$endModal = $('#game-over');
            this.map = map;
            this.S = S;
            this.maxArr = $('img').length;
            this.bindEvent();
            this.gamePanel = gamePanel;
        },

        start: function() {
            var _self = this;
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
                console.log(num);
                _self.updateDestroy(num);
            });
        },

        updateDestroy: function(num) {
            this.gamePanel.setScore(num * 10);
            if (num == this.maxArr) {
                this.stop();
            }
        },

        stop: function() {
            // this.$startBtn.show();
            this.KICKASSGAME.destroy();
            this.unPreventMapEvent();
            this.$endModal.modal('show');

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


    }

    gameControl.init();

}());