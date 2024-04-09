import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import Game from "../../Wolfie2D/Loop/Game";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { GameEvents } from "../GameEnums";


export default class CuePlayerController implements AI{
	// We want to be able to control our owner, so keep track of them
	private owner: Graphic;

	private directionArrow: Sprite; 

	// The direction the spaceship is moving
	private direction: Vec2;
	private MIN_SPEED: number = 0;
	private MAX_SPEED: number = 300;
	private speed: number;
	private ACCELERATION: number = 4;
	private rotationSpeed: number;

	// TESTA - hitPlanet is for any collision that would make the cue(s) explode
	private hitPlanet: boolean = false;
	private hitBlackHole: boolean = false;

	// A receiver and emitter to hook into the event queue
	private receiver: Receiver;
	private emitter: Emitter;

	//Gleb Changes - we need to have a way of measuring the Vector between the mouse start dragging, and end dragging
	private mouseDragging: boolean = false; 
	private mouseStart: Vec2 =  new Vec2(0,0);
	private mouseEnd: Vec2 =  new Vec2(0,0);
	public assignedVelocity: Vec2 = new Vec2(0,0)
	private trajectorySet: boolean = false; 

	// HOMEWORK 2 - TODO
	/**
	 * This method initializes all variables inside of this AI class, and sets
	 * up anything we need it do.
	 * 
	 * You should subscribe to the correct event for player damage here using the Receiver.
	 * The AI will react to the event in handleEvent() - you just need to make sure
	 * it is subscribed to them.
	 * 
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	initializeAI(owner: Graphic, options: Record<string, any>): void {
		this.owner = owner;

		//Set up of directional arrow to show where its aiming
		this.directionArrow = options.arrow
		this.directionArrow.position = this.owner.position
		this.directionArrow.rotation = -Math.PI/2
		this.directionArrow.visible = false;
		// Start facing up
		this.direction = new Vec2(0, 1);
		this.speed = 3;
		this.rotationSpeed = 2;

		this.receiver = new Receiver();
		this.emitter = new Emitter();

		this.receiver.subscribe(GameEvents.PLANET_HIT_BLACKHOLE)
		this.receiver.subscribe(GameEvents.PLANET_COLLISION)
		this.receiver.subscribe(GameEvents.FIRE_BALL)
		this.receiver.subscribe(GameEvents.RESET_TRAJECTORY)
		this.receiver.subscribe(GameEvents.PLAY_GAME)
	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		if(event.type === GameEvents.PLANET_HIT_BLACKHOLE){
			//this.owner.animation.play("explode", true);
			this.hitBlackHole = true;
		}
		if(event.type === GameEvents.FIRE_BALL)
		{
			this.assignedVelocity = this.mouseStart.add(this.mouseEnd.mult(new Vec2(-1, -1)))
			this.trajectorySet = true;
		}
		if(event.type === GameEvents.RESET_TRAJECTORY)
		{
			this.trajectorySet = false; 
			this.mouseDragging = false;
		}
		if(event.type === GameEvents.PLAY_GAME){

			this.mouseDragging = false; 
			this.trajectorySet = false;
		}
	}

	update(deltaT: number): void {
		
		if(this.hitPlanet) return;
		
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

		// We need to handle player input
		// GLEB - Dragging Demo
		
		if(Input.isMousePressed() && !this.trajectorySet){
			//console.log("Mouse is Clicked")
			if(!this.mouseDragging)
			{
				this.mouseDragging=true
				this.mouseStart = Input.getGlobalMousePosition()
				console.log(this.mouseStart)
				
			}	
			else{
				/*
				this.directionArrow.visible = true;
				let tempdirection = Input.getMousePosition()

				this.directionArrow.rotation = tempdirection.angleToCCW(Vec2.UP)
				console.log(tempdirection.angleToCCW(Vec2.UP) * (180/Math.PI))
				*/
				//this.directionArrow.visible = true;
				//this.mouseDragging = true; 
				this.mouseDragging = true; 
				this.directionArrow.visible = true;
				let tempdirection = Input.getGlobalMousePosition()
				//console.log(tempdirection)
				
