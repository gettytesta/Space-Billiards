import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class ClearStage extends Scene {
    initScene(options: Record<string, any>){
    }

    startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const clearStage = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Stage Cleared!"});
        clearStage.textColor = Color.WHITE;

        const text = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 200), text: "Click to return to main menu"});
        text.textColor = Color.WHITE;
    }

    updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeScene(MainMenu);
        }
    }
}