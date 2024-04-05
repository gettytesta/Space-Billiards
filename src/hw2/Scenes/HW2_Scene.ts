import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import AsteroidAI from "../AI/AsteroidAI";
import { Homework2Event, Homework2Shaders } from "../HW2_Enums";
import SpaceshipPlayerController from "../AI/SpaceshipPlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import GameOver from "./GameOver";

/**
 * In Wolfie2D, custom scenes extend the original scene class.
 * This gives us access to lifecycle methods to control our game.
 */
export default class Homework1_Scene extends Scene {
	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private playerDead: boolean = false;
	private playerShield: number = 5;
	private playerinvincible: boolean = false;
	private mineralAmount: number = 4;
	private MIN_SPAWN_DISTANCE: number = 100;
	private numAsteroidsDestroyed: number = 0;

	// Create an object pool for our asteroids
	private MAX_NUM_ASTEROIDS = 6;
	private INITIAL_NUM_ASTEROIDS = 1;
	private numAsteroids = 0;
	private asteroids: Array<Graphic> = new Array(this.MAX_NUM_ASTEROIDS);

	// Create an object pool for our minerals
	private MAX_NUM_MINERALS = 20;
	private minerals: Array<Graphic> = new Array(this.MAX_NUM_MINERALS);

	// Labels for the gui
	private mineralsLabel: Label;
	private shieldsLabel: Label;
	private asteroidsLabel: Label;

