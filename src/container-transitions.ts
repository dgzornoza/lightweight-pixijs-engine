import { IResolve, IReject } from "./interfaces";
import { pixiEngineInstance } from "./pixi-engine";
import { ContainerHelpers, IContainerTransition, IContainerProperties } from "./pixi-extensions";
import { ICharm } from "pixijs-charm";


/* tslint:disable no-bitwise */
export enum EnumDirections {
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
        this._currentContainerOriginalState = ContainerHelpers.getContainerProperties(currentContainer);
        this._currentContainerEndState = ContainerHelpers.getContainerProperties(currentContainer);

        this._nextContainerOriginalState = ContainerHelpers.getContainerProperties(nextContainer);
        this._nextContainerEndState = ContainerHelpers.getContainerProperties(nextContainer);
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
        ContainerHelpers.setContainerProperties(this._currentContainerOriginalState, this._currentContainer);
    }
}

/**
 * Clas for create container transition slide
 */
export class ContainerTransitionSlide extends ContainerTransitionBase {

    protected _direction: EnumDirections;
    protected _frames: number | undefined;
    protected _easingType: string | undefined;

    private _nextSceneTween: ICharm.Tween.ITweenCollection;
    private _currentSceneTween: ICharm.Tween.ITweenCollection;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer);

        this._direction = direction;
        this._frames = frames;
        this._easingType = easingType;

        this._configure();
    }

    public start(): Promise<PIXI.Container> {

        let result: Promise<PIXI.Container> = new Promise((resolve: IResolve<PIXI.Container>, _reject: IReject) => {

            this._nextSceneTween = pixiEngineInstance.charm.slide(this._nextContainer, this._nextContainerEndState.position.x,
                this._nextContainerEndState.position.y, this._frames, this._easingType);
            this._currentSceneTween = pixiEngineInstance.charm.slide(this._currentContainer,
                this._currentContainerEndState.position.x, this._currentContainerEndState.position.y);

            this._currentSceneTween.onCompleted = () => {
                resolve();
            };
        });

        return result;
    }

    public stop(): void {
        pixiEngineInstance.charm.removeTween(this._nextSceneTween);
        pixiEngineInstance.charm.removeTween(this._currentSceneTween);
    }

    protected _configure(): void {

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
    }
}

/**
 * Clas for create container transition fade in
 */
export class ContainerTransitionFadeIn extends ContainerTransitionSlide {

    private _nextSceneFadeInTween: ICharm.Tween.ITween;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer, direction, frames, easingType);

        this._configure();
    }

    public start(): Promise<PIXI.Container> {
        // equals to parent plus fadein
        this._nextSceneFadeInTween = pixiEngineInstance.charm.fadeIn(this._nextContainer);
        return super.start();
    }

    public stop(): void {
        super.stop();
        pixiEngineInstance.charm.removeTween(this._nextSceneFadeInTween);
    }

    protected _configure(): void {
        // equal parent but, current scene not move
        super._configure();
        this._currentContainerEndState.position.x = this._currentContainerOriginalState.position.x;
        this._currentContainerEndState.position.y = this._currentContainerOriginalState.position.y;

        this._nextContainer.alpha = 0;
    }
}

/**
 * Clas for create container transition fade in
 */
export class ContainerTransitionFadeOut extends ContainerTransitionSlide {

    private _nextSceneFadeOutTween: ICharm.Tween.ITween;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingType?: string) {
        super(currentContainer, nextContainer, direction, frames, easingType);

        this._configure();
    }

    public start(): Promise<PIXI.Container> {
        // this transition require nextscene before current
        if (this._currentContainer.parent.getChildIndex(this._currentContainer) < this._currentContainer.parent.getChildIndex(this._nextContainer)) {
            this._currentContainer.parent.swapChildren(this._currentContainer, this._nextContainer);
        }
        // equals to parent plus fadeout
        pixiEngineInstance.charm.fadeOut(this.currentContainer);
        return super.start();
    }

    public stop(): void {
        super.stop();
        pixiEngineInstance.charm.removeTween(this._nextSceneFadeOutTween);
    }

    public restore(): void {
        super.restore();
        // restore current container alpha
        this.currentContainer.alpha = 1;
    }

    protected _configure(): void {
        // equal parent but, next scene not move
        super._configure();
        this.nextContainer.position.y = this._nextContainerOriginalState.position.x;
        this.nextContainer.position.x = this._nextContainerOriginalState.position.y;
    }
}
