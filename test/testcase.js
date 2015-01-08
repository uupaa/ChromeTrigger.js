var ModuleTestChromeTrigger = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

return new Test("ChromeTrigger", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     false,
        both:       false, // test the primary module and secondary module
    }).add([
    ]).run().clone();


})((this || 0).self || global);

