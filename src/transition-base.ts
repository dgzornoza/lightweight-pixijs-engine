import { ContainerHelpers, ITransition, IContainerProperties } from "./pixi-extensions";
import { Tween } from "es6-tween";
import { IReject, IResolve } from "./interfaces";
import { EnumDirections } from "./infraestructure";


/**
 * Base class for implement container transitions
 */
export abstract class TransitionBase implements ITransition {

    protected _direction: EnumDirections;
    protected _duration: number | undefined;
    protected _easingFunction: Function | undefined;

    protected _currentContainer: PIXI.Container;
    protected _currentContainerEndState: IContainerProperties;
    protected _currentContainerOriginalState: IContainerProperties;
    protected _currentSceneTween: Tween;

    protected _nextContainer: PIXI.Container;
    protected _nextContainerEndState: IContainerProperties;
    protected _nextContainerOriginalState: IContainerProperties;
    protected _nextSceneTween: Tween;

    private _tweensComplete: number;

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, duration?: number, easingFunction?: Function) {

        this._nextContainer = nextContainer;
        this._currentContainer = currentContainer;

        this._direction = direction;
        this._duration = duration;
        this._easingFunction = easingFunction;

        // save original state objects
        this._currentContainerOriginalState = ContainerHelpers.getContainerProperties(currentContainer);
        this._nextContainerOriginalState = ContainerHelpers.getContainerProperties(nextContainer);

        // default end states = initial states
        this._currentContainerEndState = ContainerHelpers.getContainerProperties(currentContainer);
        this._nextContainerEndState = ContainerHelpers.getContainerProperties(nextContainer);

        this._configure();
    }

    public get nextContainer(): PIXI.Container {
        return this._nextContainer;
    }

    public get currentContainer(): PIXI.Container {
        return this._currentContainer;
    }

    public start(): Promise<PIXI.Container> {

        this._tweensComplete = 0;

        let result: Promise<PIXI.Container> = new Promise((resolve: IResolve<PIXI.Container>, _reject: IReject) => {

            this._nextSceneTween = this._getNextSceneTween();
            if (this._easingFunction) { this._nextSceneTween.easing(this._easingFunction); }
            this._nextSceneTween.on("complete", () => {
                this._tweensComplete++;
                if (this._tweensComplete === 2) { resolve(); }
            });

            this._currentSceneTween = this._getCurrentSceneTween();
            if (this._easingFunction) { this._currentSceneTween.easing(this._easingFunction); }
            this._currentSceneTween.on("complete", () => {
                this._tweensComplete++;
                if (this._tweensComplete === 2) { resolve(); }
            });

            // HACK: force update always, currently in tween.js if start and end are equals, not update / complete callback is called.
            (this._currentSceneTween.object as any)._force_update_ = (this._nextSceneTween.object as any)._force_update_ = 0;
            (this._currentSceneTween._valuesEnd as any)._force_update_ = (this._nextSceneTween._valuesEnd as any)._force_update_ = 1;

            this._nextSceneTween.start();
            this._currentSceneTween.start();
        });

        return result;
    }

    public stop(): void {
        this._nextSceneTween.stop();
        this._currentSceneTween.stop();
    }

    /**
     * If override, call super.restore() for restore container positions.
     * This function is called after change current scene for new scene
     */
    public restore(): void {
        ContainerHelpers.setContainerProperties(this._currentContainerOriginalState, this._currentContainer);
        ContainerHelpers.setContainerProperties(this._nextContainerOriginalState, this._nextContainer);
    }

    /**
     * Override for configure transition
     */
    protected abstract _configure(): void;

    /**
     * Override for get Current Scene Tween
     */
    protected abstract _getCurrentSceneTween(): Tween;

    /**
     * Override for get Next Scene Tween
     */
    protected abstract _getNextSceneTween(): Tween;
}


