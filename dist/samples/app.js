webpackJsonp([1],{

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pixiEngine_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../dist/engine/pixiEngine\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
/** Pixi main app */
var App = (function () {
    /** Default constructor */
    function App() {
        this._init();
    }
    // APP_VERSION: "1.0",
    // BASE_URL: "/",
    // API_BASE_URL: "/",
    // APP_NAME: "pixi.ts.sample",
    // DEBUG_MODE: "true",
    // MINIFIED_EXT: ".min",
    // DESIGN_RESOLUTION_WIDTH: "1920",
    // DESIGN_RESOLUTION_HEIGHT: "1280",
    // BACKGROUND_COLOR: "0x000000",
    // MAIN_SCENE: "app/samples/mainSamples"
    App.prototype._init = function () {
        // let config: IPixiEngineConfiguration = {
        //     backgroundColor: parseInt("<%= BACKGROUND_COLOR %>", 10),
        //     debugMode: "true" === "<%= DEBUG_MODE %>" as any,
        //     height: parseInt("<%= DESIGN_RESOLUTION_HEIGHT %>", 10),
        //     mainScene: "<%= MAIN_SCENE %>",
        //     width: parseInt("<%= DESIGN_RESOLUTION_WIDTH %>", 10)
        // };
        var config = {
            backgroundColor: 0x000000,
            debugMode: true,
            height: 1280,
            mainScene: "samples/mainScene",
            width: 1920
        };
        pixiEngine_1.pixiEngineInstance.initialize(config);
    };
    return App;
}());
// create main app instance for export
exports.application = new App();


/***/ })

},[5]);
//# sourceMappingURL=app.js.map