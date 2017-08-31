import { IKeyValueMap } from "./../../../dist/engine/interfaces.d";
import { pixiEngineInstance } from "../../../dist/engine/pixiEngine";

/**
 * main class for execute all samples
 */
export class MainSamples extends PIXI.Container {

    private readonly _samples: IKeyValueMap<string, string>[] = [
        { key: "Scene Transitions", value: "app/samples/sceneTransitionsSample" },
        { key: "Container Transitions", value: "app/samples/spriteTransitionsSample" }
    ];

    private _currentSample: PIXI.Container | undefined;
    private _menuContainer: PIXI.Container;

    constructor() {
        super();

        this._currentSample = undefined;

        this._menuContainer = new PIXI.Container();
        this.addChild(this._menuContainer);

        this._createMenu();

        // on added scene
        this.on("added", (_displayObject: PIXI.DisplayObject) => {
            // release scenes and resources, this allows indefinite samples
            if (this._currentSample) { pixiEngineInstance.sceneManager.destroyScene(this._currentSample); }
            Object.keys(PIXI.utils.TextureCache).forEach((texture: string) => {
                PIXI.utils.TextureCache[texture].destroy(true);
            });
            PIXI.loader.reset();
        });

    }


    private _createMenu(): void {

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

        let centerX: number = pixiEngineInstance.renderer.width / 2;

        for (let index: number = 0; index < this._samples.length; index++) {
            let menuItem: PIXI.Text = new PIXI.Text(this._samples[index].key, style);
            menuItem.anchor.x = 0.5;
            menuItem.x = centerX;
            menuItem.y = (index + 1) * 150;

            // make the text interactive
            menuItem.interactive = true;
            menuItem.buttonMode = true;
            // events
            menuItem
                .on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {  this._onMenuItemDown(event); })
                .on("pointerup", (event: PIXI.interaction.InteractionEvent) => {  this._onMenuItemUp(event); })
                .on("pointerupoutside", (event: PIXI.interaction.InteractionEvent) => {  this._onMenuItemUp(event); })
                .on("pointerover", (event: PIXI.interaction.InteractionEvent) => {  this._onMenuItemOver(event); })
                .on("pointerout", (event: PIXI.interaction.InteractionEvent) => {  this._onMenuItemOut(event); });

            this._menuContainer.addChild(menuItem);
        }
    }

    private _onMenuItemDown(_event: PIXI.interaction.InteractionEvent): void {

        let sample: IKeyValueMap<string, string> = this._samples.find((value: IKeyValueMap<string, string>) => {
            return value.key === (_event.currentTarget as PIXI.Text).text;
        }) as IKeyValueMap<string, string>;

        // load new scene and replace
        pixiEngineInstance.sceneManager.loadAndCreateScene(sample.value).then((scene: PIXI.Container) => {
            this._currentSample = scene;
            pixiEngineInstance.sceneManager.replaceScene(this._currentSample);
        });
    }


    private _onMenuItemUp(_event: PIXI.interaction.InteractionEvent): void {
        // ...
    }

    private _onMenuItemOver(_event: PIXI.interaction.InteractionEvent): void {
        _event.currentTarget.scale.set(1.5, 1.2);
    }

    private _onMenuItemOut(_event: PIXI.interaction.InteractionEvent): void {
        _event.currentTarget.scale.set(1, 1);
    }


}


