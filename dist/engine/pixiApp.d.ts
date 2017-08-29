/// <reference types="pixi.js" />
import "./helpers";
import { ICharm } from "pixijs-charm";
import "fpsmeter";
import { ISceneManager } from "./sceneManager";
/**
 * Enum with allowed engine states
 */
export declare enum enumEngineStates {
    PAUSED = 1,
    RUNNING = 2,
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
export declare let pixiApp: IPixiApp;
