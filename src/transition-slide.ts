/* tslint:disable no-bitwise */
import { TransitionBase } from "./transition-base";
import { Tween } from "es6-tween";
import { EnumDirections } from "./infraestructure";

/**
 * Base class for create container transition slide
 */
export abstract class TransitionSlideBase extends TransitionBase {

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, duration?: number, easingFunction?: Function) {
        super(currentContainer, nextContainer, direction, duration, easingFunction);
    }

    protected _configure(): void {

        if ((this._direction & EnumDirections.UP) === EnumDirections.UP) {
            this._currentContainerEndState.position.y = -(this._currentContainer.parent.height / this._currentContainer.parent.scale.y);
        }
        if ((this._direction & EnumDirections.DOWN) === EnumDirections.DOWN) {
            this._currentContainerEndState.position.y = (this._currentContainer.parent.height / this._currentContainer.parent.scale.y);
        }
        if ((this._direction & EnumDirections.LEFT) === EnumDirections.LEFT) {
            this._currentContainerEndState.position.x = -(this._currentContainer.parent.width / this._currentContainer.parent.scale.x);
        }
        if ((this._direction & EnumDirections.RIGHT) === EnumDirections.RIGHT) {
            this._currentContainerEndState.position.x = (this._currentContainer.parent.width / this._currentContainer.parent.scale.x);
        }

        this._nextContainer.position.y = -this._currentContainerEndState.position.y;
        this._nextContainer.position.x = -this._currentContainerEndState.position.x;
    }

}

/**
 * Class for create container transition slide
 */
export class TransitionSlide extends TransitionSlideBase {

    constructor(currentContainer: PIXI.Container, nextContainer: PIXI.Container, direction: EnumDirections, duration?: number, easingFunction?: Function) {
        super(currentContainer, nextContainer, direction, duration, easingFunction);
    }

    protected _getCurrentSceneTween(): Tween {

        let tween: Tween = new Tween({
            x: this._currentContainer.position.x,
            y: this._currentContainer.position.y
        }).to({
            x: this._currentContainerEndState.position.x,
            y: this._currentContainerEndState.position.y
        }, this._duration);

        tween.on("update", (animationState: any) => {
            this._currentContainer.position.x = animationState.x;
            this._currentContainer.position.y = animationState.y;
        });

        return tween;
    }

    protected _getNextSceneTween(): Tween {

        let tween: Tween = new Tween({
            x: this._nextContainer.position.x,
            y: this._nextContainer.position.y
        }).to({
            x: this._nextContainerEndState.position.x,
            y: this._nextContainerEndState.position.y
        }, this._duration);

        tween.on("update", (animationState: any) => {
            this.nextContainer.position.x = animationState.x;
            this.nextContainer.position.y = animationState.y;
        });

        return tween;
    }

}