				if(tempdirection.x >= this.mouseStart.x)
				{

					let tempVector = tempdirection.sub(this.mouseStart)
					if(tempVector.x == 0)
						this.directionArrow.rotation =  tempVector.y > 0  ? 0 : Math.PI;
					this.directionArrow.rotation = Math.atan((tempVector.y*-1)/tempVector.x) + Math.PI/2
				}
				else
				{	

					let tempVector = tempdirection.sub(this.mouseStart)
					if(tempVector.x == 0)
						this.directionArrow.rotation =  tempVector.y > 0  ? 0 : Math.PI;
					this.directionArrow.rotation = Math.atan((tempVector.y*-1)/tempVector.x) - Math.PI/2

					console.log("This is the temporary direction" + tempdirection)
					console.log("This is the start position" + this.mouseStart)
					console.log("X IS LESS THAN X")	
					/*let tempVector = tempdirection.sub(this.mouseStart)
					if(tempVector.x == 0)
						this.directionArrow.rotation =  tempVector.y > 0  ? 0 : Math.PI;
					this.directionArrow.rotation = Math.atan((tempVector.y*-1)/(tempVector.x*-1)) - Math.PI/2*/
					//let tempVector = tempdirection.sub(this.mouseStart)			
					//this.directionArrow.rotation = Math.atan((tempVector.y*-1)/(tempVector.x * -1)) - Math.PI/2

					//let tempVector = tempdirection.sub(this.mouseStart)
					//this.directionArrow.rotation = Math.atan(tempVector.y/(-1*tempVector.x)) + Math.PI/2
					
				}
				//let normalized = Input.getMousePosition().sub(this.mouseStart)
				//console.log(Math.atan(-1))
				//console.log(Math.PI/4)
				//this.directionArrow.rotation = Math.atan()
				
			}
		}
		else
		{
			if(this.mouseDragging)
			{

				this.mouseDragging= false	
				this.mouseEnd = Input.getGlobalMousePosition()
				console.log(this.mouseEnd)
				this.emitter.fireEvent(GameEvents.TRAJECTORY_SET)
				this.trajectorySet = true;
				
				//let normalized = Input.getMousePosition().sub(this.mouseStart)
				//this.directionArrow.rotation = Math.atan(normalized.y/normalized.x) - Math.PI/2
				
				//this.assignedVelocity = this.mouseStart.add(this.mouseEnd.mult(new Vec2(-1, -1)))
				
			}
		}
		if((this.mouseStart.x == 0 && this.mouseStart.y == 0 ) || (this.mouseStart.x - this.mouseEnd.x > -5 && this.mouseStart.x - this.mouseEnd.x <  5 && this.mouseStart.y - this.mouseEnd.y > -5 && this.mouseStart.x - this.mouseEnd.x < 5 ) )
			{
				this.mouseDragging = false;
				this.directionArrow.visible = false;
				this.trajectorySet = false; 
			}
		this.owner.move(this.assignedVelocity.scaled(deltaT * this.speed))
		
		let forwardAxis = (Input.isPressed('forward') ? 1 : 0) + (Input.isPressed('backward') ? -1 : 0);
		let turnDirection = (Input.isPressed('turn_ccw') ? -1 : 0) + (Input.isPressed('turn_cw') ? 1 : 0);

		// Space controls - speed stays the same if nothing happens
		// Forward to speed up, backward to slow down
		this.speed += this.ACCELERATION * forwardAxis;
		this.speed = MathUtils.clamp(this.speed, this.MIN_SPEED, this.MAX_SPEED);

		// Rotate the player
		this.direction.rotateCCW(turnDirection * this.rotationSpeed * deltaT);

		// Update the visual direction of the player
		this.owner.rotation = -(Math.atan2(this.direction.y, this.direction.x) - Math.PI/2);
		
		// Move the player
		//this.owner.position.add(this.direction.scaled(-this.speed * deltaT));

		Debug.log("player_pos", "Player Position: " + this.owner.position.toString());

		// Animations
		/*if(!this.owner.animation.isPlaying("explode")){
			this.owner.animation.playIfNotAlready("idle");
		}*/
	}
} 
