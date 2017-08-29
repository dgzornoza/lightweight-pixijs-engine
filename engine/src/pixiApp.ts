import "./helpers";
import { ICharm, Charm } from "pixijs-charm";
import "fpsmeter";

import { sceneManagerInstance, ISceneManager } from "./sceneManager";

/**
 * Enum with allowed engine states
 */
export enum enumEngineStates {
    PAUSED = 1,
    RUNNING = 2
}

/** PixiApp Configuration */
export interface IPixiAppConfiguration {
    /** Flag for set debug mode  */
    isDebugMode: boolean;
    /** design resolution width */
    designResolutionWidth: number;
    /** design resolution height */
    designResolutionHeight: number;
    /** pixi canvas background colour */
    backgroundColor: number;
    /** main scene path */
    mainScene: string;
}

/** Interface for pixi main app */
export interface IPixiApp {

    /** Property for get pixi renderer */
    readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    /** Property for get pixi renderer */
    readonly sceneManager: ISceneManager;

    /**
     * Get current engine state
     */
    readonly state: enumEngineStates;

    /**
     * Get charm library instance for Tweening
     */
    readonly charm: ICharm;

    /** Initialice pixiApp
     * @param config configuration for pixi app
     */
    initialize(config: IPixiAppConfiguration): void;

    /**
     * Pause engine
     */
    pause(): void;

    /**
     * resume engine
     */
    resume(): void;
}

/** Pixi main app */
class PixiApp implements IPixiApp {

    private _config: IPixiAppConfiguration;
    private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private _rootContainer: PIXI.Container;
    private _state: enumEngineStates;
    private _charm: ICharm;
    private _fpsMeter: FPSMeter;

    /** Default constructor */
    constructor() {
        this._rootContainer = new PIXI.Container();
        this._state = enumEngineStates.RUNNING;
    }

    public get renderer(): PIXI.WebGLRenderer | PIXI.CanvasRenderer {
        return this._renderer;
    }

    public get sceneManager(): ISceneManager {
        return sceneManagerInstance;
    }

    public pause(): void {
        this._state = enumEngineStates.PAUSED;
    }

    public resume(): void {
        this._state = enumEngineStates.RUNNING;
    }

    public get charm(): ICharm {
        return this._charm;
    }

    /**
     * Get current scene state
     */
    public get state(): enumEngineStates {
        return this._state;
    }


    public initialize(config: IPixiAppConfiguration): void {

        this._config = config;

        // initialize framerate ONLY in debug mode
        if (this._config.isDebugMode) { this._initializeFpsMeter(); }

        // create pixi rendered and append to html body
        this._renderer = PIXI.autoDetectRenderer(this._config.designResolutionWidth, this._config.designResolutionHeight,
            { resolution: window.devicePixelRatio, backgroundColor: this._config.backgroundColor });
        console.log(this._renderer.type === PIXI.RENDERER_TYPE.WEBGL ? "Using WebGL Renderer" : "Using Canvas renderer");

        document.body.appendChild(this._renderer.view);

        // escale to window
        this._scaleToWindow(this._renderer.view);
        window.addEventListener("resize", (_event: Event) => { this._scaleToWindow(this._renderer.view); });

        // initialize charm Tweening for pixi
        this._charm = new Charm(PIXI);

        // initialize sceneManager
        sceneManagerInstance.initialize(this._rootContainer);

        // set mainscene
        sceneManagerInstance.loadAndCreateScene(this._config.mainScene).then((mainScene: PIXI.Container) => {
            sceneManagerInstance.replaceScene(mainScene);

            // start main loop
            this._mainLoop();
        });
    }


    private _mainLoop(): void {

        requestAnimationFrame(() => { this._mainLoop(); });

        let scene: PIXI.Container = sceneManagerInstance.currentScene;
        if (this._state !== enumEngineStates.RUNNING || !scene) { return; }

        // fpsmeter ONLY debug mode
        if (this._config.isDebugMode) { this._fpsMeter.tickStart(); }

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
        if (this._config.isDebugMode) { this._fpsMeter.tick(); }
    }

    private _initializeFpsMeter(): void {
        this._fpsMeter = new FPSMeter();
    }

    /**
     * Function for scale a html element to windows from:
     * https://github.com/kittykatattack/scaleToWindow/blob/master/LICENSE.txt
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
export let pixiApp: IPixiApp = new PixiApp();
