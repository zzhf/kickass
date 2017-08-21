// requestAnimationFrame polyfill
(function(window) {
    'use strict';
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}(window));


(function(window) {
    'use strict';

    var Class = function(methods) {
        var ret = function() {
            if (ret.$prototyping)
                return this;
            if (typeof this.initialize == 'function')
                return this.initialize.apply(this, arguments);
        };
        if (methods.Extends) {
            ret.parent = methods.Extends;
            methods.Extends.$prototyping = true;
            ret.prototype = new methods.Extends;
            methods.Extends.$prototyping = false;
        }
        for (var key in methods)
            if (methods.hasOwnProperty(key))
                ret.prototype[key] = methods[key];
        return ret;
    };
    var a = function() {
        console.log(new Date());
        requestAnimationFrame(a);
    }
    requestAnimationFrame(function() {
        // a();
    })


}(window));