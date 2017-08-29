
export interface ISceneManager {

    /**
     * Get current scene
     */
    readonly currentScene: PIXI.Container;

    /**
     * Initialize sceneManager (Only internal use)
     * @param rootContainser root container to render
     * @return true if can initialize, false otherwise
     */
    initialize(rootContainer: PIXI.Container): boolean;

    /**
     * Load and create new scene from file (for lazy load scenes)
     * @param path to scene file (relative to 'BASE_URL' without extension), by convention the class should be use the file name in Pascal Case.
     * @return Promise with Scene created, reject if can't create
     * @remarks the scene id is equial to file path.
     */
    loadAndCreateScene<T extends PIXI.Container>(path: string): Promise<T>;

    /**
     * Create new scene from class
     * @param id unique identifier for scene
     * @param sceneType scene type to create
     * @return Scene created, undefined if can't create
     */
    createScene<T extends PIXI.Container>(id: string, sceneType: { new (): T; }): T | undefined;


    /**
     * Destroy scene by id, this function delete scene from sceneManager and PIXI
     * @param id scene unique identifier
     */
    destroySceneById(id: string): void;

    /**
     * Destroy scene, this function delete scene from sceneManager and PIXI
     * @param id scene unique identifier
     */
    destroyScene(scene: PIXI.Container): void;


    /**
     * Get scene from unique identifier
     * @param id scene unique identifier
     * @return scene node, undefined if not found
     */
    getScene(id: string): PIXI.Container | undefined;

    /**
     * Replace current scene with scene id
     * @param id scene unique identifier
     * @return true if replaced, false otherwise
     */
    replaceSceneFromId(id: string): boolean;

    /**
     * Replace current scene with transition
     * @param transition transition for change scene
     * @return true if replaced, false otherwise
     */
    replaceSceneWithTransition(transition: IContainerTransition): Promise<boolean>;

    /**
     * Replace current scene with scene
     * @param scene nextScene to replace
     * @return true if replaced, false otherwise
     */
    replaceScene(nextScene: PIXI.Container): void;
}

/**
 * Engine SceneManager
 */
class SceneManager implements ISceneManager {

    private _rootContainer: PIXI.Container;
    private _scenes: IDynamic<PIXI.Container>;
    private _currentScene: PIXI.Container | undefined;

    constructor() {
        this._scenes = {} as IDynamic<PIXI.Container>;
        this._currentScene = undefined;
    }

    public initialize(rootContainer: PIXI.Container): boolean {
        if (this._rootContainer !== undefined) { return false; }

        this._rootContainer = rootContainer;
        this._rootContainer.name = "RootScene";
        return true;
    }

    public get currentScene(): PIXI.Container {
        return this._currentScene as PIXI.Container;
    }


    public loadAndCreateScene<T extends PIXI.Container>(path: string): Promise<T> {

        let result: Promise<T> = new Promise((resolve: IResolve<T>, _reject: IReject) => {

            if (this._scenes[path]) {
                console.warn(`Scene with path:'${path}' already exists`);
                _reject();
            }

            // load async script
            Helpers.loadScript(path, () => {
                try {
                    let sceneName: string = ("/" + path.split("/").pop()).slice(1);
                    sceneName = sceneName.charAt(0).toUpperCase() + sceneName.slice(1);
                    this._scenes[path] = Helpers.createInstance({}, sceneName);
                } catch (error) {
                    throw `Scene with path:'${path}' can't create`;
                }

                resolve(this._scenes[path] as T);
            });

        });

        return result;
    }

    public createScene<T extends PIXI.Container>(id: string, sceneType: { new (): T; }): T | undefined {

        if (this._scenes[id]) {
            console.warn(`Scene with id:'${id}' already exists`);
            return undefined;
        }

        this._scenes[id] = new sceneType();
        return this._scenes[id] as T;
    }

    public destroySceneById(id: string): void {
        let scene: PIXI.Container = this._scenes[id];

        if (!scene) {
            console.warn(`Scene with id:'${id}' not found`);
            return;
        }

        // delete scene from pixi
        this._scenes[id].destroy({ children: true, texture: true, baseTexture: true});

        // remove from scenemanager
        delete this._scenes[id];
    }

    public destroyScene(scene: PIXI.Container): void {

        for (let idScene in this._scenes) {
            if (this._scenes.hasOwnProperty(idScene) && this._scenes[idScene] === scene) {
                return this.destroySceneById(idScene);
            }
        }
    }

    public getScene(id: string): PIXI.Container | undefined {
        let scene: PIXI.Container = this._scenes[id];
        if (!scene) {
            console.warn(`Scene with id:'${id}' not found`);
        }

        return scene;
    }

    public replaceSceneFromId(id: string): boolean {
        let nextScene: PIXI.Container = this._scenes[id];

        if (!nextScene) {
            console.warn(`Scene with id:'${id}' not found`);
            return false;
        }

        return this.replaceScene(nextScene);
    }

    public replaceSceneWithTransition(transition: IContainerTransition): Promise<boolean> {

        this._rootContainer.addChild(transition.nextContainer);

        return transition.start()
            .then(() => {
                if (this._currentScene) { this._rootContainer.removeChild(this._currentScene); }
                transition.restore();
                this._currentScene = transition.nextContainer;
                return true;
            });
    }

    public replaceScene(nextScene: PIXI.Container): boolean {

        this._rootContainer.addChild(nextScene);

        if (this._currentScene) {
            this._rootContainer.removeChild(this._currentScene);
        }

        this._currentScene = nextScene;

        return true;
    }


}




// create unique scenemanager instance for export
export let sceneManagerInstance: ISceneManager = new SceneManager();
