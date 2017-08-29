/******************************************
 * Helpers
 */
/** @Brief Class for define help methods */
declare class Helpers {
    /** Funcion para crear un mixing en typescript y poder componer clases
     * @param clase derivada de los objetos que se quiere componer
     * @param array con las clases hijas usadas para la composicion
     * https://www.typescriptlang.org/docs/handbook/mixins.html
     */
    static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    /**
     * helper for create object instance from name.
     * @param context object context for create instance
     * @param name Name of class for create instance
     * @param args constructor arguments
     */
    static createInstance<T>(context: Object, name: string, ...args: any[]): T;
    /** Funcion para cargar un css de forma dinamica
     * @param url url del css a cargar
     * @param insertBeforeId (Opcional) Identificador del elemento que sera usado para insertarse antes de el.
     * en caso de no especificarse sera añadido como ultimo elemento de <head>
     */
    static loadCss(url: string, insertBeforeId?: string): void;
    /**
     * Funcion para cargar un script de forma dinamica
     * @param url Url del script a cargar
     * @param callback Funcion callback que sera invocada tras cargar el script
     */
    static loadScript(url: string, callback: Function): void;
}
/**  Extend PIXI.Container interface with new features  */
declare namespace PIXI {
    interface Container {
        /** Extend method for get container properties */
        getContainerProperties(): IContainerProperties;
        /** Extend method for set container properties */
        setContainerProperties(properties: IContainerProperties): void;
    }
}
