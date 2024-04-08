import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import AsteroidAI from "../AI/AsteroidAI";
import { Homework2Event } from "../HW2_Enums";
import SpaceshipPlayerController from "../AI/SpaceshipPlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import GameOver from "./GameOver";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";


/**
 * In Wolfie2D, custom scenes extend the original scene class.
 * This gives us access to lifecycle methods to control our game.
 */
export default class Debug_Scene extends Scene {
	// Here we define member variables of our game, and object pools for adding in game objects
	
	private player: AnimatedSprite;
	private playerDead: boolean = false;
	private playerShield: number = 5;
	private playerinvincible: boolean = false;
	private numAsteroidsDestroyed: number = 0;

	// TESTA - All asteroids will need to be declared globally. I think I can fix this later by putting this in the AsteroidAI class. Will do another time.
	// Create an asteroid
	private asteroid: Sprite

	// Labels for the gui
	// TESTA - Leaving these here for when we add our UI
	private planetsLabel: Label;

	// Timers
	private gameEndTimer: number = 0;
	private GAME_END_MAX_TIME: number = 3;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);
	private ASTEROID_SPEED: number = 100;
	private ASTEROID_SPEED_INC: number = 10;

	//Gleb - These are some UI components that will be useful for handling fire and eventually switching between balls
	private uiComponents: Layer;

	// HOMEWORK 2 - TODO
	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		// Load in the player spaceship spritesheet
		this.load.spritesheet("player", "hw2_assets/spritesheets/player_planet.json");

		// Load in the sprites
		this.load.image("asteroid", "hw2_assets/sprites/Asteroid TEMP.png")
		this.load.image("black hole", "hw2_assets/sprites/Black Hole TEMP.png")

		// Load in the background image
		this.load.image("space", "hw2_assets/sprites/space.png");
	}

	/*
	 * startScene() allows us to add in the assets we loaded in loadScene() as game objects.
	 * Everything here happens strictly before update
	 */
	startScene(){
		// Gleb - Defining the UI Layer that will be used for actually Firing the Ship
		const center = this.viewport.getCenter();

        // The main menu
        this.uiComponents = this.addUILayer("fireButton");
		const fire = this.add.uiElement(UIElementType.BUTTON, "fireButton", {position: new Vec2(center.x, center.y - 100), text: "Fire!"});
        fire.size.set(200, 50);
        fire.borderWidth = 2;
        fire.borderColor = Color.WHITE;
        fire.backgroundColor = Color.TRANSPARENT;
        fire.onClickEventId = Homework2Event.FIRE_BALL;
		// Create a background layer
		this.addLayer("background", 0);

		// Add in the background image
		let bg = this.add.sprite("space", "background");
		bg.scale.set(2, 2);
		bg.position.copy(this.viewport.getCenter());

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer("primary", 5);

		// Initialize the player
		this.initializePlayer();
		
		// Initialize the UI
		this.initializeUI();

		// Initialize object pools
		this.initializeObjectPools();


		// TESTA - Here is where we load in the elements. This might be its own function in the final version
		this.asteroid = this.add.sprite("asteroid", "primary")
		let asteroid = this.asteroid
		asteroid.scale = new Vec2(2, 2)
		asteroid.position = new Vec2(400,300)
		asteroid.addAI(AsteroidAI)
		let collider = new Circle(Vec2.ZERO, 50);
		asteroid.setCollisionShape(collider);

		let dir = Vec2.UP.rotateCCW(Math.PI);
		asteroid.setAIActive(true, {direction: dir});
		AsteroidAI.SPEED += this.ASTEROID_SPEED_INC;

		
		let black_hole = this.add.sprite("black hole", "primary")
		black_hole.position = new Vec2(200, 300)
		// TESTA - Bc the sprite I made was small, scale it here. We won't do this with the final sprite
		black_hole.scale = new Vec2(3, 3)





		// Initialize variables
		AsteroidAI.SPEED = this.ASTEROID_SPEED;

		// Subscribe to events
		this.receiver.subscribe(Homework2Event.PLAYER_I_FRAMES_END);
		this.receiver.subscribe(Homework2Event.PLAYER_DEAD);
	}

	/*
	 * updateScene() is where the real work is done. This is where any custom behavior goes.
	 */
	updateScene(deltaT: number){
		// Handle events we care about
		this.handleEvents();

		this.handleCollisions();

		// Handle timers
		this.handleTimers(deltaT);

		// Get the viewport center and padded size
		const viewportCenter = this.viewport.getCenter().clone();
		const paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.WORLD_PADDING.scaled(2));

		// Handle screen wrapping
		this.handleScreenWrap(this.player, viewportCenter, paddedViewportSize);
		this.handleScreenWrap(this.asteroid, viewportCenter, paddedViewportSize);
	}

	/* ########## START SCENE METHODS ########## */
	/**
	 * Creates and sets up our player object
	 */
	initializePlayer(): void {
		// Add in the player as an animated sprite
		// We give it the key specified in our load function and the name of the layer
		this.player = this.add.animatedSprite("player", "primary");
		this.player.addPhysics()
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);

		// Play the idle animation by default
		this.player.animation.play("idle");

		// Give the player a smaller hitbox
		let playerCollider = new Circle(Vec2.ZERO, 32)
		this.player.setCollisionShape(playerCollider)

		// Add a playerController to the player
		this.player.addAI(SpaceshipPlayerController, {owner: this.player, initialShield: this.playerShield});
	}

	/**
	 * Creates all of our UI layer components
	 */
	initializeUI(): void {
		// UILayer stuff
		this.addUILayer("ui");

		// Shields label
		this.planetsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(125, 40), text: `Planets Left: 1`});
		this.planetsLabel.size.set(200, 50);
		this.planetsLabel.setHAlign("left");
		this.planetsLabel.textColor = Color.WHITE;
	}

	/**
	 * Creates object pools for our items.
	 * For more information on object pools, look here:
	 * https://gameprogrammingpatterns.com/object-pool.html
	 */
	initializeObjectPools(): void {
		// TESTA - Leaving this function in here in case we need to use it later. Maybe.
	}



	/* ########## UPDATE SCENE METHODS ########## */
	
	/**
	 * Handles all events we care about in the update cycle.
	 * Gets all events from the receiver this frame, and reacts to them accordingly
	 */
	handleEvents(){
		while(this.receiver.hasNextEvent()){
			let event = this.receiver.getNextEvent();

			if(event.type === Homework2Event.PLAYER_I_FRAMES_END){
				this.playerinvincible = false;
			}

			if(event.type === Homework2Event.PLAYER_DEAD){
				this.playerDead = true;
			}
		}
	}

	/**
	 * Updates all of our timers and handles timer related functions
	 */
	handleTimers(deltaT: number): void {

		if(this.playerDead) this.gameEndTimer += deltaT;

		if(this.gameEndTimer > this.GAME_END_MAX_TIME){
			// End the game
			this.sceneManager.changeScene(GameOver, {score: this.numAsteroidsDestroyed}, {});
		}
	}

	handleCollisions(){
		// TESTA - Here will need a lot of work. We're going to need to make the physics work. Not easy.
	}

	/**
	 * @param node The node to wrap around the screen
	 * @param viewportCenter The center of the viewport
	 * @param paddedViewportSize The size of the viewport with padding
	 */
	handleScreenWrap(node: GameNode, viewportCenter: Vec2, paddedViewportSize: Vec2): void {
		// Your code goes here:
		if (node.position.x > viewportCenter.x+(paddedViewportSize.x/2)) {
			node.position.x = viewportCenter.x-(paddedViewportSize.x/2)
		} else if (node.position.x < viewportCenter.x-(paddedViewportSize.x/2)) {
			node.position.x = viewportCenter.x+(paddedViewportSize.x/2)
		}
		if (node.position.y > viewportCenter.y+(paddedViewportSize.y/2)) {
			node.position.y = viewportCenter.y-(paddedViewportSize.y/2)
		} else if (node.position.y < viewportCenter.y-(paddedViewportSize.y/2)) {
			node.position.y = viewportCenter.y+(paddedViewportSize.y/2)
		}
	}

	/*
	 * @param node The node to wrap around the screen
	 * @param viewportCenter The center of the viewport
	 * @param paddedViewportSize The size of the viewport with padding
	 */
	checkOffScreen(node: GameNode, viewportCenter: Vec2, paddedViewportSize: Vec2): boolean {
		if (node.position.x > viewportCenter.x+(paddedViewportSize.x/2)) {
			return true
		} else if (node.position.x < viewportCenter.x-(paddedViewportSize.x/2)) {
			return true
		}
		if (node.position.y > viewportCenter.y+(paddedViewportSize.y/2)) {
			return true
		} else if (node.position.y < viewportCenter.y-(paddedViewportSize.y/2)) {
			return true
		}
		return false
	}

	// TESTA - All collisions in the game will be Circle-Circle 
	/**
	 * @param circle1 The Circle collision shape 1
	 * @param circle2 The Circle collision shape 2
	 * @returns True if the two shapes overlap, false if they do not
	 */
	static checkAABBtoCircleCollision(circle1: Circle, circle2: Circle): boolean {
		var distX = circle1.center.x - circle2.center.x
		var distY = circle1.center.y - circle2.center.y
		var radDist = circle1.radius+circle2.radius

		// Not taking sqrt to save cycles
		if (distX*distX + distY*distY < radDist*radDist) {
			return true
		}
		return false
	}

}