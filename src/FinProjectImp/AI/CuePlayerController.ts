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


export default class CuePlayerController implements AI {
	// We want to be able to control our owner, so keep track of them
	private owner: AnimatedSprite;

	private directionArrow: Sprite; 

	// TESTA - hitPlanet is for any collision that would make the cue(s) explode
	private hitPlanet: boolean = false;
	private hitBlackHole: boolean = false;

	// A receiver and emitter to hook into the event queue
	private receiver: Receiver;
	private emitter: Emitter;

	// Gleb Changes - we need to have a way of measuring the Vector between the mouse start dragging, and end dragging
	private mouseDragging: boolean = false; 
	private mouseStart: Vec2 =  new Vec2(0,0);
	private mouseEnd: Vec2 =  new Vec2(0,0);
	public assignedVelocity: Vec2 = new Vec2(0,0)
	private trajectorySet: boolean = false; 
	// If the fire button was pressed
	private didFire: boolean = false;

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
		this.owner = options.owner;

		// Set up of directional arrow to show where its aiming
		this.directionArrow = options.arrow
		this.directionArrow.position = this.owner.position
		this.directionArrow.visible = false;

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
			this.hitBlackHole = true;
		}
		if(event.type === GameEvents.FIRE_BALL)
		{
			if (this.trajectorySet) {
				this.didFire = true;
				this.directionArrow.visible = false
			}
		}
		if(event.type === GameEvents.RESET_TRAJECTORY)
		{
			this.trajectorySet = false; 
			this.directionArrow.visible = false;
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

		if (Input.isMousePressed() && !this.didFire) {
			if (!this.mouseDragging) {
				this.mouseDragging = true
				this.mouseStart = Input.getGlobalMousePosition()
			} else {
				this.mouseEnd = Input.getGlobalMousePosition()
				let distX
				let distY
				let angle
				var maxDist = 150
				if (this.mouseStart.x < this.mouseEnd.x) {
					// We're on the right quadrants
					distX = this.mouseEnd.x - this.mouseStart.x
					distX = MathUtils.clamp(distX, 0, maxDist)
	
					if (this.mouseStart.y > this.mouseEnd.y) {
						// Top right quadrant
						distY = this.mouseStart.y - this.mouseEnd.y
						distY = MathUtils.clamp(distY, 0, maxDist)
						angle = Math.atan2(distY, distX)
	
						this.assignedVelocity = new Vec2(distX, -distY)
						// Set mouse position
						this.directionArrow.position = new Vec2(this.owner.position.x+distX, this.owner.position.y-distY)
					} else {
						// Bottom right quadrant
						distY = this.mouseEnd.y - this.mouseStart.y
						distY = MathUtils.clamp(distY, 0, maxDist)
						angle = Math.atan2(distY, distX)
						angle = ((Math.PI/2) - angle) + 3*Math.PI/2
	
						this.assignedVelocity = new Vec2(distX, distY)
						// Set mouse position
						this.directionArrow.position = new Vec2(this.owner.position.x+distX, this.owner.position.y+distY)
					}
				} else {
					// We're on the left quadrants
					distX = this.mouseStart.x - this.mouseEnd.x
					distX = MathUtils.clamp(distX, 0, maxDist)
	
					if (this.mouseStart.y > this.mouseEnd.y) {
						// Top left quadrant
						distY = this.mouseStart.y - this.mouseEnd.y
						distY = MathUtils.clamp(distY, 0, maxDist)
						angle = Math.atan2(distY, distX)

						angle = ((Math.PI/2) - angle) + Math.PI/2
	
						this.assignedVelocity = new Vec2(-distX, -distY)
						// Set mouse position
						this.directionArrow.position = new Vec2(this.owner.position.x-distX, this.owner.position.y-distY)
					} else {
						// Bottom left quadrant
						distY = this.mouseEnd.y - this.mouseStart.y
						distY = MathUtils.clamp(distY, 0, maxDist)
						angle = Math.atan2(distY, distX)

						angle += Math.PI
	
						this.assignedVelocity = new Vec2(-distX, distY)
						// Set mouse position
						this.directionArrow.position = new Vec2(this.owner.position.x-distX, this.owner.position.y+distY)
					}
				}
				this.directionArrow.rotation = angle - Math.PI/2;
				if (distX > 50 || distY > 50) {
					this.trajectorySet = true;
				}
				this.assignedVelocity.scale(1.6);
			}
		} else if (this.mouseDragging) {
			this.mouseDragging = false
			this.directionArrow.visible = true
		}
		if (this.didFire) {
			this.directionArrow.visible = false;
			this.owner.position.add(this.assignedVelocity.scaled(deltaT))
			this.owner.collisionShape.center = this.owner.position
		}
		Debug.log("player_pos", "Player Position: " + this.owner.position.toString());

		// Animations
		if(!this.owner.animation.isPlaying("explode")){
			this.owner.animation.playIfNotAlready("idle");
		}
	}
} 