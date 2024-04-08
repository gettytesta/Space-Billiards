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
import CuePlayerController from "../AI/CuePlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import GameOver from "./Game_Over";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import ClearStage from "./Clear_Stage";
import Game from "../../Wolfie2D/Loop/Game";
import Levels from "./Levels";
import Level from "./LevelType";


// TESTA - This file should be used for any scene that we create. 
// We'll then make a new TS file just containing the placements of the items, which base_scene will load in.
// This is to avoid having to port over all the crap
// Essentially just making level files


/**
 * In Wolfie2D, custom scenes extend the original scene class.
 * This gives us access to lifecycle methods to control our game.
 */
export default class Base_Scene extends Scene {
	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private playerDead: boolean = false;
	private playerClearStage: boolean = false;

	// TESTA - I'm not exactly sure if this should be stored here. It will represent what level we're on.
	private levelNumber = 1;

	// TESTA - This will be our array for all asteroids in the scene.
	private asteroids: Array<Sprite> = new Array();

	private planets: Array<AnimatedSprite> = new Array(2);

	private black_hole: Sprite

	// Labels for the gui
	private planetsLabel: Label;

	// Timers
	private gameEndTimer: number = 0;
	private GAME_END_MAX_TIME: number = 3;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);

	// Gleb - These are some UI components that will be useful for handling fire and eventually switching between balls
	private uiComponents: Layer;

	initScene(init: Record<string, any>): void {
		this.levelNumber = init.levelNum
	}

	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		console.log(this.sceneOptions)

		// Load in the planet spritesheet
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
		// Gleb - Defining the UI Layer that will be used for actually firing the ship
		const center = this.viewport.getCenter();

        // The main menu
        this.uiComponents = this.addUILayer("fireButton");
		const fire = this.add.uiElement(UIElementType.BUTTON, "fireButton", {position: new Vec2(center.x, center.y - 100), text: "Fire!"});
        fire.size.set(200, 50);
		fire.position = new Vec2(1080,750)
        fire.borderWidth = 2;
        fire.borderColor = Color.WHITE;
        fire.backgroundColor = Color.TRANSPARENT;
        fire.onClickEventId = GameEvents.FIRE_BALL;
		// Create a background layer
		this.addLayer("background", 0);

		// Add in the background image
		let bg = this.add.sprite("space", "background");
		bg.scale.set(2, 2);
		bg.position.copy(this.viewport.getCenter());

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer("primary", 5);

		// Initialize the cues, asteroids, and black hole
		this.initializeObjects(this.levelNumber);
		
		// Initialize the UI
		this.initializeUI();

		// Initialize object pools
		this.initializeObjectPools();

		// Subscribe to events
		this.receiver.subscribe(GameEvents.PLANET_HIT_BLACKHOLE)
		this.receiver.subscribe(GameEvents.PLANET_COLLISION)
		this.receiver.subscribe(GameEvents.PLANET_OOB)
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
	}

	/* ########## START SCENE METHODS ########## */
	/**
	 * Creates and sets up our player object
	 */
	initializeObjects(levelNumber: number): void {
		var level : Level = Levels.getLevel(this.viewport, levelNumber);

		this.player = this.add.animatedSprite("player", "primary");
		this.player.addPhysics()
		this.player.position = level.cue_pos;
		this.player.animation.play("idle");
		let playerCollider = new Circle(Vec2.ZERO, 32)
		this.player.setCollisionShape(playerCollider)
		this.player.addAI(CuePlayerController, {owner: this.player});

		for (let asteroid of level.asteroids) {
			let currAsteroid = this.add.sprite("asteroid", "primary")
			currAsteroid.scale = new Vec2(2, 2)
			currAsteroid.position = asteroid.position
			currAsteroid.addAI(AsteroidAI)
			currAsteroid.setCollisionShape(new Circle(Vec2.ZERO, 50));
			this.asteroids.push(currAsteroid)
		}

		this.black_hole = this.add.sprite("black hole", "primary")
		this.black_hole.setCollisionShape(new Circle(Vec2.ZERO, 50))
		this.black_hole.position = level.black_hole_pos
		// TESTA - Bc the sprite I made was small, scale it here. We won't do this with the final sprite
		this.black_hole.scale = new Vec2(3, 3)
	}

	/**
	 * Creates all of our UI layer components
	 */
	initializeUI(): void {
		// UILayer stuff
		this.addUILayer("ui");

		// TESTA - This definitely won't be needed in the final version
		// The planets shoot at the same time, so this isn't needed
		// Planets label
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

			if(event.type === GameEvents.PLANET_COLLISION){
				this.playerDead = true;
			} else if (event.type === GameEvents.PLANET_HIT_BLACKHOLE){
				this.playerClearStage = true;
			} else if (event.type === GameEvents.PLANET_OOB){
				this.playerDead = true;
            }
		}
	}

	/**
	 * Updates all of our timers and handles timer related functions
	 */
	handleTimers(deltaT: number): void {
		if (this.playerDead) {
			this.gameEndTimer += deltaT;
			this.sceneManager.changeScene(GameOver, {});
		} else if (this.playerClearStage) {
			this.gameEndTimer += deltaT;
			this.sceneManager.changeScene(ClearStage, {});
		}
	}

	handleCollisions(){
		// Check for collision with black hole
		if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>this.black_hole.collisionShape)) {
			this.emitter.fireEvent(GameEvents.PLANET_HIT_BLACKHOLE, {id: this.player.id})
		}
		// Check for collision with asteroid(s)
		for (let asteroid of this.asteroids) {
			if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>asteroid.collisionShape)) {
				this.emitter.fireEvent(GameEvents.PLANET_COLLISION, {id: this.player.id})
			}
		}

		const viewportCenter = this.viewport.getCenter().clone();
		const paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.WORLD_PADDING.scaled(2));

		if (this.checkOffScreen(this.player, viewportCenter, paddedViewportSize)) {
			this.emitter.fireEvent(GameEvents.PLANET_OOB, {id: this.player.id})
		}
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
	static checkCircletoCircleCollision(circle1: Circle, circle2: Circle): boolean {
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