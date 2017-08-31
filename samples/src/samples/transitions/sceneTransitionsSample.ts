import { IKeyValueMap } from "./../../../../engine/src/interfaces.d";
import { EnumDirections, ContainerTransitionSlide, ContainerTransitionFadeIn, ContainerTransitionFadeOut } from "./../../../../engine/src/containerTransitions";
import { pixiEngineInstance } from "../../../../engine/src/pixiEngine";

const RESOURCE_PATHS: IKeyValueMap<string, string>[] = [
    { key: "BG_SCENE_1", value: "content/img/samples/sceneTransitions/bg-scene-1.jpg" },
    { key: "BG_SCENE_2", value: "content/img/samples/sceneTransitions/bg-scene-2.jpg" },
    { key: "BG_SCENE_3", value: "content/img/samples/sceneTransitions/bg-scene-3.jpg" },
    { key: "BG_SCENE_4", value: "content/img/samples/sceneTransitions/bg-scene-4.jpg" },
    { key: "BG_SCENE_5", value: "content/img/samples/sceneTransitions/bg-scene-5.jpg" },
    { key: "BG_SCENE_6", value: "content/img/samples/sceneTransitions/bg-scene-6.jpg" },
    { key: "BG_SCENE_7", value: "content/img/samples/sceneTransitions/bg-scene-7.jpg" },
    { key: "BG_SCENE_8", value: "content/img/samples/sceneTransitions/bg-scene-8.jpg" },
    { key: "BG_SCENE_9", value: "content/img/samples/sceneTransitions/bg-scene-9.jpg" },
    { key: "BG_SCENE_10", value: "content/img/samples/sceneTransitions/bg-scene-10.jpg" },
    { key: "BG_SCENE_11", value: "content/img/samples/sceneTransitions/bg-scene-11.jpg" },
    { key: "BG_SCENE_12", value: "content/img/samples/sceneTransitions/bg-scene-12.jpg" },
    { key: "BG_SCENE_13", value: "content/img/samples/sceneTransitions/bg-scene-13.jpg" },
    { key: "BG_SCENE_14", value: "content/img/samples/sceneTransitions/bg-scene-14.jpg" }
];

const SLIDE_DIRECTIONS: EnumDirections[] = [
    EnumDirections.UP,
    EnumDirections.DOWN,
    EnumDirections.LEFT,
    EnumDirections.RIGHT,
    EnumDirections.UP + EnumDirections.LEFT,
    EnumDirections.DOWN + EnumDirections.LEFT,
    EnumDirections.DOWN + EnumDirections.RIGHT,
    EnumDirections.UP + EnumDirections.RIGHT
];

let gTransitionIndex: number = 0;
let gImageIndex: number = 0;
let gSlideCurrentDirectionIndex: EnumDirections = 0;

/**
 * Main class, for samples. Must have the name of the file to lazy load from configuration.
 */
export class SceneTransitionsSample extends PIXI.Container {

    protected _loadingText: PIXI.Text;

    constructor() {
        super();

        this._loadingText = new PIXI.Text("Loading...", { fontSize: 72 });
        this._loadingText.anchor.x = 0.5;
        this._loadingText.x = pixiEngineInstance.renderer.width / 2;

        // load all resources and initialize scene
        PIXI.loader
            .add(RESOURCE_PATHS.map((value: IKeyValueMap<string, string>) => { return value.value; }))
            .load(() => this._init());

    }

    /** override for destroy all sample scenes and reset sample */
    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);

        pixiEngineInstance.sceneManager.destroySceneById("SceneOne");
        pixiEngineInstance.sceneManager.destroySceneById("SceneTwo");

        gTransitionIndex = 0;
        gImageIndex = 0;
        gSlideCurrentDirectionIndex = 0;
    }

    private _init(): void {
        // start transitions scenes sapmle
        let scene: PIXI.Container = pixiEngineInstance.sceneManager.createScene("SceneOne", SceneOne) as PIXI.Container;
        pixiEngineInstance.sceneManager.replaceScene(scene);
    }
}

/**
 * Base class for implement transitions scene sample
 */
