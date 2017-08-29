/* tslint:disable no-bitwise */
import { pixiApp } from "./pixiApp";
import { ICharm } from "pixijs-charm";


export enum enumDirections {
    UP =    0b0001,
    DOWN =  0b0011,
    LEFT =  0b0100,
    RIGHT = 0b1100
}

/** Class with easing types for transitions */
export class EasingTypes {
    /** No easing on the sprite at all; the sprite just starts and stops abruptly. */
    public static readonly linear: string = "linear";

    /** Speeds the sprite up and slows it down in a very natural looking way. */
    public static readonly smoothstep: string = "smoothstep";
    /** Speeds the sprite up and slows it down in a very natural looking way. */
    public static readonly smoothstepSquared: string = "smoothstepSquared";
    /** Speeds the sprite up and slows it down in a very natural looking way. */
    public static readonly smoothstepCubed: string = "smoothstepCubed";

    /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
    public static readonly acceleration: string = "acceleration";
    /** Gradually speeds the sprite up and stops it abruptly. For a slightly more rounded acceleration effect, use "sine", "sineSquared", "sineCubed", */
    public static readonly accelerationCubed: string = "accelerationCubed";

    /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
     * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
     */
    public static readonly deceleration: string = "deceleration";
    /** Starts the sprite abruptly and gradually slows it down. For a slightly more rounded deceleration effect,
     * use "inverseSine", "inverseSineSquared", "inverseSineCubed"
     */
    public static readonly decelerationCubed: string = "decelerationCubed";

    public static readonly sine: string = "sine";
    public static readonly sineSquared: string = "sineSquared";
    public static readonly sineCubed: string = "sineCubed";
    public static readonly inverseSine: string = "inverseSine";
    public static readonly inverseSineSquared: string = "inverseSineSquared";
    public static readonly inverseSineCubed: string = "inverseSineCubed";

    /** "bounce 10 -10". This will make the sprite overshoot the start and end points and bounce slightly when it hits them.
     * Try changing the multipliers, 10 and -10, to vary the effect.
     */
    public static readonly bounce: string = "bounce";
}

export abstract class ContainerTransitionBase implements IContainerTransition {

    protected _currentContainer: PIXI.Container;
    protected _currentContainerOriginalState: IContainerProperties;
    protected _currentContainerEndState: IContainerProperties;

    protected _nextContainer: PIXI.Container;
    protected _nextContainerOriginalState: IContainerProperties;
    protected _nextContainerEndState: IContainerProperties;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container) {

        this._nextContainer = nextContainer;
        this._currentContainer = currentContainer;

        // initially all properties are some
        this._currentContainerOriginalState = currentContainer.getContainerProperties();
        this._currentContainerEndState = currentContainer.getContainerProperties();

        this._nextContainerOriginalState = nextContainer.getContainerProperties();
        this._nextContainerEndState = nextContainer.getContainerProperties();
    }

    get nextContainer(): PIXI.Container {
        return this._nextContainer;
    }

    get currentContainer(): PIXI.Container {
        return this._currentContainer;
    }

    /**
     * Override for implement transition
     */
    public abstract start(): Promise<PIXI.Container>;
    /**
     * Override for stop transition
     */
    public abstract stop(): void;

    /**
     * If override, call super.restore() for restore container positions.
     * This function is called before change current scene for new scene
     */
    public restore(): void {
        this._currentContainer.setContainerProperties(this._currentContainerOriginalState);
    }
}

/**
 * Clas for create container transition slide
 */
export class ContainerTransitionSlide extends ContainerTransitionBase {

    protected _direction: enumDirections;
    protected _frames: number | undefined;
    protected _easingType: string | undefined;

