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

/** PixiApp Configuration */
export interface IPixiEngineConfiguration extends PIXI.RendererOptions {
    /** Flag for set debug mode (default = false) */
    debugMode?: boolean;

    /** Flag for set full-screen mode (default = false) */
    scaleToWindow?: boolean;
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
        this._config.scaleToWindow = config.scaleToWindow || false;

        // initialize framerate ONLY in debug mode
        if (this._config.debugMode) { this._initializeFpsMeter(); }

        // create pixi rendered and append to html body
        this._renderer = PIXI.autoDetectRenderer(config);
        console.log(this._renderer.type === PIXI.RENDERER_TYPE.WEBGL ? "Using WebGL Renderer" : "Using Canvas renderer");

        // si no se especifica un canvas, se añade al cuerpo html
        if (!this._config.view) { document.body.appendChild(this._renderer.view); }

        // initialize charm Tweening for pixi
        this._charm = new Charm(PIXI);

        // initialize sceneManager
        sceneManagerInstance.initialize(this._rootContainer);

        // start main loop
        this._mainLoop();

        // escale to window if full-screen mode
        if (this._config.scaleToWindow) {
            this._scaleToWindow(this._renderer.view);
            window.addEventListener("resize", (_event: Event) => { this._scaleToWindow(this._renderer.view); });
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
     * Function for scale a html element to windows
     * @param element element to scale
     * @param backgroundColor backgroundColor to set
     * @return scale factor
     */
    private _scaleToWindow(element: HTMLElement, backgroundColor?: string): number {

        backgroundColor = backgroundColor || "#2C3539";
        let scaleX: number, scaleY: number, scale: number, center: string;

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
            } else {
                center = "vertically";
            }
        } else {
            if (element.offsetHeight * scale < window.innerHeight) {
                center = "vertically";
            } else {
                center = "horizontally";
            }
        }

        // Center horizontally (for square or tall elementes)
        let margin: number;
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
    }

}


// create main app instance for export
export let pixiEngineInstance: IPixiEngine = new PixiEngine();
