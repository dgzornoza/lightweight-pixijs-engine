/******************************************
 * Helpers
 */


/** @Brief Class for define help methods */
class Helpers {

    /** Funcion para crear un mixing en typescript y poder componer clases
     * @param clase derivada de los objetos que se quiere componer
     * @param array con las clases hijas usadas para la composicion
     * https://www.typescriptlang.org/docs/handbook/mixins.html
     */
    public static applyMixins(derivedCtor: any, baseCtors: any[]): void {
        baseCtors.forEach((baseCtor: any) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: any) => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }

    /**
     * helper for create object instance from name.
     * @param context object context for create instance
     * @param name Name of class for create instance
     * @param args constructor arguments
     */
    public static createInstance<T>(context: Object, name: string, ...args: any[]): T {
        let instance: any = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance as T;
    }


    /** Funcion para cargar un css de forma dinamica
     * @param url url del css a cargar
     * @param insertBeforeId (Opcional) Identificador del elemento que sera usado para insertarse antes de el.
     * en caso de no especificarse sera añadido como ultimo elemento de <head>
     */
    public static loadCss(url: string, insertBeforeId?: string): void {
        let link: HTMLLinkElement = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        if (insertBeforeId) {
            let element: Element | null = document.querySelector(`#${insertBeforeId}`);
            element!.parentNode!.insertBefore(link, element);
        } else {
            document.getElementsByTagName("head")[0].appendChild(link);
        }
    }

    /**
     * Funcion para cargar un script de forma dinamica
     * @param url Url del script a cargar
     * @param callback Funcion callback que sera invocada tras cargar el script
     */
    public static loadScript(url: string, callback: Function): void {

            let script: HTMLScriptElement = document.createElement("script");
            script.type = "text/javascript";

            // IE
            if ((script as any).readyState) {
                (script as any).onreadystatechange = () => {
                    if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
                            (script as any).onreadystatechange = undefined;
                            callback();
                    }
                };
            // Others
            } else {
                script.onload = () => { callback(); };
            }

            script.src = url;
            document.body.appendChild(script);
        }
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

/* tslint:disable no-invalid-this */

PIXI.Container.prototype.getContainerProperties = function (): IContainerProperties {
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

PIXI.Container.prototype.setContainerProperties = function (properties: IContainerProperties): void {
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
