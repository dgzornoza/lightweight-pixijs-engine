import { IKeyValueMap } from "./../../../../dist/engine/interfaces";
import { EnumDirections, ContainerTransitionSlide, ContainerTransitionFadeIn, ContainerTransitionFadeOut }
    from "./../../../../dist/engine/containerTransitions";
import { pixiEngineInstance } from "../../../../dist/engine/pixiEngine";

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
 * Main scene class, for samples. Must have the name of the file to lazy load from configuration.
 */
export class SpriteTransitionsSample extends PIXI.Container {

    protected _loadingText: PIXI.Text;
    protected _intervalHandler: number;
    protected _transition: PIXI.EngineExtensions.IContainerTransition;

    protected _currentSprite: PIXI.Sprite;
    protected _nextSprite: PIXI.Sprite;

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

    /** override for reset sample */
    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        window.clearInterval(this._intervalHandler);
        if (this._transition) { this._transition.stop(); }
        gTransitionIndex = 0;
        gImageIndex = 0;
        gSlideCurrentDirectionIndex = 0;
    }

    private _init(): void {

        // create sample sprites
        this.addChild(this._setNextSpriteTexture(this._currentSprite = new PIXI.Sprite()));
        this.addChild(this._setNextSpriteTexture(this._nextSprite = new PIXI.Sprite()));
        // next sprite is invisible
        this._nextSprite.visible = false;

        // create main menu button
        this._createMainMenuButton();

        // schedule auto change sprites
        this._scheduleChangeSprites();
    }

    private _scheduleChangeSprites(): void {

        this._intervalHandler = window.setInterval(() => {

            // change sprites with transition

            switch (gTransitionIndex) {
                case 0:
                    this._transition = new ContainerTransitionSlide(this._currentSprite, this._nextSprite, SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                case 1:
                    this._transition = new ContainerTransitionFadeIn(this._currentSprite, this._nextSprite, SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                case 2:
                    this._transition = new ContainerTransitionFadeOut(this._currentSprite, this._nextSprite, SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
                    break;
                default:
                    this._transition = new ContainerTransitionSlide(this._currentSprite, this._nextSprite, SLIDE_DIRECTIONS[gSlideCurrentDirectionIndex]);
            }

            // visible next sprite for start transition
            this._nextSprite.visible = true;

            this._transition.start()
                .then(() => {
                    // change next image and hide sprite
                    this._currentSprite.visible = false;
                    this._setNextSpriteTexture(this._currentSprite);
                    // call restore for set initial sprites states
                    this._transition.restore();
                    // swap sprites for change z-index order and set visibility next sprite (previous current)
                    this._swapSprites();
                });

            gSlideCurrentDirectionIndex = gSlideCurrentDirectionIndex < SLIDE_DIRECTIONS.length - 1 ? gSlideCurrentDirectionIndex + 1 : 0;
            if (gSlideCurrentDirectionIndex === 0) { gTransitionIndex = gTransitionIndex < 3 ? gTransitionIndex + 1 : 0; }

        }, 3000);
    }

    private _setNextSpriteTexture(sprite: PIXI.Sprite): PIXI.Sprite {
        // set new texture
        gImageIndex = gImageIndex === 14 ? 1 : gImageIndex + 1;
        let resource: IKeyValueMap<string, string> = RESOURCE_PATHS.find((value: IKeyValueMap<string, string>) => {
            return value.key === `BG_SCENE_${gImageIndex}`; }) as IKeyValueMap<string, string>;
        sprite.texture = PIXI.loader.resources[resource.value].texture;
        return sprite;
    }

    private _swapSprites(): void {
        this.swapChildren(this._currentSprite, this._nextSprite);
        let tempSprite: PIXI.Sprite = this._currentSprite;
        this._currentSprite = this._nextSprite;
        this._nextSprite = tempSprite;
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
                let scene: PIXI.Container = pixiEngineInstance.sceneManager.getScene("app/samples/mainSamples") as PIXI.Container;
                pixiEngineInstance.sceneManager.replaceScene(scene);
            });

        this.addChild(btn);
    }
}



