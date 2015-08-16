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
var IntentDialogResource = IntentDialog["resource"];

// --- define / local variables ----------------------------
var CACHE = global["localStorage"] || {};
var CACHE_KEY = "CHROME_TRIGGER_ALWAYS";

// --- class / interfaces ----------------------------------
function ChromeTrigger(appName1,    // @arg AppNameString = "AOSP"   - candidate App name 1
                       appName2,    // @arg AppNameString = "CHROME" - candidate App name 2
                       lang,        // @arg LangString = "en"
                       assets,      // @arg AssetsDirString = "./"
                       redirectURL, // @arg URLString = location.href - open url after redirect.
                       id) {        // @arg IDString = location.hostname - keyword for save setting.
//{@dev
    $args(ChromeTrigger, arguments);
    $valid($some(appName1, "AOSP|CHROME|APP"), ChromeTrigger, "appName1");
    $valid($some(appName2, "AOSP|CHROME|APP"), ChromeTrigger, "appName2");
    $valid(appName1 !== appName2, ChromeTrigger, "appName2");
//}@dev

    this._appName1 = appName1 || "AOSP";
    this._appName2 = appName2 || "CHROME";
    this._url      = redirectURL || location.href;
    this._lang     = (lang in IntentDialogResource) ? lang : "en";
    this._assets   = assets || "./";
    this._id       = id || location.hostname;
}

ChromeTrigger["VERBOSE"] = false;
ChromeTrigger["AUTO_CLOSE"] = 2; // time to redirect dialog automatically closes. (unit: sec)
ChromeTrigger["repository"] = "https://github.com/uupaa/ChromeTrigger.js";
ChromeTrigger["prototype"] = Object.create(ChromeTrigger, {
    "constructor":  { "value": ChromeTrigger        }, // new ChromeTrigger(...):ChromeTrigger
    "open":         { "value": ChromeTrigger_open   }, // ChromeTrigger#open(callback:Function = null):void
    "reset":        { "value": ChromeTrigger_reset  }, // ChromeTrigger#reset():void
});

// --- implements ------------------------------------------
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
    var redirectAppName = _getAlwaysSetting(this._id);
    var dialog = new IntentDialog(this._appName1, this._appName2,
                                  this._lang, this._assets, _handleClickEvent);
    if (redirectAppName) {
        dialog["mode"] = "REDIRECT";
        dialog["selected"] = redirectAppName;
        dialog["open"]();

        setTimeout(function() {
            dialog["close"]();
            _redirect(that._lang, redirectAppName, that._url);
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
                    _saveAlwaysSetting(that._id, appName);
                }
                _redirect(that._lang, appName, that._url);
            } else {
                if (callback) {
                    callback(id === "always"); // AOSP selected callback
                }
            }
        }
    }
}

function _redirect(lang, appName, url) {
    var packageName = IntentDialogResource[lang][appName]["PACKAGE"];
    var intentURL = global["WebModule"]["WebIntent"]["build"](packageName, url);

    if (ChromeTrigger["VERBOSE"]) {
        alert("WebIntent: " + intentURL);
    }
    global["WebModule"]["WebIntent"]["redirect"](intentURL);
}

function _saveAlwaysSetting(keyword, appName) {
    try {
        CACHE[CACHE_KEY + "_" + keyword] = appName;
    } catch(err) {
        //
    }
}

function _getAlwaysSetting(keyword) { // @ret String
    return CACHE[CACHE_KEY + "_" + keyword] || "";
}

function ChromeTrigger_reset() {
    delete CACHE[CACHE_KEY + "_" + this._id];
}

return ChromeTrigger; // return entity

});

