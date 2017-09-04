/// <reference types="pixi.js" />
import "./prototypes";
import "./interfaces";
import "./containerTransitions";
import { ICharm } from "pixijs-charm";
import "fpsmeter";
import { ISceneManager } from "./sceneManager";
/**
 * Enum with allowed engine states
 */
export declare enum EnumEngineStates {
    PAUSED = 1,
    RUNNING = 2,
}
/** PixiApp Configuration */
export interface IPixiEngineConfiguration extends PIXI.RendererOptions {
    /** Flag for set debug mode (default = false) */
    debugMode?: boolean;
    /** main scene path */
    mainScene: string;
    /** Flag for set full-screen mode (default = false) */
    scaleToWindow?: boolean;
}
/** Interface for pixi main app */
export interface IPixiEngine {
    /** Property for get pixi renderer */
    readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    /** Property for get pixi renderer */
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
export declare let pixiEngineInstance: IPixiEngine;
