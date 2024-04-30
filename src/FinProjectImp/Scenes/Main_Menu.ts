import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { GameEvents } from "../GameEnums";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Base_Scene from "./Base_Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement"
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private levelSelect: Layer;

	private logo: AnimatedSprite;
	private dragDiagram: Sprite;

    private hardmodeOpt: UIElement;
    public static hardmodeSelected = false;

    public initScene(init: Record<string, any>): void {

	}

    public loadScene(){
        //this.load.spritesheet("logo_text", "hw2_assets/spritesheets/logo_text.json")
		//this.load.image("logo", "hw2_assets/sprites/logo.png")
		//this.load.image("drag_diagram", "hw2_assets/sprites/drag_diagram.png")
	}

    public unloadScene(): void {
        this.resourceManager.unloadAllResources()
    }

    startScene(){
		this.addLayer("primary", 5);

		// this.logo = this.add.animatedSprite("logo_text", "primary");
        // this.logo.position = new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y - 100)
		// this.logo.scale = new Vec2(5, 5);
        // this.logo.animation.play("idle")

        const center = this.viewport.getCenter();


        /**
         * THE MAIN MENU
         */
        this.mainMenu = this.addUILayer("mainMenu");

        const name = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 150), text: "Space Billiards"});
        name.fontSize = 100;
        name.textColor = Color.WHITE;

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: "Level Select"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = GameEvents.LEVEL_SELECT;


		// Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 150), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = GameEvents.CONTROLS;

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = GameEvents.ABOUT;



        /**
         * THE LEVEL SELECT MENU
         */
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setHidden(true)

        // Add level1 button
        const level1 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-300, center.y-150), text: "Level 1"});
        level1.size.set(200, 100);
        level1.borderWidth = 2;
        level1.borderColor = Color.WHITE;
        level1.backgroundColor = Color.BLACK;
        level1.onClickEventId = GameEvents.LEVEL1;

        const level2 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y-150), text: "Level 2"});
        level2.size.set(200, 100);
        level2.borderWidth = 2;
        level2.borderColor = Color.WHITE;
        level2.backgroundColor = Color.BLACK;
        level2.onClickEventId = GameEvents.LEVEL2;

        const level3 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+300, center.y-150), text: "Level 3"});
        level3.size.set(200, 100);
        level3.borderWidth = 2;
        level3.borderColor = Color.WHITE;
        level3.backgroundColor = Color.BLACK;
        level3.onClickEventId = GameEvents.LEVEL3;

        const level4 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-300, center.y), text: "Level 4"});
        level4.size.set(200, 100);
        level4.borderWidth = 2;
        level4.borderColor = Color.WHITE;
        level4.backgroundColor = Color.BLACK;
        level4.onClickEventId = GameEvents.LEVEL4;

        const level5 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y), text: "Level 5"});
        level5.size.set(200, 100);
        level5.borderWidth = 2;
        level5.borderColor = Color.WHITE;
        level5.backgroundColor = Color.BLACK;
        level5.onClickEventId = GameEvents.LEVEL5;

        const level6 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+300, center.y), text: "Level 6"});
        level6.size.set(200, 100);
        level6.borderWidth = 2;
        level6.borderColor = Color.WHITE;
        level6.backgroundColor = Color.BLACK;
        level6.onClickEventId = GameEvents.LEVEL6;

        const level7 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-300, center.y+150), text: "Level 7"});
        level7.size.set(200, 100);
        level7.borderWidth = 2;
        level7.borderColor = Color.WHITE;
        level7.backgroundColor = Color.BLACK;
        level7.onClickEventId = GameEvents.LEVEL7;

        const level8 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y+150), text: "Level 8"});
        level8.size.set(200, 100);
        level8.borderWidth = 2;
        level8.borderColor = Color.WHITE;
        level8.backgroundColor = Color.BLACK;
        level8.onClickEventId = GameEvents.LEVEL8;

        const level9 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+300, center.y+150), text: "Level 9"});
        level9.size.set(200, 100);
        level9.borderWidth = 2;
        level9.borderColor = Color.WHITE;
        level9.backgroundColor = Color.BLACK;
        level9.onClickEventId = GameEvents.LEVEL9;

        // Add menu button
        const menu = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-180, center.y-300), text: "Main Menu"});
        menu.size.set(200, 50);
        menu.borderWidth = 2;
        menu.borderColor = Color.WHITE;
        menu.backgroundColor = Color.BLACK;
        menu.onClickEventId = GameEvents.MENU;

        // Add tutorial button
        const tutorial = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+180, center.y-300), text: "Tutorial"});
        tutorial.size.set(200, 50);
        tutorial.borderWidth = 2;
        tutorial.borderColor = Color.WHITE;
        tutorial.backgroundColor = Color.BLACK;
        tutorial.onClickEventId = GameEvents.TUTORIAL;

        // Add hard mode option
        this.hardmodeOpt = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y+300), text: "Hard Mode"});
        this.hardmodeOpt.size.set(180, 50);
        this.hardmodeOpt.borderWidth = 2;
        this.hardmodeOpt.borderColor = Color.WHITE;
        this.hardmodeOpt.backgroundColor = Color.BLACK;
        this.hardmodeOpt.onClickEventId = GameEvents.HARDMODE;


        /**
         * THE CONTROL SCREEN
         */
		// this.dragDiagram = this.add.sprite("drag_diagram", "primary");
		// this.dragDiagram.position.copy(this.viewport.getCenter());
		// this.dragDiagram.position.add(new Vec2(-200, 0));
		// let dScale = 1.5;
		// this.dragDiagram.scale = new Vec2(dScale, dScale);
		// this.dragDiagram.visible = false;

        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x + 200, center.y - 100), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y), text: "Hold Left Click and Drag to Aim"});
        ws.textColor = Color.WHITE;
        const ad = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x+200, center.y + 50), text: "Click the 'Fire!' button to fire"});
        ad.textColor = Color.WHITE;
        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x + 200, center.y + 200), text: "Back"});

        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = GameEvents.MENU;



        /**
         * THE ABOUT SCREEN
         */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 150), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        const text1 = "This game was created by Getty Lee Testa, Gleb Koslov, and Aidan Foley";
        const text2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const text3 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 100), text: text3});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = GameEvents.MENU;



        // Subscribe to the button events
        this.receiver.subscribe(GameEvents.LEVEL_SELECT);
        this.receiver.subscribe(GameEvents.CONTROLS);
        this.receiver.subscribe(GameEvents.ABOUT);
        this.receiver.subscribe(GameEvents.MENU);
        this.receiver.subscribe(GameEvents.TUTORIAL);
        this.receiver.subscribe(GameEvents.LEVEL1);
        this.receiver.subscribe(GameEvents.LEVEL2);
        this.receiver.subscribe(GameEvents.LEVEL3);
        this.receiver.subscribe(GameEvents.LEVEL4);
        this.receiver.subscribe(GameEvents.LEVEL5);
        this.receiver.subscribe(GameEvents.LEVEL6);
        this.receiver.subscribe(GameEvents.LEVEL7);
        this.receiver.subscribe(GameEvents.LEVEL8);
        this.receiver.subscribe(GameEvents.LEVEL9);
        this.receiver.subscribe(GameEvents.HARDMODE)
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === GameEvents.LEVEL_SELECT){
                this.levelSelect.setHidden(false)
                this.mainMenu.setHidden(true);
                // this.logo.visible = false;
            }

            if(event.type === GameEvents.CONTROLS){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
				// this.logo.visible = false;
				// this.dragDiagram.visible = true;
            }

            if(event.type === GameEvents.ABOUT){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
				// this.logo.visible = false;
				// this.dragDiagram.visible = false;
            }

            if(event.type === GameEvents.MENU){
                this.mainMenu.setHidden(false);
                this.levelSelect.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
				// this.logo.visible = true;
				// this.dragDiagram.visible = false;
            }

            if (event.type === GameEvents.TUTORIAL) {
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 0});
            }

            if (event.type === GameEvents.HARDMODE) {
                if (MainMenu.hardmodeSelected) {
                    this.hardmodeOpt.backgroundColor = Color.BLACK
                    MainMenu.hardmodeSelected = false
                } else {
                    this.hardmodeOpt.backgroundColor = Color.RED
                    MainMenu.hardmodeSelected = true
                }
            }

            if (event.type === GameEvents.LEVEL1){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 1});
            } else if(event.type === GameEvents.LEVEL2){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 2});
            } else if(event.type === GameEvents.LEVEL3){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 3});
            } else if(event.type === GameEvents.LEVEL4){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 4});
            } else if(event.type === GameEvents.LEVEL5){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 5});
            } else if(event.type === GameEvents.LEVEL6){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 6});
            } else if(event.type === GameEvents.LEVEL7){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 7});
            } else if(event.type === GameEvents.LEVEL8){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 8});
            } else if(event.type === GameEvents.LEVEL9){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 9});
            }
        }
    }
}
