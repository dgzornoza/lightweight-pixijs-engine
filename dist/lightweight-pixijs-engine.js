(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("pixijs-charm"), require("fpsmeter"));
	else if(typeof define === 'function' && define.amd)
		define("lightweight-pixijs-engine", ["pixijs-charm", "fpsmeter"], factory);
	else if(typeof exports === 'object')
		exports["lightweight-pixijs-engine"] = factory(require("pixijs-charm"), require("fpsmeter"));
	else
		root["lightweight-pixijs-engine"] = factory(root["pixijs-charm"], root["fpsmeter"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var pixijs_charm_1 = __webpack_require__(4);
__webpack_require__(5);
var scene_manager_1 = __webpack_require__(1);
__webpack_require__(6);
__export(__webpack_require__(7));
__export(__webpack_require__(8));
__export(__webpack_require__(2));
__export(__webpack_require__(1));
/**
 * Enum with allowed engine states
 */
var EnumEngineStates;
(function (EnumEngineStates) {
    EnumEngineStates[EnumEngineStates["PAUSED"] = 1] = "PAUSED";
    EnumEngineStates[EnumEngineStates["RUNNING"] = 2] = "RUNNING";
})(EnumEngineStates = exports.EnumEngineStates || (exports.EnumEngineStates = {}));
/** Pixi main app */
var PixiEngine = (function () {
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
    Object.defineProperty(PixiEngine.prototype, "charm", {
        get: function () {
            return this._charm;
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
        this._config.scaleToWindow = config.scaleToWindow || false;
        // initialize framerate ONLY in debug mode
        if (this._config.debugMode) {
            this._initializeFpsMeter();
        }
        // create pixi rendered and append to html body
        this._renderer = PIXI.autoDetectRenderer(config);
        console.log(this._renderer.type === PIXI.RENDERER_TYPE.WEBGL ? "Using WebGL Renderer" : "Using Canvas renderer");
        // si no se especifica un canvas, se añade al cuerpo html
        if (!this._config.view) {
            document.body.appendChild(this._renderer.view);
        }
        // escale to window if full-screen mode
        if (this._config.scaleToWindow) {
            this._scaleToWindow(this._renderer.view);
            window.addEventListener("resize", function (_event) { _this._scaleToWindow(_this._renderer.view); });
        }
        // initialize charm Tweening for pixi
        this._charm = new pixijs_charm_1.Charm(PIXI);
        // initialize sceneManager
        scene_manager_1.sceneManagerInstance.initialize(this._rootContainer);
        // start main loop
        this._mainLoop();
        // play engine
        this._state = EnumEngineStates.RUNNING;
    };
    PixiEngine.prototype._mainLoop = function () {
        var _this = this;
        requestAnimationFrame(function () { _this._mainLoop(); });
        var scene = scene_manager_1.sceneManagerInstance.currentScene;
        if (this._state !== EnumEngineStates.RUNNING || !scene) {
            return;
        }
        // fpsmeter ONLY debug mode
        if (this._config.debugMode) {
            this._fpsMeter.tickStart();
        }
        // update charm Tweening
        this._charm.update();
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
     * Function for scale a html element to windows
     * @param element element to scale
     * @param backgroundColor backgroundColor to set
     * @return scale factor
     */
    PixiEngine.prototype._scaleToWindow = function (element, backgroundColor) {
        backgroundColor = backgroundColor || "#2C3539";
        var scaleX, scaleY, scale, center;
        // 1. Scale the element to the correct size
        // Figure out the scale amount on each axis
        scaleX = window.innerWidth / element.offsetWidth;
        scaleY = window.innerHeight / element.offsetHeight;
        // Scale the element based on whichever value is less: `scaleX` or `scaleY`
        scale = Math.min(scaleX, scaleY);
        element.style.transformOrigin = "0 0";
        element.style.transform = "scale(" + scale + ")";
        // 2. Center the element.
        // Decide whether to center the element vertically or horizontally.
        // Wide elementes should be centered vertically, and
        // square or tall elementes should be centered horizontally
        if (element.offsetWidth > element.offsetHeight) {
            if (element.offsetWidth * scale < window.innerWidth) {
                center = "horizontally";
            }
            else {
                center = "vertically";
            }
        }
        else {
            if (element.offsetHeight * scale < window.innerHeight) {
                center = "vertically";
            }
            else {
                center = "horizontally";
            }
        }
        // Center horizontally (for square or tall elementes)
        var margin;
        if (center === "horizontally") {
            margin = (window.innerWidth - element.offsetWidth * scale) / 2;
            element.style.marginTop = "0";
            element.style.marginBottom = "0";
            element.style.marginLeft = margin + "px";
            element.style.marginRight = margin + "px";
        }
        // Center vertically (for wide elementes)
        if (center === "vertically") {
            margin = (window.innerHeight - element.offsetHeight * scale) / 2;
            element.style.marginTop = margin + "px";
            element.style.marginBottom = margin + "px";
            element.style.marginLeft = "0";
            element.style.marginRight = "0";
        }
        // 3. Remove any padding from the element  and body and set the element
        // display style to "block"
        element.style.paddingLeft = "0";
        element.style.paddingRight = "0";
        element.style.paddingTop = "0";
        element.style.paddingBottom = "0";
        element.style.display = "block";
        // 4. Set the color of the HTML body background
        document.body.style.backgroundColor = backgroundColor;
        // 5. Return the `scale` value. This is important, because you'll nee this value
        // for correct hit testing between the pointer and sprites
        return scale;
    };
    return PixiEngine;
}());
// create main app instance for export
exports.pixiEngineInstance = new PixiEngine();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Engine SceneManager
 */
var SceneManager = (function () {
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
            transition.restore();
            _this._currentScene = transition.nextContainer;
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
var ContainerHelpers = (function () {
    function ContainerHelpers() {
    }
    /** method for get container properties */
    ContainerHelpers.getContainerProperties = function (container) {
        var result = {
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 7 */
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
var pixi_engine_1 = __webpack_require__(0);
var pixi_extensions_1 = __webpack_require__(2);
/* tslint:disable no-bitwise */
var EnumDirections;
(function (EnumDirections) {
    EnumDirections[EnumDirections["UP"] = 1] = "UP";
    EnumDirections[EnumDirections["DOWN"] = 3] = "DOWN";
    EnumDirections[EnumDirections["LEFT"] = 4] = "LEFT";
    EnumDirections[EnumDirections["RIGHT"] = 12] = "RIGHT";
})(EnumDirections = exports.EnumDirections || (exports.EnumDirections = {}));
/** Class with easing types for transitions */
var EasingTypes = (function () {
    function EasingTypes() {
    }
    /** No easing on the sprite at all; the sprite just starts and stops abruptly. */
    EasingTypes.linear = "linear";
    /** Speeds the sprite up and slows it down in a very natural looking way. */
    EasingTypes.smoothstep = "smoothstep";
    /** Speeds the sprite up and slows it down in a very natural looking way. */
    EasingTypes.smoothstepSquared = "smoothstepSquared";
    /** Speeds the sprite up and slows it down in a very natural looking way. */
    EasingTypes.smoothstepCubed = "smoothstepCubed";
    /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
    EasingTypes.acceleration = "acceleration";
    /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
    EasingTypes.accelerationCubed = "accelerationCubed";
    /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
     * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
     */
    EasingTypes.deceleration = "deceleration";
    /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
     * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
     */
    EasingTypes.decelerationCubed = "decelerationCubed";
    EasingTypes.sine = "sine";
    EasingTypes.sineSquared = "sineSquared";
    EasingTypes.sineCubed = "sineCubed";
    EasingTypes.inverseSine = "inverseSine";
    EasingTypes.inverseSineSquared = "inverseSineSquared";
    EasingTypes.inverseSineCubed = "inverseSineCubed";
    /** "bounce 10 -10". This will make the sprite overshoot the start and end points and bounce slightly when it hits them.
     * Try changing the multipliers, 10 and -10, to vary the effect.
     */
    EasingTypes.bounce = "bounce";
    return EasingTypes;
}());
exports.EasingTypes = EasingTypes;
var ContainerTransitionBase = (function () {
    function ContainerTransitionBase(currentContainer, nextContainer) {
        this._nextContainer = nextContainer;
        this._currentContainer = currentContainer;
        // initially all properties are some
        this._currentContainerOriginalState = pixi_extensions_1.ContainerHelpers.getContainerProperties(currentContainer);
        this._currentContainerEndState = pixi_extensions_1.ContainerHelpers.getContainerProperties(currentContainer);
        this._nextContainerOriginalState = pixi_extensions_1.ContainerHelpers.getContainerProperties(nextContainer);
        this._nextContainerEndState = pixi_extensions_1.ContainerHelpers.getContainerProperties(nextContainer);
    }
    Object.defineProperty(ContainerTransitionBase.prototype, "nextContainer", {
        get: function () {
            return this._nextContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerTransitionBase.prototype, "currentContainer", {
        get: function () {
            return this._currentContainer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If override, call super.restore() for restore container positions.
     * This function is called before change current scene for new scene
     */
    ContainerTransitionBase.prototype.restore = function () {
        pixi_extensions_1.ContainerHelpers.setContainerProperties(this._currentContainerOriginalState, this._currentContainer);
    };
    return ContainerTransitionBase;
}());
exports.ContainerTransitionBase = ContainerTransitionBase;
/**
 * Clas for create container transition slide
 */
var ContainerTransitionSlide = (function (_super) {
    __extends(ContainerTransitionSlide, _super);
    function ContainerTransitionSlide(currentContainer, nextContainer, direction, frames, easingType) {
        var _this = _super.call(this, currentContainer, nextContainer) || this;
        _this._direction = direction;
        _this._frames = frames;
        _this._easingType = easingType;
        _this._configure();
        return _this;
    }
    ContainerTransitionSlide.prototype.start = function () {
        var _this = this;
        var result = new Promise(function (resolve, _reject) {
            _this._nextSceneTween = pixi_engine_1.pixiEngineInstance.charm.slide(_this._nextContainer, _this._nextContainerEndState.position.x, _this._nextContainerEndState.position.y, _this._frames, _this._easingType);
            _this._currentSceneTween = pixi_engine_1.pixiEngineInstance.charm.slide(_this._currentContainer, _this._currentContainerEndState.position.x, _this._currentContainerEndState.position.y);
            _this._currentSceneTween.onCompleted = function () {
                resolve();
            };
        });
        return result;
    };
    ContainerTransitionSlide.prototype.stop = function () {
        pixi_engine_1.pixiEngineInstance.charm.removeTween(this._nextSceneTween);
        pixi_engine_1.pixiEngineInstance.charm.removeTween(this._currentSceneTween);
    };
    ContainerTransitionSlide.prototype._configure = function () {
        this._nextContainerEndState.position.y = this._nextContainerOriginalState.position.y;
        this._nextContainerEndState.position.x = this._nextContainerOriginalState.position.x;
        if ((this._direction & EnumDirections.UP) === EnumDirections.UP) {
            this._currentContainerEndState.position.y = -this._currentContainer.parent.height;
        }
        if ((this._direction & EnumDirections.DOWN) === EnumDirections.DOWN) {
            this._currentContainerEndState.position.y = this._currentContainer.parent.height;
        }
        if ((this._direction & EnumDirections.LEFT) === EnumDirections.LEFT) {
            this._currentContainerEndState.position.x = -this._currentContainer.parent.width;
        }
        if ((this._direction & EnumDirections.RIGHT) === EnumDirections.RIGHT) {
            this._currentContainerEndState.position.x = this._currentContainer.parent.width;
        }
        this.nextContainer.position.y = -this._currentContainerEndState.position.y;
        this.nextContainer.position.x = -this._currentContainerEndState.position.x;
    };
    return ContainerTransitionSlide;
}(ContainerTransitionBase));
exports.ContainerTransitionSlide = ContainerTransitionSlide;
/**
 * Clas for create container transition fade in
 */
var ContainerTransitionFadeIn = (function (_super) {
    __extends(ContainerTransitionFadeIn, _super);
    function ContainerTransitionFadeIn(currentContainer, nextContainer, direction, frames, easingType) {
        var _this = _super.call(this, currentContainer, nextContainer, direction, frames, easingType) || this;
        _this._configure();
        return _this;
    }
    ContainerTransitionFadeIn.prototype.start = function () {
        // equals to parent plus fadein
        this._nextSceneFadeInTween = pixi_engine_1.pixiEngineInstance.charm.fadeIn(this._nextContainer);
        return _super.prototype.start.call(this);
    };
    ContainerTransitionFadeIn.prototype.stop = function () {
        _super.prototype.stop.call(this);
        pixi_engine_1.pixiEngineInstance.charm.removeTween(this._nextSceneFadeInTween);
    };
    ContainerTransitionFadeIn.prototype._configure = function () {
        // equal parent but, current scene not move
        _super.prototype._configure.call(this);
        this._currentContainerEndState.position.x = this._currentContainerOriginalState.position.x;
        this._currentContainerEndState.position.y = this._currentContainerOriginalState.position.y;
        this._nextContainer.alpha = 0;
    };
    return ContainerTransitionFadeIn;
}(ContainerTransitionSlide));
exports.ContainerTransitionFadeIn = ContainerTransitionFadeIn;
/**
 * Clas for create container transition fade in
 */
var ContainerTransitionFadeOut = (function (_super) {
    __extends(ContainerTransitionFadeOut, _super);
    function ContainerTransitionFadeOut(currentContainer, nextContainer, direction, frames, easingType) {
        var _this = _super.call(this, currentContainer, nextContainer, direction, frames, easingType) || this;
        _this._configure();
        return _this;
    }
    ContainerTransitionFadeOut.prototype.start = function () {
        // this transition require nextscene before current
        if (this._currentContainer.parent.getChildIndex(this._currentContainer) < this._currentContainer.parent.getChildIndex(this._nextContainer)) {
            this._currentContainer.parent.swapChildren(this._currentContainer, this._nextContainer);
        }
        // equals to parent plus fadeout
        pixi_engine_1.pixiEngineInstance.charm.fadeOut(this.currentContainer);
        return _super.prototype.start.call(this);
    };
    ContainerTransitionFadeOut.prototype.stop = function () {
        _super.prototype.stop.call(this);
        pixi_engine_1.pixiEngineInstance.charm.removeTween(this._nextSceneFadeOutTween);
    };
    ContainerTransitionFadeOut.prototype.restore = function () {
        _super.prototype.restore.call(this);
        // restore current container alpha
        this.currentContainer.alpha = 1;
    };
    ContainerTransitionFadeOut.prototype._configure = function () {
        // equal parent but, next scene not move
        _super.prototype._configure.call(this);
        this.nextContainer.position.y = this._nextContainerOriginalState.position.x;
        this.nextContainer.position.x = this._nextContainerOriginalState.position.y;
    };
    return ContainerTransitionFadeOut;
}(ContainerTransitionSlide));
exports.ContainerTransitionFadeOut = ContainerTransitionFadeOut;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/******************************************
 * Helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** @Brief Class for define help methods */
var Helpers = (function () {
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=lightweight-pixijs-engine.js.map