/**  Extend PIXI.Container interface with new features  */
declare namespace PIXI {
    interface Container {
        /** Extend method for get container properties */
        getContainerProperties(): EngineExtensions.IContainerProperties;
        /** Extend method for set container properties */
        setContainerProperties(properties: EngineExtensions.IContainerProperties): void;
    }
    namespace EngineExtensions {
        /**
         * Interface for create transitions
         */
        interface IContainerTransition {
            readonly nextContainer: PIXI.Container;
            readonly currentContainer: PIXI.Container;
            start(): Promise<PIXI.Container>;
            stop(): void;
            restore(): void;
        }
        /**
         * Pixi container properties
         */
        interface IContainerProperties {
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
