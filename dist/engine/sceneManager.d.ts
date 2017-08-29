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
    createScene<T extends PIXI.Container>(id: string, sceneType: {
        new (): T;
    }): T | undefined;
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
export declare let sceneManagerInstance: ISceneManager;