	// Timers
	private asteroidTimer: number = 0;
	private ASTEROID_MAX_TIME: number = 5;	// Spawn an asteroid every 10 seconds
	private mineralTimer: number = 0;
	private MINERAL_MAX_TIME: number = 5; // Spawn a mineral every 5 seconds
	private gameEndTimer: number = 0;
	private GAME_END_MAX_TIME: number = 3;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);
	private ASTEROID_SPEED: number = 100;
	private ASTEROID_SPEED_INC: number = 10;

	// HOMEWORK 2 - TODO
	/*
		You'll want to be sure to load in your own sprite here
	*/
	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		/* ##### DO NOT MODIFY ##### */
		// Load in the player spaceship spritesheet
		this.load.spritesheet("player", "hw2_assets/spritesheets/player_spaceship.json");

		// Load in the background image
		this.load.image("space", "hw2_assets/sprites/space.png");
	}

	/*
	 * startScene() allows us to add in the assets we loaded in loadScene() as game objects.
	 * Everything here happens strictly before update
	 */
	startScene(){
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

		// Spawn some asteroids to start the game
		for(let i = 0; i < this.INITIAL_NUM_ASTEROIDS; i++){
			this.spawnAsteroid();
		}

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

		for(let asteroid of this.asteroids){
			if(asteroid.visible){
				this.handleScreenWrap(asteroid, viewportCenter, paddedViewportSize);
			}
		}
	}

	/* #################### CUSTOM METHODS #################### */

	/* ########## START SCENE METHODS ########## */
	/**
	 * Creates and sets up our player object
	 */
	initializePlayer(): void {
		// Add in the player as an animated sprite
		// We give it the key specified in our load function and the name of the layer
		this.player = this.add.animatedSprite("player", "primary");
		
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

		// Minerals label
		this.mineralsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(125, 50), text: `Minerals: ${this.mineralAmount}`});
		this.mineralsLabel.size.set(200, 50);
		this.mineralsLabel.setHAlign("left");
		this.mineralsLabel.textColor = Color.WHITE;

		// Shields label
		this.shieldsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(375, 50), text: `Shield: ${this.playerShield}`});
		this.shieldsLabel.size.set(200, 50);
		this.shieldsLabel.setHAlign("left");
		this.shieldsLabel.textColor = Color.WHITE;

		// Asteroids label
		this.asteroidsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(875, 50), text: "Asteroids: 0"});
		this.asteroidsLabel.size.set(200, 50);
		this.asteroidsLabel.setHAlign("left");
		this.asteroidsLabel.textColor = Color.WHITE;
	}

	/**
	 * Creates object pools for our items.
	 * For more information on object pools, look here:
	 * https://gameprogrammingpatterns.com/object-pool.html
	 */
	initializeObjectPools(): void {
		// Initialize the mineral object pool
		for(let i = 0; i < this.minerals.length; i++){
			this.minerals[i] = this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(32, 32)});
			this.minerals[i].visible = false;
		}

		// Initialize the asteroid object pool
		for(let i = 0; i < this.asteroids.length; i++){
			this.asteroids[i] = this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0), size: new Vec2(100, 100)});
			// Use our custom shader for the asteroids
			this.asteroids[i].useCustomShader(Homework2Shaders.GRADIENT_CIRCLE);

			// Make our asteroids inactive by default
			this.asteroids[i].visible = false;

			// Assign them an asteroid ai
			this.asteroids[i].addAI(AsteroidAI);

			// Give them a collision shape
			let collider = new Circle(Vec2.ZERO, 50);
			this.asteroids[i].setCollisionShape(collider);
		}
	}

	// Spawns a new mineral into the world
	spawnMineral(): void {
		// Find the first viable mineral
		let mineral: Graphic = null;

		for(let m of this.minerals){
			if(!m.visible){
				// We found a dead asteroid
				mineral = m;
				break;
			}
		}

		if(mineral !== null){
			// Bring this mineral to life
			mineral.visible = true;

			let viewportSize = this.viewport.getHalfSize().scaled(2);
			// Loop on position until we're clear of the player
			mineral.position = RandUtils.randVec(0, viewportSize.x, 0, viewportSize.y);

			while(mineral.position.distanceTo(this.player.position) < this.MIN_SPAWN_DISTANCE){
				mineral.position = RandUtils.randVec(0, viewportSize.x, 0, viewportSize.y);
			}
		}
	}

	/* ############################## */

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
		this.asteroidTimer += deltaT;
		this.mineralTimer += deltaT;

		if(this.playerDead) this.gameEndTimer += deltaT;

		if(this.asteroidTimer > this.ASTEROID_MAX_TIME){
			// Spawn an asteroid at a random location (not near the player)
			this.asteroidTimer -= this.ASTEROID_MAX_TIME;
			this.spawnAsteroid();
		}

		if(this.mineralTimer > this.MINERAL_MAX_TIME){
			// Spawn a mineral at a random location (not near the player)
			this.mineralTimer -= this.MINERAL_MAX_TIME;
			this.spawnMineral();
		}

		if(this.gameEndTimer > this.GAME_END_MAX_TIME){
			// End the game
			this.sceneManager.changeScene(GameOver, {score: this.numAsteroidsDestroyed}, {});
		}
	}

	handleCollisions(){
		/* ########## DO NOT MODIFY THIS CODE ########## */

		// Check for mineral collisions
		for(let mineral of this.minerals){
			if(mineral.visible && this.player.collisionShape.overlaps(mineral.boundary)){
				// A collision happened - destroy the mineral
				mineral.visible = false;

				// Increase the minerals available to the player
				this.mineralAmount += 1;

				// Update the gui
				this.mineralsLabel.text = `Minerals: ${this.mineralAmount}`;
			}
		}

		/* ########## #################### ########## */
		/* ########## YOU CAN CHANGE THE CODE BELOW THIS LINE ########## */

		// If the player is not invincible (e.g. they just got hit by an asteroid last frame),
		// check for asteroid collisions
		if(!this.playerinvincible){
			for(let asteroid of this.asteroids){
				// If the asteroid is spawned in and it overlaps the player
				if(asteroid.visible && Homework1_Scene.checkAABBtoCircleCollision(<AABB>this.player.collisionShape, <Circle>asteroid.collisionShape)){
					// Put your code here:
					asteroid.visible = false
					this.numAsteroids -= 1

					this.asteroidsLabel.text = `Asteroids: ${this.numAsteroids}`;
				
					this.numAsteroidsDestroyed += 1
					this.playerShield -= 1
					this.shieldsLabel.text = `Shield: ${this.playerShield}`

					this.playerinvincible = true

					this.emitter.fireEvent(Homework2Event.PLAYER_DAMAGE, {id: this.player.id, shield: this.playerShield})
				}
			}
		}
	}

	// HOMEWORK 2 - TODO
	/**
	 * This function spawns a new asteroid from our object pool.
	 * 
	 * What you'll have to do here is make sure the newly spawned asteroid has a random color,
	 * chosen from a selection of your 6 favorite colors.
	 * 
	 * The asteroid has a color field with type Color, a class that can be found in the Utils folder.
	 * Check out that class to see how to create colors and access its fields.
	 */
	spawnAsteroid(): void {
		// Find the first viable asteroid
		let asteroid: Graphic = null;

		for(let a of this.asteroids){
			if(!a.visible){
				// We found a dead asteroid
				asteroid = a;
				break;
			}
		}

		if(asteroid !== null){
			// Bring this asteroid to life
			asteroid.visible = true;

			// Extract the size of the viewport
			let viewportSize = this.viewport.getHalfSize().scaled(2);

			// Loop on position until we're clear of the player
			asteroid.position = RandUtils.randVec(0, viewportSize.x, 0, viewportSize.y);
			while(asteroid.position.distanceTo(this.player.position) < this.MIN_SPAWN_DISTANCE){
				asteroid.position = RandUtils.randVec(0, viewportSize.x, 0, viewportSize.y);
			}

			// Assign a random direction
			let dir = Vec2.UP.rotateCCW(Math.random()*Math.PI*2);
			asteroid.setAIActive(true, {direction: dir});
			AsteroidAI.SPEED += this.ASTEROID_SPEED_INC;

			// Choose one of 6 colors randomly and set the asteroid's color
			const six_colors = [[0.116,0.890,0.877],
								[0.774,0.098,0.980],
								[0.980,0.127,0.098],
								[0.171,0.098,0.980],
								[0.950,0.897,0.314],
								[0.060,0.480,0.000]];
			const ast_clr = six_colors[RandUtils.randInt(0,6)];
			asteroid.color.set(ast_clr[0], ast_clr[1], ast_clr[2]);

			// Update the UI
			this.numAsteroids += 1;
			this.asteroidsLabel.text = `Asteroids: ${this.numAsteroids}`;
		}
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