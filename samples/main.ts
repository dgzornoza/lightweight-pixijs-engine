import { IPixiApp, pixiApp, IPixiAppConfiguration } from "./engine/pixiApp";



/** Interface for pixi main app */
export interface IMainApp {

    /** Property for get pixi engine */
    readonly pixiApp: IPixiApp;

    /** property for get debug mode */
    readonly debugMode: boolean;
}

/** Pixi main app */
class MainApp implements IMainApp {

    private _debugMode: boolean;

    /** Default constructor */
    constructor() {
        this._init();
    }

    public get pixiApp(): IPixiApp {
        return pixiApp;
    }

    public get debugMode(): boolean {
        return this._debugMode;
    }

    private _init(): void {

        this._debugMode = "true" === "<%= DEBUG_MODE %>" as any;

        let config: IPixiAppConfiguration = {
            backgroundColor: parseInt("<%= BACKGROUND_COLOR %>", 10),
            designResolutionHeight: parseInt("<%= DESIGN_RESOLUTION_HEIGHT %>", 10),
            designResolutionWidth: parseInt("<%= DESIGN_RESOLUTION_WIDTH %>", 10),
            isDebugMode: this._debugMode,
            mainScene: "<%= MAIN_SCENE %>"
        };

        pixiApp.initialize(config);
    }


}


// create main app instance for export
export let mainApp: IMainApp = new MainApp();
