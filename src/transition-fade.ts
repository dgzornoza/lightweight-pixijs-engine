import { TransitionSlideBase } from "./transition-slide";
import { Tween } from "es6-tween";
import { EnumDirections } from "./infraestructure";


/**
 * Base class for create container transition slide
 */
export abstract class TransitionFadeBase extends TransitionSlideBase {

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, duration?: number, easingFunction?: Function) {
        super(currentContainer, nextContainer, direction, duration, easingFunction);
    }

    protected _getCurrentSceneTween(): Tween {

        let tween: Tween = new Tween({
            x: this._currentContainer.position.x,
            y: this._currentContainer.position.y,
            alpha: this._currentContainer.alpha
        }).to({
            x: this._currentContainerEndState.position.x,
            y: this._currentContainerEndState.position.y,
            alpha: this._currentContainerEndState.alpha
        }, this._duration);

        tween.on("update", (animationState: any) => {
            this._currentContainer.position.x = animationState.x;
            this._currentContainer.position.y = animationState.y;
            this._currentContainer.alpha = animationState.alpha;
        });

        return tween;
    }

    protected _getNextSceneTween(): Tween {

        let tween: Tween = new Tween({
            x: this._nextContainer.position.x,
            y: this._nextContainer.position.y,
            alpha: this._nextContainer.alpha
        }).to({
            x: this._nextContainerEndState.position.x,
            y: this._nextContainerEndState.position.y,
            alpha: this._nextContainerEndState.alpha
        }, this._duration);

        tween.on("update", (animationState: any) => {
            this._nextContainer.position.x = animationState.x;
            this._nextContainer.position.y = animationState.y;
            this._nextContainer.alpha = animationState.alpha;
        });

        return tween;
    }

}

/**
 * Class for create container transition fade in
 */
export class TransitionFadeIn extends TransitionFadeBase {

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingFunction?: Function) {
        super(currentContainer, nextContainer, direction, frames, easingFunction);
    }

    protected _configure(): void {
        // equal inheritance 'TransitionSlideBase' but, current scene not move
        super._configure();
        this._currentContainerEndState.position.x = this._currentContainerOriginalState.position.x;
        this._currentContainerEndState.position.y = this._currentContainerOriginalState.position.y;

        this._nextContainer.alpha = 0;
    }
}


/**
 * Clas for create container transition fade in
 */
export class TransitionFadeOut extends TransitionFadeBase {

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, frames?: number, easingFunction?: Function) {
        super(currentContainer, nextContainer, direction, frames, easingFunction);
    }

    public start(): Promise<PIXI.Container> {
        // this transition require nextscene before current
        if (this._currentContainer.parent.getChildIndex(this._currentContainer) < this._currentContainer.parent.getChildIndex(this._nextContainer)) {
            this._currentContainer.parent.swapChildren(this._currentContainer, this._nextContainer);
        }
        return super.start();
    }

    protected _configure(): void {
        // equal inheritance 'TransitionSlideBase' but, next scene not move
        super._configure();

        this.nextContainer.position.y = this._nextContainerOriginalState.position.x;
        this.nextContainer.position.x = this._nextContainerOriginalState.position.y;

        this._currentContainerEndState.alpha = 0;
    }

}
