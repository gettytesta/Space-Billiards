import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { GameEvents } from "../GameEnums";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Base_Scene from "./Base_Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private levelSelect: Layer;

	private logo: Sprite;
	private dragDiagram: Sprite;

    loadScene(){
		this.load.image("logo", "hw2_assets/sprites/logo.png")
		this.load.image("drag_diagram", "hw2_assets/sprites/drag_diagram.png")
	}

    unloadScene(): void {
        this.resourceManager.unloadAllResources()
    }

    startScene(){
		this.addLayer("primary", 5);

		this.logo = this.add.sprite("logo", "primary");
		this.logo.position.copy(this.viewport.getCenter());
		this.logo.position.add(new Vec2(0, -200));
		this.logo.scale = new Vec2(.3, .3);

        const center = this.viewport.getCenter();


        /**
         * THE MAIN MENU
         */
        this.mainMenu = this.addUILayer("mainMenu");

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

        // Add level1 button, and give it an event to emit on press
        const level1 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-300, center.y), text: "Level 1"});
        level1.size.set(200, 400);
        level1.borderWidth = 2;
        level1.borderColor = Color.WHITE;
        level1.backgroundColor = Color.TRANSPARENT;
        level1.onClickEventId = GameEvents.LEVEL1;

        // Add level2 button
        const level2 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y), text: "Level 2"});
        level2.size.set(200, 400);
        level2.borderWidth = 2;
        level2.borderColor = Color.WHITE;
        level2.backgroundColor = Color.TRANSPARENT;
        level2.onClickEventId = GameEvents.LEVEL2;

        // Add level3 button
        const level3 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+300, center.y), text: "Level 3"});
        level3.size.set(200, 400);
        level3.borderWidth = 2;
        level3.borderColor = Color.WHITE;
        level3.backgroundColor = Color.TRANSPARENT;
        level3.onClickEventId = GameEvents.LEVEL3;

        // Add menu button
        const menu = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y-300), text: "Main Menu"});
        menu.size.set(200, 50);
        menu.borderWidth = 2;
        menu.borderColor = Color.WHITE;
        menu.backgroundColor = Color.TRANSPARENT;
        menu.onClickEventId = GameEvents.MENU;



        /**
         * THE CONTROL SCREEN
         */
		this.dragDiagram = this.add.sprite("drag_diagram", "primary");
		this.dragDiagram.position.copy(this.viewport.getCenter());
		this.dragDiagram.position.add(new Vec2(-200, 0));
		let dScale = 1.5;
		this.dragDiagram.scale = new Vec2(dScale, dScale);
		this.dragDiagram.visible = false;

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
        this.receiver.subscribe(GameEvents.LEVEL1);
        this.receiver.subscribe(GameEvents.LEVEL2);
        this.receiver.subscribe(GameEvents.LEVEL3);
        this.receiver.subscribe(GameEvents.LEVEL4);
        this.receiver.subscribe(GameEvents.LEVEL5);
        this.receiver.subscribe(GameEvents.LEVEL6);
        this.receiver.subscribe(GameEvents.LEVEL7);
        this.receiver.subscribe(GameEvents.LEVEL8);
        this.receiver.subscribe(GameEvents.LEVEL9);

    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === GameEvents.LEVEL_SELECT){
                this.levelSelect.setHidden(false)
                this.mainMenu.setHidden(true);
                this.logo.visible = false;
            }

            if(event.type === GameEvents.CONTROLS){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
				this.logo.visible = false;
				this.dragDiagram.visible = true;
            }

            if(event.type === GameEvents.ABOUT){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
				this.logo.visible = false;
				this.dragDiagram.visible = false;
            }

            if(event.type === GameEvents.MENU){
                this.mainMenu.setHidden(false);
                this.levelSelect.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
				this.logo.visible = true;
				this.dragDiagram.visible = false;
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
