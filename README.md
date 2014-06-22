# ChromeTrigger.js [![Build Status](https://travis-ci.org/uupaa/ChromeTrigger.js.png)](http://travis-ci.org/uupaa/ChromeTrigger.js)

[![npm](https://nodei.co/npm/uupaa.chrometrigger.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.chrometrigger.js/)

Web Intent implementation. We will say Goodbye Android Browser!

## Document

- [ChromeTrigger.js wiki](https://github.com/uupaa/ChromeTrigger.js/wiki/Home)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```html
<!--
<script src="../node_modules/uupaa.spec.js/lib/Spec.js"></script>
<script src="../node_modules/uupaa.device.js/lib/Device.js"></script>
<script src="../node_modules/uupaa.browser.js/lib/Browser.js"></script>
 -->
<script src="../lib/IntentDialog.js"></script>
<script src="../lib/ChromeTrigger.js"></script>

<script type="text/template" id="js-intent-dialog-template">
  <div id="js-intent-dialog" style="display:none">
    <style>
        (omit)
    </style>
    <div class="frame">
        (omit)
    </div>
  </div>
</script>
```

```js
<script>
function isGoodByeAndroidBrowser() { // @ret Boolean
                                     // @see https://github.com/uupaa/Browser.js/wiki/isGoodByeAndroidBrowser
    var ua = navigator.userAgent;

    if ( /Android/.test(ua) ) {
        var ver = parseFloat(ua.split("Android")[1].split(";")[0]) || 0.0;

        if (ver >= 4.0 && ver < 4.4) {
            if ( /Chrome/.test(ua) && /Version/.test(ua) ) {
                return true;
            } else if ( !/Silk|Firefox/.test(ua) ) {
                return true;
            }
        }
    }
    return false;
}
</script>
```

```js
<script>
//var spec = Browser( Device( Spec() ) );
//var goodbye = Browser.isGoodByeAndroidBrowser(spec);

var debug = true;
var goodbye = isGoodByeAndroidBrowser();

if (debug) {
    goodbye = true;
}
if (goodbye) {
  //var param = { url: location.href };
    var param = { url: "http://caniuse.com/#compare=ios_saf+7.0-7.1,ios_saf+8,android+4.2-4.3,android+4.4,and_chr+0" };

    if (debug) {
        ChromeTrigger.resetAlwaysSetting();
    }
    ChromeTrigger.open(param, function(always) {
        alert("Selected Android browser. " + (always ? "always" : "once"));
    });
}
</script>
```

