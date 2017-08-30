/** Interface for create dynamic objects */
interface IDynamic<T> {
    [key: string]: T;
}

/** Interface for create key/values pair */
interface IKeyValueMap<T, U> {
    key: T;
    value: U;
}

interface IResolve<T> {
    (value?: T | PromiseLike<T>): void;
}

interface IReject {
    (reason?: any): void;
}

/**
 * Implement this interface for add update frame operations in scenegraph.
 */
interface IUpdateFrame {
    updateFrame(): void;
}

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


/**  Extend PIXI.Container interface with new features  */
declare namespace PIXI {

    /* tslint:disable interface-name */
    interface Container {
        /** Extend method for get container properties */
        getContainerProperties(): IContainerProperties;
        /** Extend method for set container properties */
        setContainerProperties(properties: IContainerProperties): void;
    }
    /* tslint:enable interface-name */

}