abstract class SceneTransitionSampleBase extends PIXI.Container {

    protected _background: PIXI.Sprite;
    protected _timeoutHandler: number;
    protected _transition: PIXI.EngineExtensions.IContainerTransition;

    constructor() {
        super();

        // create background sprite
        this.name = (this.constructor as any).name;
        this._background = new PIXI.Sprite();
        this.addChild(this._background);
        // create main menu button
        this._createMainMenuButton();

        // on added scene
        this.on("added", () => {
            // set new texture
            gImageIndex = gImageIndex === 14 ? 1 : gImageIndex + 1;
            let resource: IKeyValueMap<string, string> = RESOURCE_PATHS.find((value: IKeyValueMap<string, string>) => {
                return value.key === `BG_SCENE_${gImageIndex}`; }) as IKeyValueMap<string, string>;
            this._background.texture = PIXI.loader.resources[resource.value].texture;

            // schedule auto change scene
            this._scheduleChangeScene();
        });
    }

    /**
     * Override in childrens for get next transition scene
     */
    protected abstract _getNextScene(): PIXI.Container | undefined;

    private _scheduleChangeScene(): void {

        this._timeoutHandler = window.setTimeout(() => {
            let scene: PIXI.Container | undefined = this._getNextScene();
            if (undefined === scene) { throw `${this.name}: nextScene can't create`; }

            // replace scene with transition
            switch (gTransitionIndex) {
                case 0:
                    this._transition = new ContainerTransitionSlide(pixiEngineInstance.sceneManager.currentScene, scene,
                    SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                case 1:
                    this._transition = new ContainerTransitionFadeIn(pixiEngineInstance.sceneManager.currentScene, scene,
                    SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                case 2:
                    this._transition = new ContainerTransitionFadeOut(pixiEngineInstance.sceneManager.currentScene, scene,
                        SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                default:
                    this._transition = new ContainerTransitionSlide(pixiEngineInstance.sceneManager.currentScene, scene,
                    SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
            }

            pixiEngineInstance.sceneManager.replaceSceneWithTransition(this._transition);

            gSlideCurrentDirectionIndex = gSlideCurrentDirectionIndex < SLIDE_DIRECTIONS.length - 1 ? gSlideCurrentDirectionIndex + 1 : 0;
            if (gSlideCurrentDirectionIndex === 0) { gTransitionIndex = gTransitionIndex < 3 ? gTransitionIndex + 1 : 0; }

        }, 3000);
    }

    private _createMainMenuButton(): void {

        let style: PIXI.TextStyle = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 4,
            dropShadowColor: "#000000",
            dropShadowDistance: 6,
            fill: ["#ffffff", "#00ff99"],
            fontFamily: "Bree Serif, serif",
            fontSize: 72,
            fontStyle: "italic",
            fontWeight: "bold",
            stroke: "#4a1850",
            strokeThickness: 5
        });


        let btn: PIXI.Text = new PIXI.Text("Main menu", style);
        btn.x = 20;
        btn.y = 20;

        // make the text interactive
        btn.interactive = true;
        btn.buttonMode = true;

        // event for go main menu
        btn
            .on("pointerdown", (_event: PIXI.interaction.InteractionEvent) => {
                window.clearTimeout(this._timeoutHandler);
                let scene: PIXI.Container = pixiEngineInstance.sceneManager.getScene("app/samples/mainSamples") as PIXI.Container;
                pixiEngineInstance.sceneManager.replaceScene(scene);
            });

        this.addChild(btn);
    }
}



class SceneOne extends SceneTransitionSampleBase {

    constructor() {
        super();
    }

    protected _getNextScene(): PIXI.Container | undefined {
        return pixiEngineInstance.sceneManager.getScene("SceneTwo") || pixiEngineInstance.sceneManager.createScene("SceneTwo", SceneTwo);
    }
}

class SceneTwo extends SceneTransitionSampleBase {

    constructor() {
        super();
    }

    protected _getNextScene(): PIXI.Container | undefined {
        return pixiEngineInstance.sceneManager.getScene("SceneOne") || pixiEngineInstance.sceneManager.createScene("SceneOne", SceneOne);
    }
}

