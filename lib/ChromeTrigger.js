(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ChromeTrigger", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
var IntentDialog = global["WebModule"]["IntentDialog"];

// --- define / local variables ----------------------------
var _storage = global["localStorage"] || null;
var LOCAL_STORAGE_KEY = "CHROME_TRIGGER_ALWAYS";

// --- class / interfaces ----------------------------------
function ChromeTrigger(appName1,  // @arg AppNameString = "AOSP"   - candidate App name 1
                       appName2,  // @arg AppNameString = "CHROME" - candidate App name 2
                       openURL) { // @arg URLString = location.href - open url after redirect.
    this._keyword  = location.hostname + location.pathname + location.search; // storage keyword
    this._appName1 = appName1 || "AOSP";
    this._appName2 = appName2 || "CHROME";
    this._url      = openURL  || location.href;
}

ChromeTrigger["AOSP"] = AOSP();
ChromeTrigger["LANG"] = (global["navigator"]["language"] || "ja").split("-", 1)[0];
ChromeTrigger["VERBOSE"] = false;
ChromeTrigger["AUTO_CLOSE"] = 2; // time to redirect dialog automatically closes. (unit: sec)
ChromeTrigger["repository"] = "https://github.com/uupaa/ChromeTrigger.js";
ChromeTrigger["prototype"] = Object.create(ChromeTrigger, {
    "constructor":  { "value": ChromeTrigger        }, // new ChromeTrigger(...):ChromeTrigger
    "open":         { "value": ChromeTrigger_open   }, // ChromeTrigger#open(callback:Function):void
    "reset":        { "value": ChromeTrigger_reset  }, // ChromeTrigger#reset():void
});

// --- implements ------------------------------------------
function AOSP() { // @ret Boolean
    var ua = global["navigator"]["userAgent"];

    if (/Android/.test(ua)) {
        var osVer = parseFloat(ua.split("Android")[1].trim().split(/[^\w\.]/)[0]);

        if (/(Chrome|Firefox)/.test(ua)) { // Chrome for Android, Firefox for Android
            //
        } else if (/Android/.test(ua)) { // AOSP Stock Browser
            if (osVer >= 4 && osVer < 4.4) {
                return true;
            }
        }
    }
    return false;
}

function ChromeTrigger_open(callback) { // @arg Function = null - AOSP selected callback. callback(always:Boolean):void
    var that = this;

    if (document.readyState === "complete") {
        _open.call(that, callback);
    } else {
        global.addEventListener("load", function() {
            _open.call(that, callback);
        });
    }
}

function _open(callback) {
    var that = this;
    var lang = ChromeTrigger["LANG"];
    var redirectAppName = _getAlwaysSetting(this._keyword);
    var dialog = new IntentDialog(this._appName1, this._appName2,
                                  this._url, lang, _handleClickEvent);

    if (redirectAppName) {
        dialog["mode"] = "REDIRECT";
        dialog["selected"] = redirectAppName;
        dialog["open"]();

        setTimeout(function() {
            dialog["close"]();
            dialog["intent"](redirectAppName, that._url);
        }, ChromeTrigger["AUTO_CLOSE"] * 1000);
    } else {
        dialog["mode"] = "SELECT";
        dialog["open"]();
    }

    function _handleClickEvent(event) {
        var id = event["id"]; // button id
        var appName = dialog["selected"];

        if (id === "once" || id === "always") {
            dialog["close"]();

            if (appName === "CHROME" || appName === "APP") {
                if (id === "always") { // always -> save settings
                    _saveAlwaysSetting(that._keyword, appName);
                }
                dialog["intent"](appName, that._url);
            } else {
                if (callback) {
                    callback(id === "always"); // AOSP selected callback
                }
            }
        }
    }
}

function _saveAlwaysSetting(keyword, appName) {
    if (_storage) {
        try {
            _storage[LOCAL_STORAGE_KEY + "_" + keyword] = appName;
        } catch(err) {
            //
        }
    }
}

function _getAlwaysSetting(keyword) { // @ret Boolean
    if (_storage) {
        return _storage[LOCAL_STORAGE_KEY + "_" + keyword];
    }
    return false;
}

function ChromeTrigger_reset() {
    if (_storage) {
        delete _storage[LOCAL_STORAGE_KEY + "_" + this._keyword];
    }
}

return ChromeTrigger; // return entity

});

