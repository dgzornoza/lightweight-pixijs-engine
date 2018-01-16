import { IDynamic } from "./interfaces";
import { ITransition } from "./pixi-extensions";

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
     * create and replace scene from class type
     * @param id unique identifier for scene
     * @param sceneType scene type to create
     * @return true if replaced, false otherwise
     */
    createAndReplaceScene<T extends PIXI.Container>(id: string, sceneType: { new(): T; }): boolean;

    /**
     * Create new scene from class type
     * @param id unique identifier for scene
     * @param sceneType scene type to create
     * @return Scene created, undefined if can't create
     */
    createScene<T extends PIXI.Container>(id: string, sceneType: { new(): T; }): T | undefined;


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
    replaceSceneWithTransition(transition: ITransition): Promise<boolean>;

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


    public createScene<T extends PIXI.Container>(id: string, sceneType: { new(): T; }): T | undefined {

        if (this._scenes[id]) {
            console.warn(`Scene with id:'${id}' already exists`);
            return undefined;
        }

        this._scenes[id] = new sceneType();
        return this._scenes[id] as T;
    }

    public createAndReplaceScene<T extends PIXI.Container>(id: string, sceneType: { new(): T; }): boolean {

        let result: boolean = false;
        let scene: PIXI.Container | undefined = this.createScene(id, sceneType);
        if (scene) {
            result = this.replaceScene(scene);
            if (!result) { this.destroyScene(scene); }
        }

        return result;
    }

    public destroySceneById(id: string): void {
        let scene: PIXI.Container = this._scenes[id];

        if (!scene) {
            console.warn(`Scene with id:'${id}' not found`);
            return;
        }

        // delete scene from pixi
        this._scenes[id].destroy({ children: true, texture: true, baseTexture: true });

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

    public replaceSceneWithTransition(transition: ITransition): Promise<boolean> {

        this._rootContainer.addChild(transition.nextContainer);

        return transition.start()
            .then(() => {
                if (this._currentScene) { this._rootContainer.removeChild(this._currentScene); }
                this._currentScene = transition.nextContainer;
                transition.restore();
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
