import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { GameEvents } from "../GameEnums";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Base_Scene from "./Base_Scene";
import Level_Select from "./Level_Select";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;

    loadScene(){}

    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Level Select"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = GameEvents.LEVEL_SELECT;

        // Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = GameEvents.CONTROLS;

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = GameEvents.ABOUT;



        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 50), text: "Hold Left Click and Drag to Aim"});
        ws.textColor = Color.WHITE;
        const ad = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: "Click the 'Fire!' button to fire"});
        ad.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = GameEvents.MENU;



        // About screen
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        const text1 = "This game was by <YOUR NAME HERE>, Joe Weaver, and Richard McKenna";
        const text2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const text3 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text3});

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
        this.receiver.subscribe(GameEvents.MENU)
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === GameEvents.LEVEL_SELECT){
                this.sceneManager.changeScene(Level_Select, {});
            }

            if(event.type === GameEvents.CONTROLS){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === GameEvents.ABOUT){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === GameEvents.MENU){
                this.mainMenu.setHidden(false);
                this.controls.setHidden(true);
                this.about.setHidden(true);
            }
        }
    }
}