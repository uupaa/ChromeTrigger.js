# ChromeTrigger.js [![Build Status](https://travis-ci.org/uupaa/ChromeTrigger.js.png)](http://travis-ci.org/uupaa/ChromeTrigger.js)

[![npm](https://nodei.co/npm/uupaa.chrometrigger.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.chrometrigger.js/)

Web Intent implementation. We will say Goodbye Android Browser!

## Document

- [ChromeTrigger.js wiki](https://github.com/uupaa/ChromeTrigger.js/wiki/Home) ([Slide](http://uupaa.github.io/Slide/slide/ChromeTrigger.js/index.html))
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

## How to use

```html
<script src="../node_modules/Spec.js/lib/Spec.js"></script>
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
var spec = new Spec();

var goodbye = spec.CHROME_TRIGGER || confirm("This is not a AOSP(Android) browser. Do you want to simulate that?");

if (goodbye) {
  //var param = { url: location.href }; // Reopen this page in Chrome Browser.
    var param = { url: "http://caniuse.com/#compare=ios_saf+7.0-7.1,ios_saf+8,android+4.2-4.3,android+4.4,and_chr+0" };

    if ( confirm("Reset always open setting?") ) {
        ChromeTrigger.resetAlwaysSetting();
    }
    ChromeTrigger.ready(function() {
        ChromeTrigger.open(param, function(always) {
            alert("User selected AOSP(Android) browser. " + (always ? "open always" : "open once"));
        });
    });
}
</script>
```

