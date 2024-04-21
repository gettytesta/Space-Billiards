import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { GameEvents } from "../GameEnums";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Base_Scene from "./Base_Scene";
import MainMenu from "./Main_Menu";

export default class Level_Select extends Scene {
    // Layers, for multiple main menu screens
    private levelSelect: Layer;

    startScene() {
        const center = this.viewport.getCenter();

        // The main menu
        this.levelSelect = this.addUILayer("levelSelect");

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


        // Subscribe to the button events
        this.receiver.subscribe(GameEvents.LEVEL1);
        this.receiver.subscribe(GameEvents.LEVEL2);
        this.receiver.subscribe(GameEvents.LEVEL3);
        this.receiver.subscribe(GameEvents.MENU)
    }

    unloadScene(): void {
        this.resourceManager.unloadAllResources()
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === GameEvents.MENU){
                this.sceneManager.changeToScene(MainMenu, {});
            } else if(event.type === GameEvents.LEVEL1){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 1});
            } else if(event.type === GameEvents.LEVEL2){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 2});
            } else if(event.type === GameEvents.LEVEL3){
                this.sceneManager.changeToScene(Base_Scene, {levelNum: 3});
            }
        }
    }
}