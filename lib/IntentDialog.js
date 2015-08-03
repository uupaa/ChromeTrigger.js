(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("IntentDialog", function moduleClosure(/* global */) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function IntentDialog(appName1,   // @arg String - app name 1.
                      appName2,   // @arg String - app name 2.
                      url,        // @arg URLString - redirect url.
                      lang,       // @arg String - content language. "en", "ja"
                      callback) { // @arg Function - click event callback(event)
    this._appName1   = appName1;
    this._appName2   = appName2;
    this._url        = url;
    this._lang       = (lang in IntentDialog["resource"]) ? lang : "en";
    this._callback   = callback;
    this._outerFrame = null;
    this._mode       = "SELECT"; // "SELECT" or "REDIRECT" -> resource prefix
    this._selected   = "CHROME"; // selected app name. "CHROME" or "APP" or "AOSP" -> resource prefix
    this._iconNodes  = null;
    this._buttonNodes = null;
    this._iconButtonNodes = null;
}

IntentDialog["resource"] = {
    "en": {
        "DIALOG": {
            "CAPTION":          "Complete action using",
            "ALWAYS_BUTTON":    "Always",
            "JUST_ONCE_BUTTON": "Just once",
        },
        "CHROME": {
            "ICON":             "./chrome.png",
            "CAPTION":          "Chrome",
            "PACKAGE":          "com.android.chrome",
            "REDIRECT_CAPTION": "Redirect to Google Chrome...",
        },
        "AOSP": {
            "ICON":             "./browser.png",
            "CAPTION":          "Browser",
            "PACKAGE":          "",
            "REDIRECT_CAPTION": "",
        },
        "APP": {
            "ICON":             "./store.png",
            "CAPTION":          "YOUR-APP",
            "PACKAGE":          "com.corp.appname",
            "REDIRECT_CAPTION": "Redirect to YOUR-APPLICATION...",
        }
    }
};
IntentDialog["VERBOSE"] = false;
IntentDialog["template"] = "";
IntentDialog["prototype"] = Object.create(IntentDialog, {
    "constructor":  { "value": IntentDialog              },  // new IntentDialog(...):IntentDialog
    "open":         { "value": IntentDialog_open         },  // IntentDialog#open():void
    "close":        { "value": IntentDialog_close        },  // IntentDialog#close():void
    "intent":       { "value": IntentDialog_intent       },  // IntentDialog#intent(appName:String, url:URLString):void
    "selected": {
        "get":      function()  { return this._selected; },
        "set":      function(v) { this._selected = v;    } },
    "mode": {
        "set":      function(v) { this._mode = v;        }   // IntentDialog#mode:String
    },
});

// --- implements ------------------------------------------
function IntentDialog_open() {
    if (!this._outerFrame) {
        document.body.innerHTML += _localization.call(this, IntentDialog["template"], this._lang, this._mode === "REDIRECT");

        this._outerFrame      = document.querySelector("#js-intent-dialog");
        this._iconNodes       = document.querySelectorAll("#js-intent-dialog .icon-button > img");
        this._buttonNodes     = document.querySelectorAll("#js-intent-dialog .buttons > div.button");
        this._iconButtonNodes = document.querySelectorAll("#js-intent-dialog .icon-button");

        if (this._mode === "SELECT") {
            _setupIcons(this);
            document.querySelector("#js-intent-dialog .buttons").style.visibility = "visible";
        }
        this._outerFrame.style.display = "block"; // show modal dialog
    }
}

function _setupIcons(that) {
    // --- setup icon button event handlers ---
    that._iconButtonNodes[0].onclick = function() {
        that._selected = that._appName1;
        _enableItem(that, "app1");
    };
    that._iconButtonNodes[1].onclick = function() {
        that._selected = that._appName2;
        _enableItem(that, "app2");
    };
    document.querySelector("#js-intent-dialog .icons").style.visibility = "visible";
}

function _enableItem(that, id) {
    switch (id) {
    case "app1":
        _removeCSSClass(that._iconNodes[1].parentNode, "selected");
        _addCSSClass(that._iconNodes[0].parentNode, "selected");
        _addCSSClass(that._buttonNodes[0], "enable");
        _addCSSClass(that._buttonNodes[1], "enable");
        that._buttonNodes[0].onclick = _alwaysClick;
        that._buttonNodes[1].onclick = _onceClick;
        break;
    case "app2":
        _removeCSSClass(that._iconNodes[0].parentNode, "selected");
        _addCSSClass(that._iconNodes[1].parentNode, "selected");
        _addCSSClass(that._buttonNodes[0], "enable");
        _addCSSClass(that._buttonNodes[1], "enable");
        that._buttonNodes[0].onclick = _alwaysClick;
        that._buttonNodes[1].onclick = _onceClick;
    }

    function _alwaysClick() {
        that._callback({ "type": "click", "id": "always" });
    }
    function _onceClick() {
        that._callback({ "type": "click", "id": "once" });
    }
}

function IntentDialog_close() {
    document.body.removeChild(this._outerFrame); // hide dialog
    this._outerFrame = null;
}

function IntentDialog_intent(appName, // @arg String
                             url) {   // @arg URLString
                                      // @desc open intent url.
    var packageName = IntentDialog["resource"][this._lang][appName]["PACKAGE"];
    var intentURL = _createIntentURL(url, packageName);

    if (IntentDialog["VERBOSE"]) {
        alert("Open Intent URL:\n" + intentURL);
    }
    location.href = intentURL; // redirect
}

function _createIntentURL(url, packageName) {
    var scheme = /^https/.test(url) ? "https" : "http";

    url = url.replace(/^https?\:\/\//, "");

    // https://developer.chrome.com/multidevice/android/intents
    var result =
            "intent://" + url + // URL is not necessary to encodeURIComponentencode.
            "#Intent;" +
                "package=" + packageName + ";" +
                "action=android.intent.action.VIEW;" +
                "scheme=" + scheme + ";" +
            "end";

    return result;
}

function _removeCSSClass(node, className) {
    node.className = (" " + node.className + " ").replace(new RegExp("\\s" + className + "\\s", "g"), "").trim();
}

function _addCSSClass(node, className) {
    if (node.className.indexOf(className) < 0) {
        node.className += " " + className;
    }
}

function _localization(fragment, lang, redirectMode) {
    var res = IntentDialog["resource"][lang];

    return fragment.replace("DIALOG.CAPTION",          redirectMode ? res[this._selected]["REDIRECT_CAPTION"]
                                                                    : res["DIALOG"]["CAPTION"]).
                    replace("DIALOG.ALWAYS_BUTTON",    res["DIALOG"]["ALWAYS_BUTTON"]).
                    replace("DIALOG.JUST_ONCE_BUTTON", res["DIALOG"]["JUST_ONCE_BUTTON"]).
                    replace("APP.CAPTION",             res[this._appName1]["CAPTION"]).
                    replace("APP.CAPTION",             res[this._appName2]["CAPTION"]).
                    replace("APP.ICON",                res[this._appName1]["ICON"]).
                    replace("APP.ICON",                res[this._appName2]["ICON"]);
}

return IntentDialog; // return entity

});

