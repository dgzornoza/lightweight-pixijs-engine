/* tslint:disable */
/// <reference path="../typings/index.d.ts" />

// base url for website/virtual directory/platform (Ended with'/')
const BASE_URL: string = "<%= BASE_URL %>";
// base url for webservice  (Ended with'/')
const API_BASE_URL: string = "<%= API_BASE_URL %>";
// application name
const APP_NAME: string = "<%= APP_NAME %>";
// flag for configure app for running tests execution
const IS_RUNNING_TESTS: boolean = false;

// requirejs configuration
requirejs.config({
    baseUrl: BASE_URL,
    urlArgs: "bust=" + "<%= APP_VERSION %>",
    paths: {

        // ES6
        "es6-shim": ["//cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.3/es6-shim.min", "lib/es6-shim.min"],
        "es6-sham": ["//cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.3/es6-sham.min", "lib/es6-sham.min"],

        // FPSMETER
        "fpsmeter": ["//cdnjs.cloudflare.com/ajax/libs/fpsmeter/0.3.1/fpsmeter.min", "lib/fpsmeter.min"],

        // pixi.js
        "pixijs": ["//cdnjs.cloudflare.com/ajax/libs/pixi.js/4.4.3/pixi.min", "lib/pixi.min" ],
        "pixi-charm": "lib/Charm",

        // Miscelaneo
        "modernizr": "lib/modernizr",
        "domReady": "lib/domReady"
    },
    shim: {
        "pixijs": ["es6-shim", "es6-sham"],
        "pixi-charm": "pixijs"
    }

});

// start app when dom is loaded
requirejs(["lib/domReady!",
    "es6-shim",
    "es6-sham",
    "pixijs",
    "pixi-charm"],
    (_document: Document) => {

        // start app when dom is loaded
        requirejs(["app/main"],
			(_main: any) => {
				// ...
            });

    }
);