    private _nextSceneTween: ICharm.Tween.ITweenCollection;
    private _currentSceneTween: ICharm.Tween.ITweenCollection;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: enumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer);

        this._direction = direction;
        this._frames = frames;
        this._easingType = easingType;

        this._configure();
    }

    public start(): Promise<PIXI.Container> {

        let result: Promise<PIXI.Container> = new Promise((resolve: IResolve<PIXI.Container>, _reject: IReject) => {

            this._nextSceneTween = pixiApp.charm.slide(this._nextContainer, this._nextContainerEndState.x,
                this._nextContainerEndState.y, this._frames, this._easingType);
            this._currentSceneTween = pixiApp.charm.slide(this._currentContainer,
                this._currentContainerEndState.x, this._currentContainerEndState.y);

            this._currentSceneTween.onCompleted = () => {
                resolve();
            };
        });

        return result;
    }

    public stop(): void {
        pixiApp.charm.removeTween(this._nextSceneTween);
        pixiApp.charm.removeTween(this._currentSceneTween);
    }

    protected _configure(): void {

        this._nextContainerEndState.y = this._nextContainerOriginalState.y;
        this._nextContainerEndState.x = this._nextContainerOriginalState.x;

        if ((this._direction & enumDirections.UP) === enumDirections.UP) {
            this._currentContainerEndState.y = -this._currentContainer.parent.height;
        }
        if ((this._direction & enumDirections.DOWN) === enumDirections.DOWN) {
            this._currentContainerEndState.y = this._currentContainer.parent.height;
        }
        if ((this._direction & enumDirections.LEFT) === enumDirections.LEFT) {
            this._currentContainerEndState.x = -this._currentContainer.parent.width;
        }
        if ((this._direction & enumDirections.RIGHT) === enumDirections.RIGHT) {
            this._currentContainerEndState.x = this._currentContainer.parent.width;
        }

        this.nextContainer.y = -this._currentContainerEndState.y;
        this.nextContainer.x = -this._currentContainerEndState.x;
    }
}

/**
 * Clas for create container transition fade in
 */
export class ContainerTransitionFadeIn extends ContainerTransitionSlide {

    private _nextSceneFadeInTween: ICharm.Tween.ITween;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: enumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer, direction, frames, easingType);

        this._configure();
    }

    public start(): Promise<PIXI.Container> {
        // equals to parent plus fadein
        this._nextSceneFadeInTween = pixiApp.charm.fadeIn(this._nextContainer);
        return super.start();
    }

    public stop(): void {
        super.stop();
        pixiApp.charm.removeTween(this._nextSceneFadeInTween);
    }

    protected _configure(): void {
        // equal parent but, current scene not move
        super._configure();
        this._currentContainerEndState.x = this._currentContainerOriginalState.x;
        this._currentContainerEndState.y = this._currentContainerOriginalState.y;

        this._nextContainer.alpha = 0;
    }
}

/**
 * Clas for create container transition fade in
 */
export class ContainerTransitionFadeOut extends ContainerTransitionSlide {

    private _nextSceneFadeOutTween: ICharm.Tween.ITween;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: enumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer, direction, frames, easingType);

        this._configure();
    }

    public start(): Promise<PIXI.Container> {
        // this transition require nextscene before current
        if (this._currentContainer.parent.getChildIndex(this._currentContainer) < this._currentContainer.parent.getChildIndex(this._nextContainer)) {
            this._currentContainer.parent.swapChildren(this._currentContainer, this._nextContainer);
        }
        // equals to parent plus fadeout
        pixiApp.charm.fadeOut(this.currentContainer);
        return super.start();
    }

    public stop(): void {
        super.stop();
        pixiApp.charm.removeTween(this._nextSceneFadeOutTween);
    }

    public restore(): void {
        super.restore();
        // restore current container alpha
        this.currentContainer.alpha = 1;
    }

    protected _configure(): void {
        // equal parent but, next scene not move
        super._configure();
        this.nextContainer.y = this._nextContainerOriginalState.x;
        this.nextContainer.x = this._nextContainerOriginalState.y;
    }
}
