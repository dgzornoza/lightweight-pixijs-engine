export declare enum EnumDirections {
    UP = 1,
    DOWN = 3,
    LEFT = 4,
    RIGHT = 12,
}
/** Class with easing types for transitions */
export declare class EasingTypes {
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
export declare abstract class ContainerTransitionBase implements PIXI.EngineExtensions.IContainerTransition {
    protected _currentContainer: PIXI.Container;
    protected _currentContainerOriginalState: PIXI.EngineExtensions.IContainerProperties;
    protected _currentContainerEndState: PIXI.EngineExtensions.IContainerProperties;
    protected _nextContainer: PIXI.Container;
    protected _nextContainerOriginalState: PIXI.EngineExtensions.IContainerProperties;
    protected _nextContainerEndState: PIXI.EngineExtensions.IContainerProperties;
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
export declare class ContainerTransitionSlide extends ContainerTransitionBase {
    protected _direction: EnumDirections;
    protected _frames: number | undefined;
    protected _easingType: string | undefined;
    private _nextSceneTween;
    private _currentSceneTween;
    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
    start(): Promise<PIXI.Container>;
    stop(): void;
    protected _configure(): void;
}
/**
 * Clas for create container transition fade in
 */
export declare class ContainerTransitionFadeIn extends ContainerTransitionSlide {
    private _nextSceneFadeInTween;
    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
    start(): Promise<PIXI.Container>;
    stop(): void;
    protected _configure(): void;
}
/**
 * Clas for create container transition fade in
 */
export declare class ContainerTransitionFadeOut extends ContainerTransitionSlide {
    private _nextSceneFadeOutTween;
    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string);
    start(): Promise<PIXI.Container>;
    stop(): void;
    restore(): void;
    protected _configure(): void;
}
