/** Interface for create dynamic objects */
export interface IDynamic<T> {
    [key: string]: T;
}

/** Interface for create key/values pair */
export interface IKeyValueMap<T, U> {
    key: T;
    value: U;
}

export interface IResolve<T> {
    (value?: T | PromiseLike<T>): void;
}

export interface IReject {
    (reason?: any): void;
}

/**
 * Implement this interface for add update frame operations in scenegraph.
 */
export interface IUpdateFrame {
    updateFrame(): void;
}
