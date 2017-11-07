// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../pixijs-charm

import { ICharm } from "pixijs-charm";

export enum EnumDirections {
        UP = 1,
        DOWN = 3,
        LEFT = 4,
        RIGHT = 12,
}
/** Class with easing types for transitions */
export class EasingTypes {
        /** No easing on the sprite at all; the sprite just starts and stops abruptly. */
        static readonly linear: string;
        /** Speeds the sprite up and slows it down in a very natural looking way. */
        static readonly smoothstep: string;
        /** Speeds the sprite up and slows it down in a very natural looking way. */
        static readonly smoothstepSquared: string;
        /** Speeds the sprite up and slows it down in a very natural looking way. */
        static readonly smoothstepCubed: string;
        /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
        static readonly acceleration: string;
        /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
        static readonly accelerationCubed: string;
        /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
            * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
            */
        static readonly deceleration: string;
        /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
            * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
            */
        static readonly decelerationCubed: string;
        static readonly sine: string;
        static readonly sineSquared: string;
        static readonly sineCubed: string;
        static readonly inverseSine: string;
        static readonly inverseSineSquared: string;
        static readonly inverseSineCubed: string;
        /** "bounce 10 -10". This will make the sprite overshoot the start and end points and bounce slightly when it hits them.
            * Try changing the multipliers, 10 and -10, to vary the effect.
            */
        static readonly bounce: string;
}
export abstract class ContainerTransitionBase implements IContainerTransition {
        protected _currentContainer: PIXI.Container;
        protected _currentContainerOriginalState: IContainerProperties;
        protected _currentContainerEndState: IContainerProperties;
        protected _nextContainer: PIXI.Container;
        protected _nextContainerOriginalState: IContainerProperties;
        protected _nextContainerEndState: IContainerProperties;
        constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container);
        readonly nextContainer: PIXI.Container;
        readonly currentContainer: PIXI.Container;
        /**
            * Override for implement transition
            */
        abstract start(): Promise<PIXI.Container>;
        /**
            * Override for stop transition
            */
        abstract stop(): void;
        /**
            * If override, call super.restore() for restore container positions.
            * This function is called before change current scene for new scene
            */
        restore(): void;
}
/**
    * Clas for create container transition slide
    */
export class ContainerTransitionSlide extends ContainerTransitionBase {
        protected _direction: EnumDirections;
        protected _frames: number | undefined;
        protected _easingType: string | undefined;
        constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
        start(): Promise<PIXI.Container>;
        stop(): void;
        protected _configure(): void;
}
/**
    * Clas for create container transition fade in
    */
export class ContainerTransitionFadeIn extends ContainerTransitionSlide {
        constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
        start(): Promise<PIXI.Container>;
        stop(): void;
        protected _configure(): void;
}
/**
    * Clas for create container transition fade in
    */
export class ContainerTransitionFadeOut extends ContainerTransitionSlide {
        constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
        start(): Promise<PIXI.Container>;
        stop(): void;
        restore(): void;
        protected _configure(): void;
}

/** @Brief Class for define help methods */
export class Helpers {
        /** Funcion para crear un mixing en typescript y poder componer clases
            * @param clase derivada de los objetos que se quiere componer
            * @param array con las clases hijas usadas para la composicion
            * https://www.typescriptlang.org/docs/handbook/mixins.html
            */
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
        /**
            * helper for create object instance from name.
            * @param context object context for create instance
            * @param name Name of class for create instance
            * @param args constructor arguments
            */
        static createInstance<T>(context: Object, name: string, ...args: any[]): T;
        /**
            * Funcion para cargar un script de forma dinamica
            * @param url Url del script a cargar
            * @param callback Funcion callback que sera invocada tras cargar el script
            */
        static loadScript(url: string, callback: Function): void;
}

/** Interface for create dynamic objects */
export interface IDynamic<T> {
        [key: string]: T;
}
/** Interface for create key/values pair */
export interface IKeyValueMap<T, U> {
        key: T;
        value: U;
}
export interface IResolve<T> {
        (value?: T | PromiseLike<T>): void;
}
export interface IReject {
        (reason?: any): void;
}
/**
    * Implement this interface for add update frame operations in scenegraph.
    */
export interface IUpdateFrame {
        updateFrame(): void;
}

import "pixi.js";
import "fpsmeter";
import "pixijs-charm";
import "./interfaces";
/**
    * Enum with allowed engine states
    */
export enum EnumEngineStates {
        PAUSED = 1,
        RUNNING = 2,
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
        FIXED_WIDTH = 5,
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
export let pixiEngineInstance: IPixiEngine;

/**
    * Interface for create transitions
    */
export interface IContainerTransition {
        readonly nextContainer: PIXI.Container;
        readonly currentContainer: PIXI.Container;
        start(): Promise<PIXI.Container>;
        stop(): void;
        restore(): void;
}
/**
    * Pixi container properties
    */
export interface IContainerProperties {
        position: PIXI.PointLike;
        scale: PIXI.PointLike;
        rotation: number;
        skew: PIXI.PointLike;
        pivot: PIXI.PointLike;
        width: number;
        height: number;
}
export class ContainerHelpers {
        /** method for get container properties */
        static getContainerProperties(container: PIXI.Container): IContainerProperties;
        /** method for set container properties */
        static setContainerProperties(properties: IContainerProperties, container: PIXI.Container): void;
}

export interface ISceneManager {
        /**
            * Get current scene
            */
        readonly currentScene: PIXI.Container;
        /**
            * Initialize sceneManager (Only internal use)
            * @param rootContainser root container to render
            * @return true if can initialize, false otherwise
            */
        initialize(rootContainer: PIXI.Container): boolean;
        /**
            * create and replace scene from class type
            * @param id unique identifier for scene
            * @param sceneType scene type to create
            * @return true if replaced, false otherwise
            */
        createAndReplaceScene<T extends PIXI.Container>(id: string, sceneType: {
                new (): T;
        }): boolean;
        /**
            * Create new scene from class type
            * @param id unique identifier for scene
            * @param sceneType scene type to create
            * @return Scene created, undefined if can't create
            */
        createScene<T extends PIXI.Container>(id: string, sceneType: {
                new (): T;
        }): T | undefined;
        /**
            * Destroy scene by id, this function delete scene from sceneManager and PIXI
            * @param id scene unique identifier
            */
        destroySceneById(id: string): void;
        /**
            * Destroy scene, this function delete scene from sceneManager and PIXI
            * @param id scene unique identifier
            */
        destroyScene(scene: PIXI.Container): void;
        /**
            * Get scene from unique identifier
            * @param id scene unique identifier
            * @return scene node, undefined if not found
            */
        getScene(id: string): PIXI.Container | undefined;
        /**
            * Replace current scene with scene id
            * @param id scene unique identifier
            * @return true if replaced, false otherwise
            */
        replaceSceneFromId(id: string): boolean;
        /**
            * Replace current scene with transition
            * @param transition transition for change scene
            * @return true if replaced, false otherwise
            */
        replaceSceneWithTransition(transition: IContainerTransition): Promise<boolean>;
        /**
            * Replace current scene with scene
            * @param scene nextScene to replace
            * @return true if replaced, false otherwise
            */
        replaceScene(nextScene: PIXI.Container): void;
}
export let sceneManagerInstance: ISceneManager;

