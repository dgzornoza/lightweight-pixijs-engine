/******************************************
 * Helpers
 */


/** @Brief Class for define help methods */

export class Helpers {

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
