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
    position: PIXI.PointLike;
    scale: PIXI.PointLike;
    rotation: number;
    skew: PIXI.PointLike;
    pivot: PIXI.PointLike;
    width: number;
    height: number;
}


export class ContainerHelpers {

    /** method for get container properties */
    public static getContainerProperties(container: PIXI.Container): IContainerProperties {
        let result: IContainerProperties = {
            height: container.height,
            pivot: {
                x: container.pivot.x,
                y: container.pivot.y
            } as PIXI.PointLike,
            position: {
                x: container.position.x,
                y: container.position.y
            } as PIXI.PointLike,
            rotation: container.rotation,
            scale: {
                x: container.scale.x,
                y: container.scale.y
            } as PIXI.PointLike,
            skew: {
                x: container.skew.x,
                y: container.skew.y
            } as PIXI.PointLike,
            width: container.width
        } as any;

        return result;
    }

    /** method for set container properties */
    public static setContainerProperties(properties: IContainerProperties, container: PIXI.Container): void {
        container.height = properties.height;
        container.rotation = properties.rotation;
        container.width = properties.width;

        container.position.copy(properties.position);
        container.pivot.copy(properties.pivot);
        container.scale.copy(properties.scale);
        container.skew.copy(properties.skew);
    }
}


