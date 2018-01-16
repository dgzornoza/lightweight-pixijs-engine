(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("es6-tween"), require("pixi.js"));
	else if(typeof define === 'function' && define.amd)
		define("lightweight-pixijs-engine", ["es6-tween", "pixi.js"], factory);
	else if(typeof exports === 'object')
		exports["lightweight-pixijs-engine"] = factory(require("es6-tween"), require("pixi.js"));
	else
		root["lightweight-pixijs-engine"] = factory(root["es6-tween"], root["pixi.js"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Engine SceneManager
 */
var SceneManager = /** @class */ (function () {
    function SceneManager() {
        this._scenes = {};
        this._currentScene = undefined;
    }
    SceneManager.prototype.initialize = function (rootContainer) {
        if (this._rootContainer !== undefined) {
            return false;
        }
        this._rootContainer = rootContainer;
        this._rootContainer.name = "RootScene";
        return true;
    };
    Object.defineProperty(SceneManager.prototype, "currentScene", {
        get: function () {
            return this._currentScene;
        },
        enumerable: true,
        configurable: true
    });
    SceneManager.prototype.createScene = function (id, sceneType) {
        if (this._scenes[id]) {
            console.warn("Scene with id:'" + id + "' already exists");
            return undefined;
        }
        this._scenes[id] = new sceneType();
        return this._scenes[id];
    };
    SceneManager.prototype.createAndReplaceScene = function (id, sceneType) {
        var result = false;
        var scene = this.createScene(id, sceneType);
        if (scene) {
            result = this.replaceScene(scene);
            if (!result) {
                this.destroyScene(scene);
            }
        }
        return result;
    };
    SceneManager.prototype.destroySceneById = function (id) {
        var scene = this._scenes[id];
        if (!scene) {
            console.warn("Scene with id:'" + id + "' not found");
            return;
        }
        // delete scene from pixi
        this._scenes[id].destroy({ children: true, texture: true, baseTexture: true });
        // remove from scenemanager
        delete this._scenes[id];
    };
    SceneManager.prototype.destroyScene = function (scene) {
        for (var idScene in this._scenes) {
            if (this._scenes.hasOwnProperty(idScene) && this._scenes[idScene] === scene) {
                return this.destroySceneById(idScene);
            }
        }
    };
    SceneManager.prototype.getScene = function (id) {
        var scene = this._scenes[id];
        if (!scene) {
            console.warn("Scene with id:'" + id + "' not found");
        }
        return scene;
    };
    SceneManager.prototype.replaceSceneFromId = function (id) {
        var nextScene = this._scenes[id];
        if (!nextScene) {
            console.warn("Scene with id:'" + id + "' not found");
            return false;
        }
        return this.replaceScene(nextScene);
    };
    SceneManager.prototype.replaceSceneWithTransition = function (transition) {
        var _this = this;
        this._rootContainer.addChild(transition.nextContainer);
        return transition.start()
            .then(function () {
            if (_this._currentScene) {
                _this._rootContainer.removeChild(_this._currentScene);
            }
            _this._currentScene = transition.nextContainer;
            transition.restore();
            return true;
        });
    };
    SceneManager.prototype.replaceScene = function (nextScene) {
        this._rootContainer.addChild(nextScene);
        if (this._currentScene) {
            this._rootContainer.removeChild(this._currentScene);
        }
        this._currentScene = nextScene;
        return true;
    };
    return SceneManager;
}());
// create unique scenemanager instance for export
exports.sceneManagerInstance = new SceneManager();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EnumDirections;
(function (EnumDirections) {
    EnumDirections[EnumDirections["NONE"] = 0] = "NONE";
    EnumDirections[EnumDirections["UP"] = 1] = "UP";
    EnumDirections[EnumDirections["DOWN"] = 3] = "DOWN";
    EnumDirections[EnumDirections["LEFT"] = 4] = "LEFT";
    EnumDirections[EnumDirections["RIGHT"] = 12] = "RIGHT";
})(EnumDirections = exports.EnumDirections || (exports.EnumDirections = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContainerHelpers = /** @class */ (function () {
    function ContainerHelpers() {
    }
    /** method for get container properties */
    ContainerHelpers.getContainerProperties = function (container) {
        var result = {
            alpha: container.alpha,
            height: container.height,
            pivot: {
                x: container.pivot.x,
                y: container.pivot.y
            },
            position: {
                x: container.position.x,
                y: container.position.y
            },
            rotation: container.rotation,
            scale: {
                x: container.scale.x,
                y: container.scale.y
            },
            skew: {
                x: container.skew.x,
                y: container.skew.y
            },
            width: container.width
        };
        return result;
    };
    /** method for set container properties */
    ContainerHelpers.setContainerProperties = function (properties, container) {
        container.alpha = properties.alpha;
        container.height = properties.height;
        container.rotation = properties.rotation;
        container.width = properties.width;
        container.position.copy(properties.position);
        container.pivot.copy(properties.pivot);
        container.scale.copy(properties.scale);
        container.skew.copy(properties.skew);
    };
    return ContainerHelpers;
}());
exports.ContainerHelpers = ContainerHelpers;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var pixi_extensions_1 = __webpack_require__(3);
/**
 * Base class for implement container transitions
 */
var TransitionBase = /** @class */ (function () {
    function TransitionBase(currentContainer, nextContainer, direction, duration, easingFunction) {
        this._nextContainer = nextContainer;
        this._currentContainer = currentContainer;
        this._direction = direction;
        this._duration = duration;
        this._easingFunction = easingFunction;
        // save original state objects
        this._currentContainerOriginalState = pixi_extensions_1.ContainerHelpers.getContainerProperties(currentContainer);
        this._nextContainerOriginalState = pixi_extensions_1.ContainerHelpers.getContainerProperties(nextContainer);
        // default end states = initial states
        this._currentContainerEndState = pixi_extensions_1.ContainerHelpers.getContainerProperties(currentContainer);
        this._nextContainerEndState = pixi_extensions_1.ContainerHelpers.getContainerProperties(nextContainer);
        this._configure();
    }
    Object.defineProperty(TransitionBase.prototype, "nextContainer", {
        get: function () {
            return this._nextContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionBase.prototype, "currentContainer", {
        get: function () {
            return this._currentContainer;
        },
        enumerable: true,
        configurable: true
    });
    TransitionBase.prototype.start = function () {
        var _this = this;
        this._tweensComplete = 0;
        var result = new Promise(function (resolve, _reject) {
            _this._nextSceneTween = _this._getNextSceneTween();
            if (_this._easingFunction) {
                _this._nextSceneTween.easing(_this._easingFunction);
            }
            _this._nextSceneTween.on("complete", function () {
                _this._tweensComplete++;
                if (_this._tweensComplete === 2) {
                    resolve();
                }
            });
            _this._currentSceneTween = _this._getCurrentSceneTween();
            if (_this._easingFunction) {
                _this._currentSceneTween.easing(_this._easingFunction);
            }
            _this._currentSceneTween.on("complete", function () {
                _this._tweensComplete++;
                if (_this._tweensComplete === 2) {
                    resolve();
                }
            });
            // HACK: force update always, currently in tween.js if start and end are equals, not update / complete callback is called.
            _this._currentSceneTween.object._force_update_ = _this._nextSceneTween.object._force_update_ = 0;
            _this._currentSceneTween._valuesEnd._force_update_ = _this._nextSceneTween._valuesEnd._force_update_ = 1;
            _this._nextSceneTween.start();
            _this._currentSceneTween.start();
        });
        return result;
    };
    TransitionBase.prototype.stop = function () {
        this._nextSceneTween.stop();
        this._currentSceneTween.stop();
    };
    /**
     * If override, call super.restore() for restore container positions.
     * This function is called after change current scene for new scene
     */
    TransitionBase.prototype.restore = function () {
        pixi_extensions_1.ContainerHelpers.setContainerProperties(this._currentContainerOriginalState, this._currentContainer);
        pixi_extensions_1.ContainerHelpers.setContainerProperties(this._nextContainerOriginalState, this._nextContainer);
    };
    return TransitionBase;
}());
exports.TransitionBase = TransitionBase;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable no-bitwise */
var transition_base_1 = __webpack_require__(4);
var es6_tween_1 = __webpack_require__(0);
var infraestructure_1 = __webpack_require__(2);
/**
 * Base class for create container transition slide
 */
var TransitionSlideBase = /** @class */ (function (_super) {
    __extends(TransitionSlideBase, _super);
    function TransitionSlideBase(currentContainer, nextContainer, direction, duration, easingFunction) {
        return _super.call(this, currentContainer, nextContainer, direction, duration, easingFunction) || this;
    }
    TransitionSlideBase.prototype._configure = function () {
        if ((this._direction & infraestructure_1.EnumDirections.UP) === infraestructure_1.EnumDirections.UP) {
            this._currentContainerEndState.position.y = -(this._currentContainer.parent.height / this._currentContainer.parent.scale.y);
        }
        if ((this._direction & infraestructure_1.EnumDirections.DOWN) === infraestructure_1.EnumDirections.DOWN) {
            this._currentContainerEndState.position.y = (this._currentContainer.parent.height / this._currentContainer.parent.scale.y);
        }
        if ((this._direction & infraestructure_1.EnumDirections.LEFT) === infraestructure_1.EnumDirections.LEFT) {
            this._currentContainerEndState.position.x = -(this._currentContainer.parent.width / this._currentContainer.parent.scale.x);
        }
        if ((this._direction & infraestructure_1.EnumDirections.RIGHT) === infraestructure_1.EnumDirections.RIGHT) {
            this._currentContainerEndState.position.x = (this._currentContainer.parent.width / this._currentContainer.parent.scale.x);
        }
        this._nextContainer.position.y = -this._currentContainerEndState.position.y;
        this._nextContainer.position.x = -this._currentContainerEndState.position.x;
    };
    return TransitionSlideBase;
}(transition_base_1.TransitionBase));
exports.TransitionSlideBase = TransitionSlideBase;
/**
 * Class for create container transition slide
 */
var TransitionSlide = /** @class */ (function (_super) {
    __extends(TransitionSlide, _super);
    function TransitionSlide(currentContainer, nextContainer, direction, duration, easingFunction) {
        return _super.call(this, currentContainer, nextContainer, direction, duration, easingFunction) || this;
    }
    TransitionSlide.prototype._getCurrentSceneTween = function () {
        var _this = this;
        var tween = new es6_tween_1.Tween({
            x: this._currentContainer.position.x,
            y: this._currentContainer.position.y
        }).to({
            x: this._currentContainerEndState.position.x,
            y: this._currentContainerEndState.position.y
        }, this._duration);
        tween.on("update", function (animationState) {
            _this._currentContainer.position.x = animationState.x;
            _this._currentContainer.position.y = animationState.y;
        });
        return tween;
    };
    TransitionSlide.prototype._getNextSceneTween = function () {
        var _this = this;
        var tween = new es6_tween_1.Tween({
            x: this._nextContainer.position.x,
            y: this._nextContainer.position.y
        }).to({
            x: this._nextContainerEndState.position.x,
            y: this._nextContainerEndState.position.y
        }, this._duration);
        tween.on("update", function (animationState) {
            _this.nextContainer.position.x = animationState.x;
            _this.nextContainer.position.y = animationState.y;
        });
        return tween;
    };
    return TransitionSlide;
}(TransitionSlideBase));
exports.TransitionSlide = TransitionSlide;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// thirdparty
__webpack_require__(8);
__webpack_require__(9);
var log = __webpack_require__(10);
var es6_tween_1 = __webpack_require__(0);
var scene_manager_1 = __webpack_require__(1);
__webpack_require__(11);
// exports library
__export(__webpack_require__(12));
__export(__webpack_require__(2));
__export(__webpack_require__(3));
__export(__webpack_require__(1));
__export(__webpack_require__(4));
__export(__webpack_require__(13));
__export(__webpack_require__(5));
/**
 * Enum with allowed engine states
 */
var EnumEngineStates;
(function (EnumEngineStates) {
    EnumEngineStates[EnumEngineStates["PAUSED"] = 1] = "PAUSED";
    EnumEngineStates[EnumEngineStates["RUNNING"] = 2] = "RUNNING";
})(EnumEngineStates = exports.EnumEngineStates || (exports.EnumEngineStates = {}));
/**
 * Enum for scale modes
 */
var EnumScaleMode;
(function (EnumScaleMode) {
    EnumScaleMode[EnumScaleMode["NO_SCALE"] = 0] = "NO_SCALE";
    EnumScaleMode[EnumScaleMode["EXACT_FIT"] = 1] = "EXACT_FIT";
    EnumScaleMode[EnumScaleMode["NO_BORDER"] = 2] = "NO_BORDER";
    EnumScaleMode[EnumScaleMode["SHOW_ALL"] = 3] = "SHOW_ALL";
    EnumScaleMode[EnumScaleMode["FIXED_HEIGHT"] = 4] = "FIXED_HEIGHT";
    EnumScaleMode[EnumScaleMode["FIXED_WIDTH"] = 5] = "FIXED_WIDTH";
})(EnumScaleMode = exports.EnumScaleMode || (exports.EnumScaleMode = {}));
/** Pixi main app */
var PixiEngine = /** @class */ (function () {
    /** Default constructor */
    function PixiEngine() {
        this._rootContainer = new PIXI.Container();
        this._state = EnumEngineStates.PAUSED;
    }
    Object.defineProperty(PixiEngine.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PixiEngine.prototype, "sceneManager", {
        get: function () {
            return scene_manager_1.sceneManagerInstance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PixiEngine.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PixiEngine.prototype, "debugMode", {
        get: function () {
            return this._config.debugMode;
        },
        enumerable: true,
        configurable: true
    });
    PixiEngine.prototype.pause = function () {
        this._state = EnumEngineStates.PAUSED;
    };
    PixiEngine.prototype.resume = function () {
        this._state = EnumEngineStates.RUNNING;
    };
    PixiEngine.prototype.initialize = function (config) {
        var _this = this;
        // can only initialize once
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        // default configuracion
        this._config = config || {};
        this._config.resolution = config.resolution || window.devicePixelRatio;
        this._config.debugMode = config.debugMode || false;
        this._config.resizeWithBrowserSize = config.resizeWithBrowserSize === false ? false : true;
        this._config.scaleMode = this._config.scaleMode || EnumScaleMode.NO_SCALE;
        // initialize framerate ONLY in debug mode
        if (this._config.debugMode) {
            this._initializeFpsMeter();
        }
        // create pixi rendered and append to html body
        this._renderer = PIXI.autoDetectRenderer(config);
        log.debug(this._renderer.type === PIXI.RENDERER_TYPE.WEBGL ? "Using WebGL Renderer" : "Using Canvas renderer");
        // add canvas if not set.
        if (!this._config.view) {
            document.body.appendChild(this._renderer.view);
        }
        // initialize sceneManager
        scene_manager_1.sceneManagerInstance.initialize(this._rootContainer);
        // start main loop
        requestAnimationFrame(function () { _this._mainLoop(); });
        // configure resize with browser size and scale modes
        if (this._config.resizeWithBrowserSize) {
            document.body.style.overflowX = document.body.style.overflowY = "hidden";
            this._resizeWithBrowserSize();
            window.addEventListener("resize", function (_event) { _this._resizeWithBrowserSize(); });
            window.addEventListener("deviceOrientation", function (_event) { _this._resizeWithBrowserSize(); });
        }
        // play engine
        this._state = EnumEngineStates.RUNNING;
    };
    PixiEngine.prototype._mainLoop = function (time) {
        var _this = this;
        requestAnimationFrame(function () { _this._mainLoop(time); });
        var scene = scene_manager_1.sceneManagerInstance.currentScene;
        if (this._state !== EnumEngineStates.RUNNING || !scene) {
            return;
        }
        // fpsmeter ONLY debug mode
        if (this._config.debugMode) {
            this._fpsMeter.tickStart();
        }
        // update tween
        es6_tween_1.update(time);
        // call update in scenes
        for (var _i = 0, _a = this._rootContainer.children; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            if (displayObject.visible && displayObject.updateFrame) {
                displayObject.updateFrame();
            }
        }
        // render root container
        this._renderer.render(this._rootContainer);
        // fpsmeter ONLY debug mode
        if (this._config.debugMode) {
            this._fpsMeter.tick();
        }
    };
    PixiEngine.prototype._initializeFpsMeter = function () {
        this._fpsMeter = new FPSMeter();
    };
    /**
     * Function for calculate the current window size and set the canvas renderer size accordingly
     */
    PixiEngine.prototype._resizeWithBrowserSize = function () {
        var canvasElement = this._renderer.view;
        // window width and height minus canvas border
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        var sceneWidth = this._config.width;
        var sceneHeight = this._config.height;
        /**
         * Set the canvas size and display size
         */
        canvasElement.width = screenWidth - (canvasElement.offsetWidth - canvasElement.clientWidth);
        canvasElement.height = screenHeight - (canvasElement.offsetHeight - canvasElement.clientHeight);
        canvasElement.style.width = canvasElement.width + "px";
        canvasElement.style.height = canvasElement.height + "px";
        /**
         * Resize the PIXI renderer
         * Let PIXI know that we changed the size of the viewport
         */
        this._renderer.resize(canvasElement.width, canvasElement.height);
        /**
         * Scale the canvas horizontally and vertically keeping in mind the screen estate we have
         * at our disposal. This keeps the relative container dimensions in place.
         */
        switch (this._config.scaleMode) {
            case EnumScaleMode.EXACT_FIT:
                this._rootContainer.scale.x = screenWidth / sceneWidth;
                this._rootContainer.scale.y = screenHeight / sceneHeight;
                break;
            case EnumScaleMode.NO_BORDER:
                this._rootContainer.scale.x = (screenHeight / sceneHeight < screenWidth / sceneWidth) ?
                    (screenWidth / sceneWidth) : (screenHeight / sceneHeight);
                this._rootContainer.scale.y = this._rootContainer.scale.x;
                break;
            case EnumScaleMode.SHOW_ALL:
                this._rootContainer.scale.x = (screenHeight / sceneHeight < screenWidth / sceneWidth) ?
                    (screenHeight / sceneHeight) : (screenWidth / sceneWidth);
                this._rootContainer.scale.y = this._rootContainer.scale.x;
                break;
            case EnumScaleMode.FIXED_HEIGHT:
                this._rootContainer.scale.x = screenHeight / sceneHeight;
                this._rootContainer.scale.y = this._rootContainer.scale.x;
                break;
            case EnumScaleMode.FIXED_WIDTH:
                this._rootContainer.scale.x = screenWidth / sceneWidth;
                this._rootContainer.scale.y = this._rootContainer.scale.x;
                break;
            default:
                this._rootContainer.scale.x = 1;
                this._rootContainer.scale.y = 1;
                break;
        }
        this._rootContainer.x = (screenWidth - sceneWidth * this._rootContainer.scale.x) * .5;
        this._rootContainer.y = (screenHeight - sceneHeight * this._rootContainer.scale.y) * .5;
        /**
         * iOS likes to scroll when rotating - fix that
         */
        window.scrollTo(0, 0);
    };
    return PixiEngine;
}());
// create main app instance for export
exports.pixiEngineInstance = new PixiEngine();


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*!
 * FPSMeter 0.3.1 - 9th May 2013
 * https://github.com/Darsain/fpsmeter
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */
;(function (w, undefined) {
	'use strict';

	/**
	 * Create a new element.
	 *
	 * @param  {String} name Element type name.
	 *
	 * @return {Element}
	 */
	function newEl(name) {
		return document.createElement(name);
	}

	/**
	 * Apply theme CSS properties to element.
	 *
	 * @param  {Element} element DOM element.
	 * @param  {Object}  theme   Theme object.
	 *
	 * @return {Element}
	 */
	function applyTheme(element, theme) {
		for (var name in theme) {
			try {
				element.style[name] = theme[name];
			} catch (e) {}
		}
		return element;
	}

	/**
	 * Return type of the value.
	 *
	 * @param  {Mixed} value
	 *
	 * @return {String}
	 */
	function type(value) {
		if (value == null) {
			return String(value);
		}

		if (typeof value === 'object' || typeof value === 'function') {
			return Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || 'object';
		}

		return typeof value;
	}

	/**
	 * Check whether the value is in an array.
	 *
	 * @param  {Mixed} value
	 * @param  {Array} array
	 *
	 * @return {Integer} Array index or -1 when not found.
	 */
	function inArray(value, array) {
		if (type(array) !== 'array') {
			return -1;
		}
		if (array.indexOf) {
			return array.indexOf(value);
		}
		for (var i = 0, l = array.length; i < l; i++) {
			if (array[i] === value) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Poor man's deep object extend.
	 *
	 * Example:
	 *   extend({}, defaults, options);
	 *
	 * @return {Void}
	 */
	function extend() {
		var args = arguments;
		for (var key in args[1]) {
			if (args[1].hasOwnProperty(key)) {
				switch (type(args[1][key])) {
					case 'object':
						args[0][key] = extend({}, args[0][key], args[1][key]);
						break;

					case 'array':
						args[0][key] = args[1][key].slice(0);
						break;

					default:
						args[0][key] = args[1][key];
				}
			}
		}
		return args.length > 2 ?
			extend.apply(null, [args[0]].concat(Array.prototype.slice.call(args, 2))) :
			args[0];
	}

	/**
	 * Convert HSL color to HEX string.
	 *
	 * @param  {Array} hsl Array with [hue, saturation, lightness].
	 *
	 * @return {Array} Array with [red, green, blue].
	 */
	function hslToHex(h, s, l) {
		var r, g, b;
		var v, min, sv, sextant, fract, vsf;

		if (l <= 0.5) {
			v = l * (1 + s);
		} else {
			v = l + s - l * s;
		}

		if (v === 0) {
			return '#000';
		} else {
			min = 2 * l - v;
			sv = (v - min) / v;
			h = 6 * h;
			sextant = Math.floor(h);
			fract = h - sextant;
			vsf = v * sv * fract;
			if (sextant === 0 || sextant === 6) {
				r = v;
				g = min + vsf;
				b = min;
			} else if (sextant === 1) {
				r = v - vsf;
				g = v;
				b = min;
			} else if (sextant === 2) {
				r = min;
				g = v;
				b = min + vsf;
			} else if (sextant === 3) {
				r = min;
				g = v - vsf;
				b = v;
			} else if (sextant === 4) {
				r = min + vsf;
				g = min;
				b = v;
			} else {
				r = v;
				g = min;
				b = v - vsf;
			}
			return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}
	}

	/**
	 * Helper function for hslToHex.
	 */
	function componentToHex(c) {
		c = Math.round(c * 255).toString(16);
		return c.length === 1 ? '0' + c : c;
	}

	/**
	 * Manage element event listeners.
	 *
	 * @param  {Node}     element
	 * @param  {Event}    eventName
	 * @param  {Function} handler
	 * @param  {Bool}     remove
	 *
	 * @return {Void}
	 */
	function listener(element, eventName, handler, remove) {
		if (element.addEventListener) {
			element[remove ? 'removeEventListener' : 'addEventListener'](eventName, handler, false);
		} else if (element.attachEvent) {
			element[remove ? 'detachEvent' : 'attachEvent']('on' + eventName, handler);
		}
	}

	// Preferred timing funtion
	var getTime;
	(function () {
		var perf = w.performance;
		if (perf && (perf.now || perf.webkitNow)) {
			var perfNow = perf.now ? 'now' : 'webkitNow';
			getTime = perf[perfNow].bind(perf);
		} else {
			getTime = function () {
				return +new Date();
			};
		}
	}());

	// Local WindowAnimationTiming interface polyfill
	var cAF = w.cancelAnimationFrame || w.cancelRequestAnimationFrame;
	var rAF = w.requestAnimationFrame;
	(function () {
		var vendors = ['moz', 'webkit', 'o'];
		var lastTime = 0;

		// For a more accurate WindowAnimationTiming interface implementation, ditch the native
		// requestAnimationFrame when cancelAnimationFrame is not present (older versions of Firefox)
		for (var i = 0, l = vendors.length; i < l && !cAF; ++i) {
			cAF = w[vendors[i]+'CancelAnimationFrame'] || w[vendors[i]+'CancelRequestAnimationFrame'];
			rAF = cAF && w[vendors[i]+'RequestAnimationFrame'];
		}

		if (!cAF) {
			rAF = function (callback) {
				var currTime = getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				lastTime = currTime + timeToCall;
				return w.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
			};

			cAF = function (id) {
				clearTimeout(id);
			};
		}
	}());

	// Property name for assigning element text content
	var textProp = type(document.createElement('div').textContent) === 'string' ? 'textContent' : 'innerText';

	/**
	 * FPSMeter class.
	 *
	 * @param {Element} anchor  Element to append the meter to. Default is document.body.
	 * @param {Object}  options Object with options.
	 */
	function FPSMeter(anchor, options) {
		// Optional arguments
		if (type(anchor) === 'object' && anchor.nodeType === undefined) {
			options = anchor;
			anchor = document.body;
		}
		if (!anchor) {
			anchor = document.body;
		}

		// Private properties
		var self = this;
		var o = extend({}, FPSMeter.defaults, options || {});

		var el = {};
		var cols = [];
		var theme, heatmaps;
		var heatDepth = 100;
		var heating = [];

		var thisFrameTime = 0;
		var frameTime = o.threshold;
		var frameStart = 0;
		var lastLoop = getTime() - frameTime;
		var time;

		var fpsHistory = [];
		var durationHistory = [];

		var frameID, renderID;
		var showFps = o.show === 'fps';
		var graphHeight, count, i, j;

		// Exposed properties
		self.options = o;
		self.fps = 0;
		self.duration = 0;
		self.isPaused = 0;

		/**
		 * Tick start for measuring the actual rendering duration.
		 *
		 * @return {Void}
		 */
		self.tickStart = function () {
			frameStart = getTime();
		};

		/**
		 * FPS tick.
		 *
		 * @return {Void}
		 */
		self.tick = function () {
			time = getTime();
			thisFrameTime = time - lastLoop;
			frameTime += (thisFrameTime - frameTime) / o.smoothing;
			self.fps = 1000 / frameTime;
			self.duration = frameStart < lastLoop ? frameTime : time - frameStart;
			lastLoop = time;
		};

		/**
		 * Pause display rendering.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.pause = function () {
			if (frameID) {
				self.isPaused = 1;
				clearTimeout(frameID);
				cAF(frameID);
				cAF(renderID);
				frameID = renderID = 0;
			}
			return self;
		};

		/**
		 * Resume display rendering.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.resume = function () {
			if (!frameID) {
				self.isPaused = 0;
				requestRender();
			}
			return self;
		};

		/**
		 * Update options.
		 *
		 * @param {String} name  Option name.
		 * @param {Mixed}  value New value.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.set = function (name, value) {
			o[name] = value;
			showFps = o.show === 'fps';

			// Rebuild or reposition elements when specific option has been updated
			if (inArray(name, rebuilders) !== -1) {
				createMeter();
			}
			if (inArray(name, repositioners) !== -1) {
				positionMeter();
			}
			return self;
		};

		/**
		 * Change meter into rendering duration mode.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.showDuration = function () {
			self.set('show', 'ms');
			return self;
		};

		/**
		 * Change meter into FPS mode.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.showFps = function () {
			self.set('show', 'fps');
			return self;
		};

		/**
		 * Toggles between show: 'fps' and show: 'duration'.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.toggle = function () {
			self.set('show', showFps ? 'ms' : 'fps');
			return self;
		};

		/**
		 * Hide the FPSMeter. Also pauses the rendering.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.hide = function () {
			self.pause();
			el.container.style.display = 'none';
			return self;
		};

		/**
		 * Show the FPSMeter. Also resumes the rendering.
		 *
		 * @return {Object} FPSMeter instance.
		 */
		self.show = function () {
			self.resume();
			el.container.style.display = 'block';
			return self;
		};

		/**
		 * Check the current FPS and save it in history.
		 *
		 * @return {Void}
		 */
		function historyTick() {
			for (i = o.history; i--;) {
				fpsHistory[i] = i === 0 ? self.fps : fpsHistory[i-1];
				durationHistory[i] = i === 0 ? self.duration : durationHistory[i-1];
			}
		}

		/**
		 * Returns heat hex color based on values passed.
		 *
		 * @param  {Integer} heatmap
		 * @param  {Integer} value
		 * @param  {Integer} min
		 * @param  {Integer} max
		 *
		 * @return {Integer}
		 */
		function getHeat(heatmap, value, min, max) {
			return heatmaps[0|heatmap][Math.round(Math.min((value - min) / (max - min) * heatDepth, heatDepth))];
		}

		/**
		 * Update counter number and legend.
		 *
		 * @return {Void}
		 */
		function updateCounter() {
			// Update legend only when changed
			if (el.legend.fps !== showFps) {
				el.legend.fps = showFps;
				el.legend[textProp] = showFps ? 'FPS' : 'ms';
			}
			// Update counter with a nicely formated & readable number
			count = showFps ? self.fps : self.duration;
			el.count[textProp] = count > 999 ? '999+' : count.toFixed(count > 99 ? 0 : o.decimals);
		}

		/**
		 * Render current FPS state.
		 *
		 * @return {Void}
		 */
		function render() {
			time = getTime();
			// If renderer stopped reporting, do a simulated drop to 0 fps
			if (lastLoop < time - o.threshold) {
				self.fps -= self.fps / Math.max(1, o.smoothing * 60 / o.interval);
				self.duration = 1000 / self.fps;
			}

			historyTick();
			updateCounter();

			// Apply heat to elements
			if (o.heat) {
				if (heating.length) {
					for (i = heating.length; i--;) {
						heating[i].el.style[theme[heating[i].name].heatOn] = showFps ?
							getHeat(theme[heating[i].name].heatmap, self.fps, 0, o.maxFps) :
							getHeat(theme[heating[i].name].heatmap, self.duration, o.threshold, 0);
					}
				}

				if (el.graph && theme.column.heatOn) {
					for (i = cols.length; i--;) {
						cols[i].style[theme.column.heatOn] = showFps ?
							getHeat(theme.column.heatmap, fpsHistory[i], 0, o.maxFps) :
							getHeat(theme.column.heatmap, durationHistory[i], o.threshold, 0);
					}
				}
			}

			// Update graph columns height
			if (el.graph) {
				for (j = 0; j < o.history; j++) {
					cols[j].style.height = (showFps ?
						(fpsHistory[j] ? Math.round(graphHeight / o.maxFps * Math.min(fpsHistory[j], o.maxFps)) : 0) :
						(durationHistory[j] ? Math.round(graphHeight / o.threshold * Math.min(durationHistory[j], o.threshold)) : 0)
					) + 'px';
				}
			}
		}

		/**
		 * Request rendering loop.
		 *
		 * @return {Int} Animation frame index.
		 */
		function requestRender() {
			if (o.interval < 20) {
				frameID = rAF(requestRender);
				render();
			} else {
				frameID = setTimeout(requestRender, o.interval);
				renderID = rAF(render);
			}
		}

		/**
		 * Meter events handler.
		 *
		 * @return {Void}
		 */
		function eventHandler(event) {
			event = event || window.event;
			if (event.preventDefault) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				event.returnValue = false;
				event.cancelBubble = true;
			}
			self.toggle();
		}

		/**
		 * Destroys the current FPSMeter instance.
		 *
		 * @return {Void}
		 */
		self.destroy = function () {
			// Stop rendering
			self.pause();
			// Remove elements
			removeMeter();
			// Stop listening
			self.tick = self.tickStart = function () {};
		};

		/**
		 * Remove meter element.
		 *
		 * @return {Void}
		 */
		function removeMeter() {
			// Unbind listeners
			if (o.toggleOn) {
				listener(el.container, o.toggleOn, eventHandler, 1);
			}
			// Detach element
			anchor.removeChild(el.container);
		}

		/**
		 * Sets the theme, and generates heatmaps when needed.
		 */
		function setTheme() {
			theme = FPSMeter.theme[o.theme];

			// Generate heatmaps
			heatmaps = theme.compiledHeatmaps || [];
			if (!heatmaps.length && theme.heatmaps.length) {
				for (j = 0; j < theme.heatmaps.length; j++) {
					heatmaps[j] = [];
					for (i = 0; i <= heatDepth; i++) {
						heatmaps[j][i] = hslToHex(0.33 / heatDepth * i, theme.heatmaps[j].saturation, theme.heatmaps[j].lightness);
					}
				}
				theme.compiledHeatmaps = heatmaps;
			}
		}

		/**
		 * Creates and attaches the meter element.
		 *
		 * @return {Void}
		 */
		function createMeter() {
			// Remove old meter if present
			if (el.container) {
				removeMeter();
			}

			// Set theme
			setTheme();

			// Create elements
			el.container = applyTheme(newEl('div'), theme.container);
			el.count = el.container.appendChild(applyTheme(newEl('div'), theme.count));
			el.legend = el.container.appendChild(applyTheme(newEl('div'), theme.legend));
			el.graph = o.graph ? el.container.appendChild(applyTheme(newEl('div'), theme.graph)) : 0;

			// Add elements to heating array
			heating.length = 0;
			for (var key in el) {
				if (el[key] && theme[key].heatOn) {
					heating.push({
						name: key,
						el: el[key]
					});
				}
			}

			// Graph
			cols.length = 0;
			if (el.graph) {
				// Create graph
				el.graph.style.width = (o.history * theme.column.width + (o.history - 1) * theme.column.spacing) + 'px';

				// Add columns
				for (i = 0; i < o.history; i++) {
					cols[i] = el.graph.appendChild(applyTheme(newEl('div'), theme.column));
					cols[i].style.position = 'absolute';
					cols[i].style.bottom = 0;
					cols[i].style.right = (i * theme.column.width + i * theme.column.spacing) + 'px';
					cols[i].style.width = theme.column.width + 'px';
					cols[i].style.height = '0px';
				}
			}

			// Set the initial state
			positionMeter();
			updateCounter();

			// Append container to anchor
			anchor.appendChild(el.container);

			// Retrieve graph height after it was appended to DOM
			if (el.graph) {
				graphHeight = el.graph.clientHeight;
			}

			// Add event listeners
			if (o.toggleOn) {
				if (o.toggleOn === 'click') {
					el.container.style.cursor = 'pointer';
				}
				listener(el.container, o.toggleOn, eventHandler);
			}
		}

		/**
		 * Positions the meter based on options.
		 *
		 * @return {Void}
		 */
		function positionMeter() {
			applyTheme(el.container, o);
		}

		/**
		 * Construct.
		 */
		(function () {
			// Create meter element
			createMeter();
			// Start rendering
			requestRender();
		}());
	}

	// Expose the extend function
	FPSMeter.extend = extend;

	// Expose the FPSMeter class
	window.FPSMeter = FPSMeter;

	// Default options
	FPSMeter.defaults = {
		interval:  100,     // Update interval in milliseconds.
		smoothing: 10,      // Spike smoothing strength. 1 means no smoothing.
		show:      'fps',   // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
		toggleOn:  'click', // Toggle between show 'fps' and 'ms' on this event.
		decimals:  1,       // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
		maxFps:    60,      // Max expected FPS value.
		threshold: 100,     // Minimal tick reporting interval in milliseconds.

		// Meter position
		position: 'absolute', // Meter position.
		zIndex:   10,         // Meter Z index.
		left:     '5px',      // Meter left offset.
		top:      '5px',      // Meter top offset.
		right:    'auto',     // Meter right offset.
		bottom:   'auto',     // Meter bottom offset.
		margin:   '0 0 0 0',  // Meter margin. Helps with centering the counter when left: 50%;

		// Theme
		theme: 'dark', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
		heat:  0,      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

		// Graph
		graph:   0, // Whether to show history graph.
		history: 20 // How many history states to show in a graph.
	};

	// Option names that trigger FPSMeter rebuild or reposition when modified
	var rebuilders = [
		'toggleOn',
		'theme',
		'heat',
		'graph',
		'history'
	];
	var repositioners = [
		'position',
		'zIndex',
		'left',
		'top',
		'right',
		'bottom',
		'margin'
	];
}(window));
;(function (w, FPSMeter, undefined) {
	'use strict';

	// Themes object
	FPSMeter.theme = {};

	// Base theme with layout, no colors
	var base = FPSMeter.theme.base = {
		heatmaps: [],
		container: {
			// Settings
			heatOn: null,
			heatmap: null,

			// Styles
			padding: '5px',
			minWidth: '95px',
			height: '30px',
			lineHeight: '30px',
			textAlign: 'right',
			textShadow: 'none'
		},
		count: {
			// Settings
			heatOn: null,
			heatmap: null,

			// Styles
			position: 'absolute',
			top: 0,
			right: 0,
			padding: '5px 10px',
			height: '30px',
			fontSize: '24px',
			fontFamily: 'Consolas, Andale Mono, monospace',
			zIndex: 2
		},
		legend: {
			// Settings
			heatOn: null,
			heatmap: null,

			// Styles
			position: 'absolute',
			top: 0,
			left: 0,
			padding: '5px 10px',
			height: '30px',
			fontSize: '12px',
			lineHeight: '32px',
			fontFamily: 'sans-serif',
			textAlign: 'left',
			zIndex: 2
		},
		graph: {
			// Settings
			heatOn: null,
			heatmap: null,

			// Styles
			position: 'relative',
			boxSizing: 'padding-box',
			MozBoxSizing: 'padding-box',
			height: '100%',
			zIndex: 1
		},
		column: {
			// Settings
			width: 4,
			spacing: 1,
			heatOn: null,
			heatmap: null
		}
	};

	// Dark theme
	FPSMeter.theme.dark = FPSMeter.extend({}, base, {
		heatmaps: [{
			saturation: 0.8,
			lightness: 0.8
		}],
		container: {
			background: '#222',
			color: '#fff',
			border: '1px solid #1a1a1a',
			textShadow: '1px 1px 0 #222'
		},
		count: {
			heatOn: 'color'
		},
		column: {
			background: '#3f3f3f'
		}
	});

	// Light theme
	FPSMeter.theme.light = FPSMeter.extend({}, base, {
		heatmaps: [{
			saturation: 0.5,
			lightness: 0.5
		}],
		container: {
			color: '#666',
			background: '#fff',
			textShadow: '1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)',
			boxShadow: '0 0 0 1px rgba(0,0,0,.1)'
		},
		count: {
			heatOn: 'color'
		},
		column: {
			background: '#eaeaea'
		}
	});

	// Colorful theme
	FPSMeter.theme.colorful = FPSMeter.extend({}, base, {
		heatmaps: [{
			saturation: 0.5,
			lightness: 0.6
		}],
		container: {
			heatOn: 'backgroundColor',
			background: '#888',
			color: '#fff',
			textShadow: '1px 1px 0 rgba(0,0,0,.2)',
			boxShadow: '0 0 0 1px rgba(0,0,0,.1)'
		},
		column: {
			background: '#777',
			backgroundColor: 'rgba(0,0,0,.2)'
		}
	});

	// Transparent theme
	FPSMeter.theme.transparent = FPSMeter.extend({}, base, {
		heatmaps: [{
			saturation: 0.8,
			lightness: 0.5
		}],
		container: {
			padding: 0,
			color: '#fff',
			textShadow: '1px 1px 0 rgba(0,0,0,.5)'
		},
		count: {
			padding: '0 5px',
			height: '40px',
			lineHeight: '40px'
		},
		legend: {
			padding: '0 5px',
			height: '40px',
			lineHeight: '42px'
		},
		graph: {
			height: '40px'
		},
		column: {
			width: 5,
			background: '#999',
			heatOn: 'backgroundColor',
			opacity: 0.5
		}
	});
}(window, FPSMeter));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/******************************************
 * Helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** @Brief Class for define help methods */
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    /** Funcion para crear un mixing en typescript y poder componer clases
     * @param clase derivada de los objetos que se quiere componer
     * @param array con las clases hijas usadas para la composicion
     * https://www.typescriptlang.org/docs/handbook/mixins.html
     */
    Helpers.applyMixins = function (derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
    /**
     * helper for create object instance from name.
     * @param context object context for create instance
     * @param name Name of class for create instance
     * @param args constructor arguments
     */
    Helpers.createInstance = function (context, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    };
    /**
     * Funcion para cargar un script de forma dinamica
     * @param url Url del script a cargar
     * @param callback Funcion callback que sera invocada tras cargar el script
     */
    Helpers.loadScript = function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        // IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = undefined;
                    callback();
                }
            };
            // Others
        }
        else {
            script.onload = function () { callback(); };
        }
        script.src = url;
        document.body.appendChild(script);
    };
    return Helpers;
}());
exports.Helpers = Helpers;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var transition_slide_1 = __webpack_require__(5);
var es6_tween_1 = __webpack_require__(0);
/**
 * Base class for create container transition slide
 */
var TransitionFadeBase = /** @class */ (function (_super) {
    __extends(TransitionFadeBase, _super);
    function TransitionFadeBase(currentContainer, nextContainer, direction, duration, easingFunction) {
        return _super.call(this, currentContainer, nextContainer, direction, duration, easingFunction) || this;
    }
    TransitionFadeBase.prototype._getCurrentSceneTween = function () {
        var _this = this;
        var tween = new es6_tween_1.Tween({
            x: this._currentContainer.position.x,
            y: this._currentContainer.position.y,
            alpha: this._currentContainer.alpha
        }).to({
            x: this._currentContainerEndState.position.x,
            y: this._currentContainerEndState.position.y,
            alpha: this._currentContainerEndState.alpha
        }, this._duration);
        tween.on("update", function (animationState) {
            _this._currentContainer.position.x = animationState.x;
            _this._currentContainer.position.y = animationState.y;
            _this._currentContainer.alpha = animationState.alpha;
        });
        return tween;
    };
    TransitionFadeBase.prototype._getNextSceneTween = function () {
        var _this = this;
        var tween = new es6_tween_1.Tween({
            x: this._nextContainer.position.x,
            y: this._nextContainer.position.y,
            alpha: this._nextContainer.alpha
        }).to({
            x: this._nextContainerEndState.position.x,
            y: this._nextContainerEndState.position.y,
            alpha: this._nextContainerEndState.alpha
        }, this._duration);
        tween.on("update", function (animationState) {
            _this._nextContainer.position.x = animationState.x;
            _this._nextContainer.position.y = animationState.y;
            _this._nextContainer.alpha = animationState.alpha;
        });
        return tween;
    };
    return TransitionFadeBase;
}(transition_slide_1.TransitionSlideBase));
exports.TransitionFadeBase = TransitionFadeBase;
/**
 * Class for create container transition fade in
 */
var TransitionFadeIn = /** @class */ (function (_super) {
    __extends(TransitionFadeIn, _super);
    function TransitionFadeIn(currentContainer, nextContainer, direction, frames, easingFunction) {
        return _super.call(this, currentContainer, nextContainer, direction, frames, easingFunction) || this;
    }
    TransitionFadeIn.prototype._configure = function () {
        // equal inheritance 'TransitionSlideBase' but, current scene not move
        _super.prototype._configure.call(this);
        this._currentContainerEndState.position.x = this._currentContainerOriginalState.position.x;
        this._currentContainerEndState.position.y = this._currentContainerOriginalState.position.y;
        this._nextContainer.alpha = 0;
    };
    return TransitionFadeIn;
}(TransitionFadeBase));
exports.TransitionFadeIn = TransitionFadeIn;
/**
 * Clas for create container transition fade in
 */
var TransitionFadeOut = /** @class */ (function (_super) {
    __extends(TransitionFadeOut, _super);
    function TransitionFadeOut(currentContainer, nextContainer, direction, frames, easingFunction) {
        return _super.call(this, currentContainer, nextContainer, direction, frames, easingFunction) || this;
    }
    TransitionFadeOut.prototype.start = function () {
        // this transition require nextscene before current
        if (this._currentContainer.parent.getChildIndex(this._currentContainer) < this._currentContainer.parent.getChildIndex(this._nextContainer)) {
            this._currentContainer.parent.swapChildren(this._currentContainer, this._nextContainer);
        }
        return _super.prototype.start.call(this);
    };
    TransitionFadeOut.prototype._configure = function () {
        // equal inheritance 'TransitionSlideBase' but, next scene not move
        _super.prototype._configure.call(this);
        this.nextContainer.position.y = this._nextContainerOriginalState.position.x;
        this.nextContainer.position.x = this._nextContainerOriginalState.position.y;
        this._currentContainerEndState.alpha = 0;
    };
    return TransitionFadeOut;
}(TransitionFadeBase));
exports.TransitionFadeOut = TransitionFadeOut;


/***/ })
/******/ ]);
});
//# sourceMappingURL=lightweight-pixijs-engine.js.map