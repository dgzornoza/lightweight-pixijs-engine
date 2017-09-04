/**  Extend PIXI.Container interface with new features  */
namespace PIXI {

    /* tslint:disable interface-name */
    export interface Container {
        /** Extend method for get container properties */
        getContainerProperties(): EngineExtensions.IContainerProperties;
        /** Extend method for set container properties */
        setContainerProperties(properties: EngineExtensions.IContainerProperties): void;
    }
    /* tslint:enable interface-name */

    export namespace EngineExtensions {
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
            x: number;
            y: number;
            scaleX: number;
            scaleY: number;
            rotation: number;
            skewX: number;
            skewY: number;
            pivotX: number;
            pivotY: number;
            width: number;
            height: number;
        }
    }

}



/* tslint:disable no-invalid-this */

PIXI.Container.prototype.getContainerProperties = function (): PIXI.EngineExtensions.IContainerProperties {
    return {
        height: this.height,
        pivotX: this.pivotX,
        pivotY: this.pivotY,
        rotation: this.rotation,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        width: this.width,
        x: this.x,
        y: this.y
    };
};

PIXI.Container.prototype.setContainerProperties = function (properties: PIXI.EngineExtensions.IContainerProperties): void {
    this.height = properties.height;
    this.pivotX = properties.pivotX;
    this.pivotY = properties.pivotY;
    this.rotation = properties.rotation;
    this.scaleX = properties.scaleX;
    this.scaleY = properties.scaleY;
    this.skewX = properties.skewX;
    this.skewY = properties.skewY;
    this.width = properties.width;
    this.x = properties.x;
    this.y = properties.y;
};

/* tslint:enable no-invalid-this */
