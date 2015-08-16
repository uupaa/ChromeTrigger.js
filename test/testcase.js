var ModuleTestChromeTrigger = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("ChromeTrigger", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false, // enable worker test.
        node:       false, // enable node test.
        nw:         false, // enable nw.js test.
        button:     false, // show button.
        both:       false, // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        // generic test
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        testChromeTrigger,
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testChromeTrigger(test, pass, miss) {
    var DEBUG = true;

    var ua = new UserAgent();
    var assetsDir = "/ChromeTrigger.js/assets";

    if (DEBUG) {
        ChromeTrigger["VERBOSE"] = true;
        IntentDialog["VERBOSE"]  = true;

        var goodbye = ua.AOSP ||
                      confirm("This is not a AOSP Stock browser. Do you want to simulate intent action?");

        if (goodbye) {
            var trigger = new ChromeTrigger("CHROME", "APP", ua.LANGUAGE, assetsDir);

            if ( confirm("Reset always open setting?") ) {
                trigger.reset();
            }
            trigger.open(function(always) {
                alert("You are selected AOSP Stock browser. " + (always ? "open always" : "open once"));
            });
        } else {
            alert("canceled");
        }
    } else if (ua.AOSP) {
        var trigger = new ChromeTrigger();

        trigger.open();
    }
}

return test.run();

})(GLOBAL);

