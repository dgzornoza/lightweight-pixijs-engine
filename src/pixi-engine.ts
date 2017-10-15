import { ICharm, Charm } from "pixijs-charm";
import "fpsmeter";
import { sceneManagerInstance, ISceneManager } from "./scene-manager";
import "./interfaces";

export * from "./container-transitions";
export * from "./helpers";
export * from "./interfaces";
export * from "./pixi-extensions";
export * from "./scene-manager";



/**
 * Enum with allowed engine states
 */
export enum EnumEngineStates {
    PAUSED = 1,
    RUNNING = 2
}

/**
 * Enum for scale modes
 */
export enum EnumScaleMode {
    NO_SCALE = 0,
    EXACT_FIT = 1,
    NO_BORDER = 2,
    SHOW_ALL = 3,
    FIXED_HEIGHT = 4,
    FIXED_WIDTH = 5
}

/** PixiApp Configuration */
export interface IPixiEngineConfiguration extends PIXI.RendererOptions {
    /** Flag for set debug mode (default = false) */
    debugMode?: boolean;

    /** Flag for resize with browser size (default = true) */
    resizeWithBrowserSize?: boolean;

    /** Scale mode for canvas element (only if resizeWithBrowserSize = true) (default = EnumScaleMode.NO_SCALE) */
    scaleMode?: EnumScaleMode;
}

/** Interface for pixi main app */
export interface IPixiEngine {

    /** Property for get pixi renderer */
    readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    /** Property for get pixi scene manager */
    readonly sceneManager: ISceneManager;

    /**
     * Get current engine state
     */
    readonly state: EnumEngineStates;

    /**
     * Get charm library instance for Tweening
     */
    readonly charm: ICharm;

    /** Property for get debu-gmode */
    readonly debugMode: boolean;

    /**
     * Pause engine
     */
    pause(): void;

    /**
     * resume engine
     */
    resume(): void;

    /** Initialice pixiApp
     * @param config configuration for pixi app
     */
    initialize(config: IPixiEngineConfiguration): void;

}

/** Pixi main app */
class PixiEngine implements IPixiEngine {

    private _config: IPixiEngineConfiguration;
    private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private _rootContainer: PIXI.Container;
    private _state: EnumEngineStates;
    private _charm: ICharm;
    private _fpsMeter: FPSMeter;
    private _isInitialized: boolean;

    /** Default constructor */
    constructor() {
        this._rootContainer = new PIXI.Container();
        this._state = EnumEngineStates.PAUSED;
    }

    public get renderer(): PIXI.WebGLRenderer | PIXI.CanvasRenderer {
        return this._renderer;
    }

    public get sceneManager(): ISceneManager {
        return sceneManagerInstance;
    }

    public get state(): EnumEngineStates {
        return this._state;
    }

    public get charm(): ICharm {
        return this._charm;
    }

    public get debugMode(): boolean {
        return this._config.debugMode as boolean;
    }





    public pause(): void {
        this._state = EnumEngineStates.PAUSED;
    }

    public resume(): void {
        this._state = EnumEngineStates.RUNNING;
    }

    public initialize(config: IPixiEngineConfiguration): void {
        // can only initialize once
        if (this._isInitialized) { return; }
        this._isInitialized = true;

        // default configuracion
        this._config = config || {} as IPixiEngineConfiguration;
        this._config.resolution = config.resolution || window.devicePixelRatio;
        this._config.debugMode = config.debugMode || false;
        this._config.resizeWithBrowserSize = config.resizeWithBrowserSize === false ? false : true;
        this._config.scaleMode = this._config.scaleMode || EnumScaleMode.NO_SCALE;

        // initialize framerate ONLY in debug mode
        if (this._config.debugMode) { this._initializeFpsMeter(); }

        // create pixi rendered and append to html body
        this._renderer = PIXI.autoDetectRenderer(config);
        console.log(this._renderer.type === PIXI.RENDERER_TYPE.WEBGL ? "Using WebGL Renderer" : "Using Canvas renderer");

        // add canvas if not set.
        if (!this._config.view) { document.body.appendChild(this._renderer.view); }

        // initialize charm Tweening for pixi
        this._charm = new Charm(PIXI);

        // initialize sceneManager
        sceneManagerInstance.initialize(this._rootContainer);

        // start main loop
        this._mainLoop();

        // configure resize with browser size and scale modes
        if (this._config.resizeWithBrowserSize) {
            document.body.style.overflowX = document.body.style.overflowY = "hidden";
            this._resizeWithBrowserSize();
            window.addEventListener("resize", (_event: Event) => { this._resizeWithBrowserSize(); });
            window.addEventListener("deviceOrientation", (_event: Event) => { this._resizeWithBrowserSize(); });
        }

        // play engine
        this._state = EnumEngineStates.RUNNING;
    }

    private _mainLoop(): void {

        requestAnimationFrame(() => { this._mainLoop(); });

        let scene: PIXI.Container = sceneManagerInstance.currentScene;
        if (this._state !== EnumEngineStates.RUNNING || !scene) { return; }

        // fpsmeter ONLY debug mode
        if (this._config.debugMode) { this._fpsMeter.tickStart(); }

        // update charm Tweening
        this._charm.update();

        // call update in scenes
        for (let displayObject of this._rootContainer.children) {
            if (displayObject.visible && (displayObject as any).updateFrame) {
                (displayObject as any).updateFrame();
            }
        }

        // render root container
        this._renderer.render(this._rootContainer);

        // fpsmeter ONLY debug mode
        if (this._config.debugMode) { this._fpsMeter.tick(); }
    }

    private _initializeFpsMeter(): void {
        this._fpsMeter = new FPSMeter();
    }

    /**
     * Function for calculate the current window size and set the canvas renderer size accordingly
     */
    private _resizeWithBrowserSize(): void {

        let canvasElement: HTMLCanvasElement = this._renderer.view;

        // window width and height minus canvas border
        let screenWidth: number = window.innerWidth + (canvasElement.width - canvasElement.offsetWidth);
        let screenHeight: number = window.innerHeight + (canvasElement.height - canvasElement.offsetHeight);
        let sceneWidth: number = this._config.width!;
        let sceneHeight: number = this._config.height!;

        /**
         * Set the canvas size and display size
         * This way we can support retina graphics
         */
        canvasElement.width = screenWidth * window.devicePixelRatio;
        canvasElement.height = screenHeight * window.devicePixelRatio;
        canvasElement.style.width = screenWidth + "px";
        canvasElement.style.height = screenHeight + "px";

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
    }
}


// create main app instance for export
export let pixiEngineInstance: IPixiEngine = new PixiEngine();
