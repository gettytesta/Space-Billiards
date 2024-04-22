import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";

export default class PlanetAI implements AI {
    
    //Owner of this Planet
    protected owner: Graphic;

    //Potential direction that it will travel
    public direction: Vec2;

    //Potential power with with the planet pulls
    public gravityScale: Number;

    //Effect Radius
    public gravityRadius: Number; 

    //planet Movement Speed
    public planetSpeed: number;

    public paused: boolean = false;

    

    initializeAI(owner: Graphic,  options: Record<string, any>): void {
        this.owner = owner; 
        this.gravityScale = options.gravityScale;
        this.gravityRadius = options.gravityRadius;
        this.planetSpeed = options.planetSpeed;

    }

    activate(options: Record<string, any>): void {
        this.direction = options.direction;
    }

    handleEvent(event: GameEvent): void {
        //Do nothing, most of the time there isn't an event that's relevant
    }

    update(deltaT: number): void {
        if(this.owner.visible && !this.paused)
            this.owner.position.add(this.direction.scaled(this.planetSpeed * deltaT));
    }

    destroy(): void {
		
	}
}