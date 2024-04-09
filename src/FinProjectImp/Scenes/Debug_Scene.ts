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
import { GameEvents } from "../GameEnums";
import SpaceshipPlayerController from "../AI/CuePlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import GameOver from "./Game_Over";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import Game from "../../Wolfie2D/Loop/Game";


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
		this.load.spritesheet("player", "hw2_assets/spritesheets/player_spaceship.json");

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
		//Gleb - Defining the UI Layer that will be used for actually Firing the Ship
		const center = this.viewport.getCenter();

        // The main menu
        this.uiComponents = this.addUILayer("fireButton");
		const fire = this.add.uiElement(UIElementType.BUTTON, "fireButton", {position: new Vec2(center.x + 450, center.y + 300), text: "Fire!"});
        fire.size.set(200, 50);
        fire.borderWidth = 2;
        fire.borderColor = Color.WHITE;
        fire.backgroundColor = Color.TRANSPARENT;
        fire.onClickEventId = GameEvents.FIRE_BALL;


		/* ##### DO NOT MODIFY ##### */
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
		black_hole.scale = new Vec2(2, 2)





		// Initialize variables
		AsteroidAI.SPEED = this.ASTEROID_SPEED;

		// Subscribe to events
		//this.receiver.subscribe(GameEvents.PLAYER_I_FRAMES_END);
		//this.receiver.subscribe(Homework2Event.PLAYER_DEAD);
	}

	/*
	 * updateScene() is where the real work is done. This is where any custom behavior goes.
	 */
	updateScene(deltaT: number){
		// Handle events we care about

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
		this.player.scale.set(0.5, 0.5);

		// Play the idle animation by default
		this.player.animation.play("idle");

		// Give the player a smaller hitbox
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(32, 32));
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

	// HOMEWORK 2 - TODO
	/**
	 * This function takes in a GameNode that may be out of bounds of the viewport and
	 * modifies its position so that it wraps around the viewport from one side to the other.
	 * e.g. going to far off screen in the negative x-direction would cause a node to be looped
	 * back to the positive x size.
	 * 
	 * Keep in mind while implementing this that JavaScript's % operator does a remainder operation,
	 * not a modulus operation:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
	 * 
	 * Also keep in mind that the screenwrap in this case is padded, meaning that a GameNode can go off
	 * the side of the viewport by the padding amount in any direction before it will wrap to the other side.
	 * 
	 * A visualization of the padded viewport is shown below. o's represent valid locations for GameNodes,
	 * X's represent invalid locations.
	 * 
	 * An o with an arrow is drawn to represent how a GameNode wraps around the screen.
	 * Note that it wraps from one side of the padding to the other side, and is therefore not
	 * visible until it reaches the viewport (aka the visible region).
	 * 
	 * 		X				 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|		 _______________________________		|
	 * 			|	o	|								|		|
	 * 			|		|								|		|
	 *	 		|		|	  THIS IS THE VISIBLE		|		|
	 * 			|		|			 REGION				|		|
	 * 	  <-WRAP|<--o	|								|	o<--|ENDS UP ON THIS SIDE<-
	 * 			|		|		o						|		|
	 * 			|		|_______________________________|		|
	 * 			|												|
	 * 			|_______________________________________________|
	 * 
	 * It may be helpful to make your own drawings while figuring out the math for this part.
	 * 
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

	// HOMEWORK 2 - TODO
	/**
	 * This method checks whether or not an AABB collision shape and a Circle collision shape
	 * overlap with each other.
	 * 
	 * An AABB is an axis-aligned bounding box, it is a rectangle that will always be aligned to the
	 * x-y grid.
	 * 
	 * You will very likely want to draw out examples of this collision while thinking about how
	 * to write this function, and you will want to test it vigorously. An algorithm that works
	 * only most of the time is not an algorithm. If a player is able to break your game, they
	 * will find a way to do so.
	 * 
	 * You can test this method independently by writing some code in main.ts.
	 * 
	 * Although it talks about AABB collisions exclusively, you may find this resource helpful:
	 * https://noonat.github.io/intersect/
	 * 
	 * There are many ways to solve this problem, so get creative! There is not one single solution
	 * we're looking for. Just make sure it works by thoroughly testing it.
	 * 
	 * @param aabb The AABB collision shape
	 * @param circle The Circle collision shape
	 * @returns True if the two shapes overlap, false if they do not
	 */
	static checkAABBtoCircleCollision(aabb: AABB, circle: Circle): boolean {
		// Your code goes here:
		// We're going to find the closest point on the AABB to the circle's center

		var closestX;
		var closestY;

		// Find the pos. of the closest x value on the aabb
		if (circle.center.x <= aabb.bottomLeft.x) { 
			// Circle is to the right of the aabb's x range
			closestX = aabb.bottomLeft.x
			
		} else if (circle.center.x >= aabb.bottomRight.x) {
			// Circle is to the left of the aabb's x range
			closestX = aabb.bottomRight.x
		} else {
			// Circle is inside of the aabb's x range
			closestX = circle.center.x
		}

		// Fidn the pos. of the closest y value on the aabb
		if (circle.center.y <= aabb.topLeft.y) { 
			// Circle is above the aabb's y range
			closestY = aabb.topLeft.y;
			
		} else if (circle.center.y >= aabb.bottomLeft.y) {
			// Circle is below aabb's y range
			closestY = aabb.bottomRight.y
		} else {
			// Circle is inside of the aabb's y range
			closestY = circle.center.y
		}

		// Find the distance (squared) between the circle's center and the closest point on the aabb
		var dist_squared = (circle.x-closestX)*(circle.x-closestX) + (circle.y-closestY)*(circle.y-closestY)
		// Since sqrrt is costly, just compare the squares
		if (dist_squared <= circle.r*circle.r) {
			return true;
		}

		return false;
	}

}