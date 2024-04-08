import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { GameEvents } from "../GameEnums";

export default class CuePlayerController implements AI{
	// We want to be able to control our owner, so keep track of them
	private owner: AnimatedSprite;

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
	private mouseStart: Vec2;
	private mouseEnd: Vec2;
	private assignedVelocity: Vec2 = new Vec2(0,0)

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
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		// Start facing up
		this.direction = new Vec2(0, 1);
		this.speed = 0;
		this.rotationSpeed = 2;

		this.receiver = new Receiver();
		this.emitter = new Emitter();

		this.receiver.subscribe(GameEvents.PLANET_HIT_BLACKHOLE)
		this.receiver.subscribe(GameEvents.PLANET_COLLISION)
		this.receiver.subscribe(GameEvents.FIRE_BALL)
	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		if(event.type === GameEvents.PLANET_HIT_BLACKHOLE){
			this.owner.animation.play("explode", true);
			this.hitBlackHole = true;
		}
	}

	update(deltaT: number): void {
		
		if(this.hitPlanet) return;
		
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

		// We need to handle player input
		// GLEB - Dragging Demo
		if(Input.isMousePressed()){
			console.log("Mouse is Clicked")
			if(!this.mouseDragging)
			{
				this.mouseDragging=true
				this.mouseStart = Input.getMousePressPosition()
				console.log(this.mouseStart)
			}	
		}
		else
		{
			if(this.mouseDragging)
			{
				this.mouseDragging= false	
				this.mouseEnd = Input.getMousePosition()
				console.log(this.mouseEnd)
				this.assignedVelocity = this.mouseStart.add(this.mouseEnd.mult(new Vec2(-1, -1)))
				
			}
		}
		this.owner.move(this.assignedVelocity.scaled(deltaT))
		
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
		if(!this.owner.animation.isPlaying("explode")){
			this.owner.animation.playIfNotAlready("idle");
		}
	}
} 