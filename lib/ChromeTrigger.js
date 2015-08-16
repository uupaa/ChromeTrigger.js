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
function ChromeTrigger(useApp,        // @arg Boolean = false
                       assets,        // @arg AssetsDirString = "../assets"
                       lang,          // @arg LangString = "en"
                       redirectURL,   // @arg URLString = location.href
                       serviceName) { // @arg String = location.hostname
//{@dev
    $args(ChromeTrigger, arguments);
//}@dev

    var nav = global["navigator"] || {};

    useApp = useApp || false;
    lang = (lang ||
            nav["language"] ||
            nav["userLanguage"] || "en").split("-", 1)[0]; // "en-us" -> "en"

    this._app1   = useApp ? "CHROME" : "AOSP";
    this._app2   = useApp ? "APP"    : "CHROME";
    this._url    = redirectURL || location.href;
    this._lang   = (lang in IntentDialogResource) ? lang : "en";
    this._assets = assets || "../assets";
    this._serviceName = serviceName || location.hostname;
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
    var redirectAppName = _getAlwaysSetting(this._serviceName);
    var dialog = new IntentDialog(this._app1, this._app2,
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
                    _saveAlwaysSetting(that._serviceName, appName);
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
    delete CACHE[CACHE_KEY + "_" + this._serviceName];
}

return ChromeTrigger; // return entity

});

