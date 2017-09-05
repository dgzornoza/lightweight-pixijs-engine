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
    scale: PIXI.Point | PIXI.ObservablePoint;
    rotation: number;
    skew: PIXI.ObservablePoint;
    pivot: PIXI.Point | PIXI.ObservablePoint;
    width: number;
    height: number;
}


export class ContainerHelpers {

    /** method for get container properties */
    public static getContainerProperties(container: PIXI.Container): IContainerProperties {
        let result: IContainerProperties = {
            height: container.height,
            rotation: container.rotation,
            width: container.width,
            x: container.x,
            y: container.y
        } as any;

        result.pivot.copy(container.pivot);
        result.scale.copy(container.scale);
        result.skew.copy(container.skew);

        return result;
    }

    /** method for set container properties */
    public static setContainerProperties(properties: IContainerProperties, container: PIXI.Container): void {
        container.height = properties.height;
        container.pivot.copy(properties.pivot);
        container.rotation = properties.rotation;
        container.scale.copy(properties.scale);
        container.skew.copy(properties.skew);
        container.width = properties.width;
        container.x = properties.x;
        container.y = properties.y;
    }
}


