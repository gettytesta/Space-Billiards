import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import AsteroidAI from "../AI/AsteroidAI";
import { GameEvents } from "../GameEnums";
import CuePlayerController from "../AI/CuePlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import Levels from "./Levels";
import Level, { Asteroid, WormholePair } from "./LevelType";
import Debug from "../../Wolfie2D/Debug/Debug";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

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
	private playerJustTouchedWormhole: boolean = false;

	// TESTA - I'm not exactly sure if this should be stored here. It will represent what level we're on.
	private levelNumber = 1;
	private levelNumberLabel: Label;

	private paused = false;
	private playing = false;

	private hardMode = false;

	private asteroids: Array<AnimatedSprite> = new Array();

	private stars: Array<AnimatedSprite> = new Array();

	// TESTA - IDK if we'll even do 2 planet gameplay so this might be unused
	private planets: Array<AnimatedSprite> = new Array(2);
	private wormholes: Array<AnimatedSprite> = new Array();
	private wormholePairs: Array<WormholePair> = new Array();
	private black_hole: AnimatedSprite;

	private planetSprites = new Array();

	private arrow: Sprite

	private backgroundStars: Array<Rect> = new Array();
	private backgroundStarAlphaDirections: Array<boolean> = new Array();

	private cs1: Sprite;
	private cs2: Sprite;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);

	// Timer for the tutorial cutscene
	private cutsceneTimer = 0;
	private cutsceneScreen = 0;
	private cutsceneOver = false;

	// Timer for printing the path dots
	private pathdotTimer = .3;

	private pathDots: Array<Rect> = new Array();

	// Each layer used for the game
	private nextLevel: Layer;
	private tryAgain: Layer;
	private gameLayer: Layer;
	private uiLayer: Layer;
	private backgroundLayer: Layer;
	private cutscene1Layer: Layer;
	private cutscene2Layer: Layer;
	private pauseLayer: Layer;
	private warpLayer: Layer;
	private arrowLayer: Layer;
	private tutorialLayer: Layer;
	private pathdotLayer: Layer;
	
	 // Layers, for multiple main menu screens
	 private mainMenu: Layer;
	 private controls: Layer;
	 private about: Layer;
	 private levelSelect: Layer;

	private levelIndex = 0;
	 private levelButtons = Array<UIElement>();
 
	 private LevelButtonPositions: Vec2[] = [
		 new Vec2(this.viewport.getCenter().x-300, this.viewport.getCenter().y-150),
		 new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y-150),
		 new Vec2(this.viewport.getCenter().x+300, this.viewport.getCenter().y-150),
		 new Vec2(this.viewport.getCenter().x-300, this.viewport.getCenter().y),
		 new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y),
		 new Vec2(this.viewport.getCenter().x+300, this.viewport.getCenter().y),
		 new Vec2(this.viewport.getCenter().x-300, this.viewport.getCenter().y+150),
		 new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y+150),
		 new Vec2(this.viewport.getCenter().x+300, this.viewport.getCenter().y+150),
		 new Vec2(-5000, -5000)
	 ]   
 
	 private logo: AnimatedSprite;
	 private dragDiagram: Sprite;
 
	 private hardmodeOpt: UIElement;
	 public static hardmodeSelected = false;


	public initScene(init: Record<string, any>): void {
		this.levelNumber = -1
		this.hardMode = false
	}

	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	public loadScene(){
		// Load in the planet spritesheet
		this.load.spritesheet("star", "hw2_assets/spritesheets/star.json");
		this.load.spritesheet("asteroid", "hw2_assets/spritesheets/asteroid.json");
		this.load.spritesheet("wormhole", "hw2_assets/spritesheets/wormhole.json")
		this.load.spritesheet("blackhole", "hw2_assets/spritesheets/blackhole.json")

		//this.load.spritesheet("planet1", "hw2_assets/spritesheets/planet1.json")
		this.load.spritesheet("planet2", "hw2_assets/spritesheets/planet2.json")
		//\\this.load.spritesheet("planet3", "hw2_assets/spritesheets/planet3.json")

		//this.planetSprites = ["planet1", "planet2", "planet3"]
		this.planetSprites = ["planet2"]

		this.load.image("black_hole", "hw2_assets/sprites/black_hole.png")
		this.load.image("arrow", "hw2_assets/sprites/arrow.png")
		this.load.image("space_warp", "hw2_assets/sprites/space_warp.png")

		// Load in the sfx
		this.load.audio("fire", "hw2_assets/sfx/fire.wav")
		this.load.audio("planet_explode", "hw2_assets/sfx/planet_explode.wav")
		this.load.audio("oob", "hw2_assets/sfx/oob.wav")
		this.load.audio("clear", "hw2_assets/sfx/clear.wav")
		this.load.audio("music", "hw2_assets/music/intro.mp3")

		// Load in the cutscene images for the tutorial
		this.load.image("cutscene1", "hw2_assets/cutscene/Space Billiards CS1.png")
		this.load.image("cutscene2", "hw2_assets/cutscene/Space Billiards CS2.png")

		// this.load.spritesheet("logo_text", "hw2_assets/spritesheets/logo_text.json")
		// this.load.image("logo", "hw2_assets/sprites/logo.png")
		// this.load.image("drag_diagram", "hw2_assets/sprites/drag_diagram.png")
	}

	public unloadScene(): void {
		this.resourceManager.unloadAllResources();
	}

	/*
	 * startScene() allows us to add in the assets we loaded in loadScene() as game objects.
	 * Everything here happens strictly before update
	 */

	startScene(){
		// Gleb - Defining the UI Layer that will be used for actually firing the ship
		const center = this.viewport.getCenter();

		this.backgroundLayer = this.addLayer("background", 0);
		for(let i = 0; i < 100; i++) {
			let x = Math.random() * this.viewport.getHalfSize().x * 2;
			let y = Math.random() * this.viewport.getHalfSize().x * 2;
			let size = (Math.random() + 1) * 3;

			let rect = this.add.graphic("RECT", "background",
										{position: new Vec2(x, y), size: new Vec2(size, size)});
			rect.color.set(255, 255, 255, Math.random());
			this.backgroundStars.push(rect as Rect);
			this.backgroundStarAlphaDirections.push(Math.random() < 0.5);
		}

		// Add layer for the path dots
		this.pathdotLayer = this.addLayer("pathdot", 3);
		
		// It is given a depth of 5 to be above our background
		this.gameLayer = this.addLayer("primary", 5);

		// Initialize the cues, asteroids, and black hole
		this.initializeObjects(this.levelNumber);
		
		// Initialize the UI
		this.initializeUI();

		this.initializeLayers();

		this.initializeMenuLayers();

		// Initialize object pools
		this.initializeObjectPools();

		// Subscribe to events
		this.receiver.subscribe(GameEvents.PLANET_HIT_WORMHOLE)
		this.receiver.subscribe(GameEvents.PLANET_HIT_BLACKHOLE)
		this.receiver.subscribe(GameEvents.PLANET_COLLISION)
		this.receiver.subscribe(GameEvents.PLANET_OOB)
		this.receiver.subscribe(GameEvents.LEVEL_FAIL)
		this.receiver.subscribe(GameEvents.LEVEL_PASS)
		this.receiver.subscribe(GameEvents.MENU)
		this.receiver.subscribe(GameEvents.TRY_AGAIN)
		this.receiver.subscribe(GameEvents.NEXT_LEVEL)
		this.receiver.subscribe(GameEvents.PAUSE)
        this.receiver.subscribe(GameEvents.LEVEL_SELECT);
        this.receiver.subscribe(GameEvents.CONTROLS);
        this.receiver.subscribe(GameEvents.ABOUT);
        this.receiver.subscribe(GameEvents.TUTORIAL);
        this.receiver.subscribe(GameEvents.LEVEL1);
		this.receiver.subscribe(GameEvents.LEVEL2);
		this.receiver.subscribe(GameEvents.LEVEL3);
		this.receiver.subscribe(GameEvents.LEVEL4);
		this.receiver.subscribe(GameEvents.LEVEL5);
		this.receiver.subscribe(GameEvents.LEVEL6);
		this.receiver.subscribe(GameEvents.LEVEL7);
		this.receiver.subscribe(GameEvents.LEVEL8);
		this.receiver.subscribe(GameEvents.LEVEL9);
		this.receiver.subscribe(GameEvents.LEVEL10);
		this.receiver.subscribe(GameEvents.LEVEL11);
		this.receiver.subscribe(GameEvents.LEVEL12);
		this.receiver.subscribe(GameEvents.LEVEL13);
		this.receiver.subscribe(GameEvents.LEVEL14);
		this.receiver.subscribe(GameEvents.LEVEL15);
		this.receiver.subscribe(GameEvents.LEVEL16);
		this.receiver.subscribe(GameEvents.LEVEL17);
		this.receiver.subscribe(GameEvents.LEVEL18);
        this.receiver.subscribe(GameEvents.HARDMODE);
        this.receiver.subscribe(GameEvents.PAGE_FORWARD);
        this.receiver.subscribe(GameEvents.PAGE_BACKWARD);

		if (this.levelNumber == -1) {
			this.tryAgain.setHidden(true)
			this.nextLevel.setHidden(true)
			this.gameLayer.setHidden(true)
			this.tutorialLayer.setHidden(true)
			this.arrowLayer.setHidden(true)
			this.uiLayer.setHidden(true)
			this.pathdotLayer.setHidden(true)
			this.levelSelect.setHidden(true);
            this.controls.setHidden(true);
            this.about.setHidden(true);
			this.mainMenu.setHidden(false)
		}
	}

	updateScene(deltaT: number){
		this.handleEvents();
		if (this.paused) {
			return
		}

		// Handle cutscene images
		if (!this.cutsceneOver)
			this.handleCutscene(deltaT); 

		// Draw pathdots if fired
		if ((<CuePlayerController>this.player._ai).didFire) {
			this.pathdotTimer += deltaT;
			if (this.pathdotTimer >= .25) {
				let pathdot = this.add.graphic("RECT", "pathdot", {position: this.player.position.clone(), size: new Vec2(5, 5)})
				pathdot.color = this.hardMode ? Color.RED : Color.YELLOW
				this.pathDots.push(pathdot as Rect)
				this.pathdotTimer = 0;
			}
		}

		// Update the background stars
		for(let i = 0; i < this.backgroundStars.length; i++) {
			let star = this.backgroundStars[i];

			let twinkleSpeed = 0.01;
			if(star.color.a < 0.3)
				twinkleSpeed = 0.005;
			if(star.color.a < 0.1)
				twinkleSpeed = 0.001;

			if(this.backgroundStarAlphaDirections[i]) {
				star.color.a += twinkleSpeed;
				if(star.color.a >= 0.6) {
					star.color.a = 0.6;
					this.backgroundStarAlphaDirections[i] = false;
				}
			} else {
				star.color.a -= twinkleSpeed;
				if(star.color.a <= 0.2) {
					star.color.a = 0.2;
					this.backgroundStarAlphaDirections[i] = true;
				}
			}
		}

		var level : Level = Levels.getLevel(this.viewport, this.levelNumber);

		this.handleCollisions();

		if (this.playerDead) {
			this.player.visible = false
			this.player.position = level.cue_pos;
			(<CuePlayerController>this.player._ai).resetAI(this.player)
			this.emitter.fireEvent(GameEvents.LEVEL_FAIL, {levelNum: this.levelNumber})
		} else if (this.playerClearStage) {
			this.player.visible = false
			this.player.position = level.cue_pos;
			(<CuePlayerController>this.player._ai).resetAI(this.player)
			this.emitter.fireEvent(GameEvents.LEVEL_PASS, {levelNum: this.levelNumber})
		}

		// Apply gravity towards the asteroid
		for (let asteroid of level.asteroids) {
			if(asteroid.position.distanceTo(this.player.position) > asteroid.mass)
				continue;
			let deltaV = new Vec2();
			deltaV.copy(asteroid.position);
			deltaV.sub(this.player.position);

			let distance = deltaV.mag();

			deltaV.normalize();
			deltaV.scale((asteroid.mass - distance + 20) * 4);

			(<CuePlayerController>this.player.ai).assignedVelocity.add(deltaV.scaled(deltaT))
		}

		// Apply ***slight*** gravity towards the black hole
		if(this.black_hole.position.distanceTo(this.player.position) < 100) {
			let deltaV = new Vec2();
			deltaV.copy(this.black_hole.position);
			deltaV.sub(this.player.position);
	
			let distance = deltaV.mag();
	
			deltaV.normalize();
			deltaV.scale((distance-20) * 4);
	
			(<CuePlayerController>this.player.ai).assignedVelocity.add(deltaV.scaled(deltaT))
		}

		// Get the viewport center and padded size
		const viewportCenter = this.viewport.getCenter().clone();
		const paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.WORLD_PADDING.scaled(2));
	}

	/**
	 * Creates and sets up our player object
	 */
	initializeObjects(levelNumber: number): void {
		var level : Level = Levels.getLevel(this.viewport, levelNumber);

		this.player = this.add.animatedSprite(this.planetSprites[Math.floor(Math.random() * this.planetSprites.length)], "primary");
		this.player.addPhysics()
		this.player.position = level.cue_pos;
		this.player._velocity = Vec2.ZERO
		this.player.animation.play("idle");
		this.player.setCollisionShape(new Circle(Vec2.ZERO, 32))

		// Adding a new layer just for the arrow
		this.arrowLayer = this.addLayer("arrow", 6);
		this.arrow = this.add.sprite("arrow", "arrow")
		this.arrow.isCollidable = false;
		this.arrow.visible = false;


		this.player.addAI(CuePlayerController, {owner: this.player, arrow: this.arrow});

		for (let asteroid of level.asteroids) {
			let currAsteroid = this.add.animatedSprite("asteroid", "primary")
			currAsteroid.animation.play("idle")
			currAsteroid.position = asteroid.position
			currAsteroid.scale.set(asteroid.mass/150, asteroid.mass/150)
			currAsteroid.addAI(AsteroidAI)
			currAsteroid.setCollisionShape(new Circle(Vec2.ZERO, 32*asteroid.mass/150));
			this.asteroids.push(currAsteroid)
		}

		for (let star of level.stars) {
			let currStar = this.add.animatedSprite("star", "primary")
			currStar.animation.play("idle")
			currStar.scale.set(1.15, 1.15)
			currStar.position = star.position
			currStar.setCollisionShape(new Circle(Vec2.ZERO, 32));
			this.stars.push(currStar)
		}

		for (let wormholePair of level.wormholePairs) {
			for (let i of [0, 1]) {
				let currWormhole = this.add.animatedSprite("wormhole", "primary")
				currWormhole.animation.play("idle");
				let scale = 1.3
				currWormhole.scale.set(scale, scale)
				currWormhole.position = wormholePair.positions[i]
				currWormhole.setCollisionShape(new Circle(Vec2.ZERO, 50));
				// TODO(cheryl): is this a reference or a copy?
				wormholePair.spriteIDs[i] = currWormhole.id
				this.wormholes.push(currWormhole)
			}
			this.wormholePairs.push(wormholePair)
		}

		this.black_hole = this.add.animatedSprite("blackhole", "primary")
		this.black_hole.scale.set(1.5, 1.5)
		this.black_hole.animation.play("idle")
		this.black_hole.setCollisionShape(new Circle(Vec2.ZERO, 30))
		this.black_hole.position = level.black_hole_pos
	}

	/**
	 * Creates all of our UI layer components
	 */
	initializeUI(): void {
		// UILayer stuff
		this.uiLayer = this.addUILayer("gameUi");

		const center = this.viewport.getCenter();

		// Level Number
		this.levelNumberLabel = <Label>this.add.uiElement(UIElementType.LABEL, "gameUi", {position: new Vec2(30, 40), text: this.levelNumber > 0 ? "Level " + this.levelNumber : "Tutorial Level"});
        this.levelNumberLabel.textColor = this.hardMode ? Color.RED : Color.YELLOW
		this.levelNumberLabel.setHAlign("left");

		// Fire Button
		const fire = this.add.uiElement(UIElementType.BUTTON, "gameUi", {position: new Vec2(1080,750), text: "Fire!"});
        fire.size.set(200, 50);
        fire.borderWidth = 2;
        fire.borderColor = Color.ORANGE;
        fire.backgroundColor = Color.BLACK;
        fire.onClickEventId = GameEvents.FIRE_BALL;

		// Pause Button
		const pause = this.add.uiElement(UIElementType.BUTTON, "gameUi", {position: new Vec2(125,750), text: "Pause"});
        pause.size.set(200, 50);
        pause.borderWidth = 2;
        pause.borderColor = Color.WHITE;
        pause.backgroundColor = Color.BLACK;
        pause.onClickEventId = GameEvents.PAUSE;

		// Restart level
		const retMenu = this.add.uiElement(UIElementType.BUTTON, "gameUi", {position: new Vec2(350, 750), text: "Restart Level"});
		retMenu.size.set(200, 50);
		retMenu.borderWidth = 2;
		retMenu.borderColor = Color.WHITE;
		retMenu.backgroundColor = Color.BLACK;
		retMenu.onClickEventId = GameEvents.TRY_AGAIN;
	}

	initializeObjectPools(): void {
		// TESTA - Leaving this function in here in case we need to use it later. Maybe.
	}

	initializeLayers(): void {
		const center = this.viewport.getCenter();

		/**
		 * LEVEL PASS PAGE
		 */
		this.nextLevel = this.addUILayer("nextLevel")
		this.nextLevel.setHidden(true)

		const clearStage = <Label>this.add.uiElement(UIElementType.LABEL, "nextLevel", {position: new Vec2(center.x, center.y-100), text: "Stage Cleared!"});
        clearStage.textColor = Color.WHITE;

		// Next Level
		const next = this.add.uiElement(UIElementType.BUTTON, "nextLevel", {position: new Vec2(center.x-200, center.y+100), text: "Next Level"});
		next.size.set(230, 50);
		next.borderWidth = 2;
		next.borderColor = Color.WHITE;
		next.backgroundColor = Color.BLACK;
		next.onClickEventId = GameEvents.NEXT_LEVEL;

		// Return to Menu
		var retMenu = this.add.uiElement(UIElementType.BUTTON, "nextLevel", {position: new Vec2(center.x+200, center.y+100), text: "Return to Menu"});
		retMenu.size.set(230, 50);
		retMenu.borderWidth = 2;
		retMenu.borderColor = Color.WHITE;
		retMenu.backgroundColor = Color.BLACK;
		retMenu.onClickEventId = GameEvents.MENU;



		/**
		 * LEVEL FAIL PAGE
		 */
		this.tryAgain = this.addUILayer("tryAgain")
		this.tryAgain.setHidden(true)

		const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "tryAgain", {position: new Vec2(center.x, center.y-100), text: "Level Failed"});
        gameOver.textColor = Color.WHITE;

		// Try Again
		const tryag = this.add.uiElement(UIElementType.BUTTON, "tryAgain", {position: new Vec2(center.x-200, center.y+100), text: "Try Again"});
		tryag.size.set(230, 50);
		tryag.borderWidth = 2;
		tryag.borderColor = Color.WHITE;
		tryag.backgroundColor = Color.BLACK;
		tryag.onClickEventId = GameEvents.TRY_AGAIN;

		// Return to Menu
		retMenu = this.add.uiElement(UIElementType.BUTTON, "tryAgain", {position: new Vec2(center.x+200, center.y+100), text: "Return to Menu"});
		retMenu.size.set(230, 50);
		retMenu.borderWidth = 2;
		retMenu.borderColor = Color.WHITE;
		retMenu.backgroundColor = Color.BLACK;
		retMenu.onClickEventId = GameEvents.MENU;



		/**
		 * PAUSE SCREEN
		 */
		this.pauseLayer = this.addUILayer("pause")
		this.pauseLayer.setHidden(true)

		const pauseText = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y-100), text: "Paused"});
        pauseText.textColor = Color.WHITE;

		// Return to Menu
		retMenu = this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y+100), text: "Return to Menu"});
		retMenu.size.set(230, 50);
		retMenu.borderWidth = 2;
		retMenu.borderColor = Color.WHITE;
		retMenu.backgroundColor = Color.BLACK;
		retMenu.onClickEventId = GameEvents.MENU;



		/**
		 * TUTORIAL CUTSCENE
		 */
		this.cutscene1Layer = this.addLayer("cutscene1Layer", 3)
		this.cutscene1Layer.setHidden(true)

		this.cs1 = this.add.sprite("cutscene1", "cutscene1Layer")
		this.cs1.position = this.viewport.getCenter()
		this.cs1.scale.set(1.1,1.1)

		this.cutscene2Layer = this.addLayer("cutscene2Layer", 3)
		this.cutscene2Layer.setHidden(true)

		this.cs2 = this.add.sprite("cutscene2", "cutscene2Layer")
		this.cs2.position = this.viewport.getCenter()
		this.cs2.scale.set(1.1,1.1)

		this.cs2.tweens.add("fadeIn", {
			startDelay: 0,
			duration: 1000,
			effects: [
			  {
				property: TweenableProperties.alpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUAD,
			  },
			],
		});
	  
		this.cs1.tweens.add("fadeOut", {
			startDelay: 0,
			duration: 1000,
			effects: [
			  {
				property: TweenableProperties.alpha,
				start: 1,
				end: 0,
				ease: EaseFunctionType.IN_OUT_QUAD,
			  },
			],
		});

		/**
		 * TUTORIAL LAYER
		 * The text/labels for the tutorial
		 */
		this.tutorialLayer = this.addUILayer("tutorial")
		this.tutorialLayer.setHidden(true)
			
		const astText = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x-400, 310), text: "Asteroids emit gravity"});
        astText.textColor = Color.WHITE;

		const starText = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, 310), text: "Stars don't emit gravity"});
        starText.textColor = Color.WHITE;

		const damageText = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x-200, 355), text: "Colliding with either will destroy your planet!"});
        damageText.textColor = Color.WHITE;

		const wrmText = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x+370, 310), text: "Wormholes teleport you"});
        wrmText.textColor = Color.WHITE;

		const crapText = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, center.y+250), text: "Drag the cursor to aim. Press fire to shoot!"});
        crapText.textColor = Color.WHITE;
	}

	initializeMenuLayers(): void {
		// this.logo = this.add.animatedSprite("logo_text", "primary");
        // this.logo.position = new Vec2(this.viewport.getCenter().x, this.viewport.getCenter().y - 100)
		// this.logo.scale = new Vec2(5, 5);
        // this.logo.animation.play("idle")
	
		/**
         * THE MAIN MENU
         */
        this.mainMenu = this.addUILayer("mainMenu");
		const center = this.viewport.getCenter();

        const name = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 150), text: "Space Billiards"});
        name.fontSize = 100;
        name.textColor = Color.WHITE;

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: "Level Select"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = GameEvents.LEVEL_SELECT;


		// Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 150), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = GameEvents.CONTROLS;

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = GameEvents.ABOUT;



        /**
         * THE LEVEL SELECT MENU
         */
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setHidden(true)

        

        // Add level1 button
        const level1 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[0], text: "Level 1"});
        level1.size.set(200, 100);
        level1.borderWidth = 2;
        level1.borderColor = Color.WHITE;
        level1.backgroundColor = Color.BLACK;
        level1.onClickEventId = GameEvents.LEVEL1;

        const level2 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[1], text: "Level 2"});
        level2.size.set(200, 100);
        level2.borderWidth = 2;
        level2.borderColor = Color.WHITE;
        level2.backgroundColor = Color.BLACK;
        level2.onClickEventId = GameEvents.LEVEL2;

        const level3 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[2], text: "Level 3"});
        level3.size.set(200, 100);
        level3.borderWidth = 2;
        level3.borderColor = Color.WHITE;
        level3.backgroundColor = Color.BLACK;
        level3.onClickEventId = GameEvents.LEVEL3;

        const level4 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[3], text: "Level 4"});
        level4.size.set(200, 100);
        level4.borderWidth = 2;
        level4.borderColor = Color.WHITE;
        level4.backgroundColor = Color.BLACK;
        level4.onClickEventId = GameEvents.LEVEL4;

        const level5 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[4], text: "Level 5"});
        level5.size.set(200, 100);
        level5.borderWidth = 2;
        level5.borderColor = Color.WHITE;
        level5.backgroundColor = Color.BLACK;
        level5.onClickEventId = GameEvents.LEVEL5;

        const level6 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[5], text: "Level 6"});
        level6.size.set(200, 100);
        level6.borderWidth = 2;
        level6.borderColor = Color.WHITE;
        level6.backgroundColor = Color.BLACK;
        level6.onClickEventId = GameEvents.LEVEL6;

        const level7 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[6], text: "Level 7"});
        level7.size.set(200, 100);
        level7.borderWidth = 2;
        level7.borderColor = Color.WHITE;
        level7.backgroundColor = Color.BLACK;
        level7.onClickEventId = GameEvents.LEVEL7;

        const level8 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[7], text: "Level 8"});
        level8.size.set(200, 100);
        level8.borderWidth = 2;
        level8.borderColor = Color.WHITE;
        level8.backgroundColor = Color.BLACK;
        level8.onClickEventId = GameEvents.LEVEL8;

        const level9 = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: this.LevelButtonPositions[8], text: "Level 9"});
        level9.size.set(200, 100);
        level9.borderWidth = 2;
        level9.borderColor = Color.WHITE;
        level9.backgroundColor = Color.BLACK;
        level9.onClickEventId = GameEvents.LEVEL9;

        const level10 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 10"});
        level10.size.set(200, 100);
        level10.borderWidth = 2;
        level10.borderColor = Color.WHITE;
        level10.backgroundColor = Color.BLACK;
        level10.onClickEventId = GameEvents.LEVEL10;

		const level11 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 11"});
        level11.size.set(200, 100);
        level11.borderWidth = 2;
        level11.borderColor = Color.WHITE;
        level11.backgroundColor = Color.BLACK;
        level11.onClickEventId = GameEvents.LEVEL11;

		const level12 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 12"});
        level12.size.set(200, 100);
        level12.borderWidth = 2;
        level12.borderColor = Color.WHITE;
        level12.backgroundColor = Color.BLACK;
        level12.onClickEventId = GameEvents.LEVEL12;

		const level13 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 13"});
        level13.size.set(200, 100);
        level13.borderWidth = 2;
        level13.borderColor = Color.WHITE;
        level13.backgroundColor = Color.BLACK;
        level13.onClickEventId = GameEvents.LEVEL13;

		const level14 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 14"});
        level14.size.set(200, 100);
        level14.borderWidth = 2;
        level14.borderColor = Color.WHITE;
        level14.backgroundColor = Color.BLACK;
        level14.onClickEventId = GameEvents.LEVEL14;

		const level15 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 15"});
        level15.size.set(200, 100);
        level15.borderWidth = 2;
        level15.borderColor = Color.WHITE;
        level15.backgroundColor = Color.BLACK;
        level15.onClickEventId = GameEvents.LEVEL15;

		const level16 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 16"});
        level16.size.set(200, 100);
        level16.borderWidth = 2;
        level16.borderColor = Color.WHITE;
        level16.backgroundColor = Color.BLACK;
        level16.onClickEventId = GameEvents.LEVEL16;

		const level17 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 17"});
        level17.size.set(200, 100);
        level17.borderWidth = 2;
        level17.borderColor = Color.WHITE;
        level17.backgroundColor = Color.BLACK;
        level17.onClickEventId = GameEvents.LEVEL17;

		const level18 = this.add.uiElement(UIElementType.BUTTON, "levelSelect",  {position: this.LevelButtonPositions[9], text: "Level 18"});
        level18.size.set(200, 100);
        level18.borderWidth = 2;
        level18.borderColor = Color.WHITE;
        level18.backgroundColor = Color.BLACK;
        level18.onClickEventId = GameEvents.LEVEL18;

        //Constructing the LevelArray for use with the page feature
        this.levelButtons.push(level1)
        this.levelButtons.push(level2)
        this.levelButtons.push(level3)
        this.levelButtons.push(level4)
        this.levelButtons.push(level5)
        this.levelButtons.push(level6)
        this.levelButtons.push(level7)
        this.levelButtons.push(level8)
        this.levelButtons.push(level9)
        this.levelButtons.push(level10)
		this.levelButtons.push(level11)
		this.levelButtons.push(level12)
		this.levelButtons.push(level13)
		this.levelButtons.push(level14)
		this.levelButtons.push(level15)
		this.levelButtons.push(level16)
		this.levelButtons.push(level17)
		this.levelButtons.push(level18)
		


        // Add menu button
        const menu = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-180, center.y-300), text: "Main Menu"});
        menu.size.set(200, 50);
        menu.borderWidth = 2;
        menu.borderColor = Color.WHITE;
        menu.backgroundColor = Color.BLACK;
        menu.onClickEventId = GameEvents.MENU;

        // Add tutorial button
        const tutorial = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x+180, center.y-300), text: "Tutorial"});
        tutorial.size.set(200, 50);
        tutorial.borderWidth = 2;
        tutorial.borderColor = Color.WHITE;
        tutorial.backgroundColor = Color.BLACK;
        tutorial.onClickEventId = GameEvents.TUTORIAL;

        // Add hard mode option
        this.hardmodeOpt = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y+300), text: "Hard Mode"});
        this.hardmodeOpt.size.set(180, 50);
        this.hardmodeOpt.borderWidth = 2;
        this.hardmodeOpt.borderColor = Color.WHITE;
        this.hardmodeOpt.backgroundColor = Color.BLACK;
        this.hardmodeOpt.onClickEventId = GameEvents.HARDMODE;

        //Add Page forward Button
        const pageForward = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 300, center.y+300), text: "Next Page"})
        pageForward.size.set(180, 50);
        pageForward.borderWidth = 2;
        pageForward.borderColor = Color.WHITE;
        pageForward.backgroundColor = Color.BLACK;
        pageForward.onClickEventId = GameEvents.PAGE_FORWARD;

        //Add Page forward Button
        const pageBackward = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 300, center.y+300), text: "Prev Page"})
        pageBackward.size.set(180, 50);
        pageBackward.borderWidth = 2;
        pageBackward.borderColor = Color.WHITE;
        pageBackward.backgroundColor = Color.BLACK;
        pageBackward.onClickEventId = GameEvents.PAGE_BACKWARD;

        /**
         * THE CONTROL SCREEN
         */
		// this.dragDiagram = this.add.sprite("drag_diagram", "background");
		// this.dragDiagram.position.copy(this.viewport.getCenter());
		// this.dragDiagram.position.add(new Vec2(-200, 0));
		// let dScale = 1.5;
		// this.dragDiagram.scale = new Vec2(dScale, dScale);
		// this.dragDiagram.visible = false;

        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 100), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: "Hold Left Click and Drag to Aim"});
        ws.textColor = Color.WHITE;
        const ad = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 50), text: "Click the 'Fire!' button to fire"});
        ad.textColor = Color.WHITE;
        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 200), text: "Back"});

        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = GameEvents.MENU;



        /**
         * THE ABOUT SCREEN
         */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 150), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        const text1 = "This game was created by Getty Lee Testa, Gleb Koslov, and Aidan Foley";
        const text2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const text3 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 100), text: text3});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = GameEvents.MENU;
	}

	resetLevel(levelNumber: number): void {
		var level : Level = Levels.getLevel(this.viewport, levelNumber);

		// Reset the pathdots
		while (this.pathDots.length != 0) {
			this.remove(this.pathDots.pop())
		}

		this.player.visible = true
		this.player.position = level.cue_pos;
		this.player._velocity = Vec2.ZERO;
		(<CuePlayerController>this.player._ai).resetAI(this.player)
		this.player.animation.play("idle");

		this.playerDead = false;
		this.playerClearStage = false;
	}

	switchLevel(levelNumber: number): void {
		var level : Level = Levels.getLevel(this.viewport, levelNumber);
		this.levelNumberLabel.text = levelNumber ? "Level " + levelNumber : "Tutorial Level"

		// Reset the pathdots
		while (this.pathDots.length != 0) {
			this.remove(this.pathDots.pop())
		}

		this.player.visible = true
		this.player.position = level.cue_pos;
		this.player._velocity = Vec2.ZERO;
		(<CuePlayerController>this.player._ai).resetAI(this.player)
		this.player.animation.play("idle");

		// Reset Asteroids
		// Add more asteroids to this.asteroids if needed
		while (this.asteroids.length < level.asteroids.length) {
			let currAsteroid = this.add.animatedSprite("asteroid", "primary")
			currAsteroid.animation.play("idle")
			currAsteroid.addAI(AsteroidAI)
			this.asteroids.push(currAsteroid)
		}
		// Remove sprites from list if needed
		// Bad way of doing this but I'm lazy
		while (this.asteroids.length > level.asteroids.length) {
			this.remove(this.asteroids.pop())
		}
		var i = 0;
		for (let asteroid of level.asteroids) {
			this.asteroids[i].position = asteroid.position
			this.asteroids[i].scale.set(asteroid.mass/150, asteroid.mass/150)
			this.asteroids[i].setCollisionShape(new Circle(Vec2.ZERO, 32*asteroid.mass/150));
			i++;
		}

		// Add more stars to this.stars if needed
		while (this.stars.length < level.stars.length) {
			let currStar = this.add.animatedSprite("star", "primary")
			currStar.animation.play("idle")
			currStar.scale.set(1.15, 1.15)
			currStar.setCollisionShape(new Circle(Vec2.ZERO, 32));
			this.stars.push(currStar)
		}
		// Remove sprites from list if needed
		// Bad way of doing this but I'm lazy
		while (this.stars.length > level.stars.length) {
			this.remove(this.stars.pop())
		}
		var i = 0;
		for (let star of level.stars) {
			this.stars[i].position = star.position
			i++;
		}

		// Reset the wormhole and wormhole pairs
		while (this.wormholes.length != 0) {
			this.remove(this.wormholes.pop())
		}
		this.wormholePairs = []
		for (let wormholePair of level.wormholePairs) {
			for (let i of [0, 1]) {
				let currWormhole = this.add.animatedSprite("wormhole", "primary")
				currWormhole.animation.play("idle");
				currWormhole.scale.set(1.3, 1.3)
				currWormhole.position = wormholePair.positions[i]
				currWormhole.setCollisionShape(new Circle(Vec2.ZERO, 50));
				wormholePair.spriteIDs[i] = currWormhole.id
				this.wormholes.push(currWormhole)
			}
			this.wormholePairs.push(wormholePair)
		}

		// Reset the black hole pos
		this.black_hole.position = level.black_hole_pos

		// Turn off the tutorial layer
		this.tutorialLayer.setHidden(true)

		this.playerDead = false;
		this.playerClearStage = false;
	}

	handleCutscene(deltaT: number): void {
		if (this.levelNumber == 0 && this.cutsceneTimer > 20) {
			this.cutsceneOver = true;
			this.tutorialLayer.setHidden(false)
			return
		}
		if (this.levelNumber !== 0 || this.cutsceneTimer > 20) {
			this.cutsceneOver = true;
			this.tutorialLayer.setHidden(true)
			return
		}

		this.cutsceneTimer += deltaT
		if (this.cutsceneTimer > 20 && this.cutsceneScreen == 2) {
			this.cutscene2Layer.setHidden(true)
			this.gameLayer.setHidden(false)
			this.uiLayer.setHidden(false)
			this.backgroundLayer.setHidden(false)
		} else if (this.cutsceneTimer > 10 && this.cutsceneScreen == 2) {
			this.cutscene1Layer.setHidden(true)
			this.cutscene2Layer.setHidden(false)
			this.cs2.tweens.play("fadeIn")
		} else if (this.cutsceneTimer > 8 && this.cutsceneScreen == 1) {
			this.cs1.tweens.play("fadeOut")
			this.cutsceneScreen = 2
		}
	}

	handleEvents() {
		while(this.receiver.hasNextEvent()){
			let event = this.receiver.getNextEvent();

			if (event.type === GameEvents.PLANET_COLLISION) {
				this.playerDead = true;
			} else if (event.type === GameEvents.PLANET_HIT_WORMHOLE) {
				let level : Level = Levels.getLevel(this.viewport, this.levelNumber);
				console.log(level)
				let id = event.data.get("wormholeID")
				console.log("HIT WORMHOLE")

				console.log("Checking wormhole id " + id)
				for (let wormholePair of this.wormholePairs) {
					console.log("CHECKING PAIR with ids " + wormholePair.spriteIDs[0] + " and " + wormholePair.spriteIDs[1])
					if (wormholePair.spriteIDs.includes(id)) {
						console.log("FOUND PAIR")
						if (wormholePair.spriteIDs[0] === id)
							this.player.position.copy(wormholePair.positions[1])
						else
							this.player.position.copy(wormholePair.positions[0])
					}
				}
			} else if (event.type === GameEvents.PLANET_HIT_BLACKHOLE) {
				this.playerClearStage = true;
			} else if (event.type === GameEvents.PLANET_OOB) {
				this.playerDead = true;
            } else if (event.type === GameEvents.LEVEL_FAIL) {
				this.resetLevel(this.levelNumber)
				this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"})
				this.tryAgain.setHidden(false)
				this.gameLayer.setHidden(true)
				this.uiLayer.setHidden(true)
				this.tutorialLayer.setHidden(true)
				this.pathdotLayer.setHidden(true)
				this.playerDead = true;
			} else if (event.type === GameEvents.LEVEL_PASS) {
				this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"})
				this.nextLevel.setHidden(false)
				this.gameLayer.setHidden(true)
				this.tutorialLayer.setHidden(true)
				this.uiLayer.setHidden(true)
				this.pathdotLayer.setHidden(true)
			} else if (event.type === GameEvents.MENU) {
				this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"})
				this.tryAgain.setHidden(true)
				this.nextLevel.setHidden(false)
				this.gameLayer.setHidden(true)
				this.tutorialLayer.setHidden(true)
				this.uiLayer.setHidden(true)
				this.pathdotLayer.setHidden(true)
				this.mainMenu.setHidden(false)
				this.levelSelect.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
				// this.logo.visible = true;
				// this.dragDiagram.visible = false;
			} else if (event.type === GameEvents.NEXT_LEVEL) {
				this.levelNumber += 1
				this.switchLevel(this.levelNumber)
				this.gameLayer.setHidden(false)
				this.uiLayer.setHidden(false)
				this.pathdotLayer.setHidden(false)
				this.nextLevel.setHidden(true)
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
			} else if (event.type === GameEvents.TRY_AGAIN) {
				if (this.levelNumber == 0) {
					this.tutorialLayer.setHidden(false)
				}
				if (this.playerDead) {
					this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
				}
				this.resetLevel(this.levelNumber)
				this.pauseLayer.setHidden(true)
				this.paused = false;
				(<CuePlayerController>this.player._ai).paused = false;
				this.gameLayer.setHidden(false)
				this.pathdotLayer.setHidden(false)
				this.uiLayer.setHidden(false)
				this.tryAgain.setHidden(true)
			} else if (event.type === GameEvents.PAUSE) {
				if (this.paused) {
					this.pauseLayer.setHidden(true)
					this.levelNumber == 0 ? this.tutorialLayer.setHidden(false) : this.levelNumber;
					this.paused = false;
					(<CuePlayerController>this.player._ai).paused = false;
				} else {
					this.pauseLayer.setHidden(false)
					this.tutorialLayer.setHidden(true)
					this.paused = true;
					(<CuePlayerController>this.player._ai).paused = true;
				}
			}
			if (event.type === GameEvents.HARDMODE) {
                if (this.hardMode) {
                    this.hardmodeOpt.backgroundColor = Color.BLACK
                    this.hardMode = false
                } else {
                    this.hardmodeOpt.backgroundColor = Color.RED
                    this.hardMode = true
                }
            }
			if (event.type === GameEvents.PAGE_FORWARD){
                //Add logic for moving the original buttons to -5000, -5000
                if(this.levelIndex + 9 < this.levelButtons.length){
                    console.log("I'm here!")
                    for(let i  = 0; i < Math.min(9, this.levelButtons.length - this.levelIndex); i++)
                    {
                        this.levelButtons[i + this.levelIndex].position = this.LevelButtonPositions[9]
                    }
                    this.levelIndex += 9
                    for(let i = 0; i < this.levelButtons.length - this.levelIndex; i++)
                    {
                        this.levelButtons[i + this.levelIndex].position = this.LevelButtonPositions[i]
                    }
                }
            }
            if (event.type === GameEvents.PAGE_BACKWARD) {
                //Add logic for moving the original buttons to -5000, -5000
                if(this.levelIndex != 0) {
                    console.log("I'm here!")
                    for(let i  = 0; i < Math.min(9, this.levelButtons.length - this.levelIndex); i++)
                    {
                        this.levelButtons[i + this.levelIndex].position = this.LevelButtonPositions[9]
                    }
                    this.levelIndex -= 9
                    for(let i = 0; i < Math.min(9, this.levelButtons.length - this.levelIndex); i++)
                    {
                        this.levelButtons[i + this.levelIndex].position = this.LevelButtonPositions[i]
                    }
                }
            }
			if(event.type === GameEvents.CONTROLS){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
				// this.logo.visible = false;
				// this.dragDiagram.visible = true;
            }

            if(event.type === GameEvents.ABOUT){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
				// this.logo.visible = false;
				// this.dragDiagram.visible = false;
            }

            if(event.type === GameEvents.MENU){
				this.resetLevel(this.levelNumber)
				this.playing = false;
                this.mainMenu.setHidden(false);
				this.pauseLayer.setHidden(true)
				this.arrowLayer.setHidden(true);
                this.levelSelect.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
				this.nextLevel.setHidden(true);
				this.tryAgain.setHidden(true);
				// this.logo.visible = true;
				// this.dragDiagram.visible = false;
            }

			if(event.type === GameEvents.LEVEL_SELECT){
				this.levelSelect.setHidden(false)
				this.mainMenu.setHidden(true);
				// this.logo.visible = false;
			}

			if(event.type === GameEvents.TUTORIAL){
				this.levelNumber = 0;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
				if (this.cutsceneTimer < 20) {
					this.backgroundLayer.setHidden(true)
					this.gameLayer.setHidden(true)
					this.uiLayer.setHidden(true)
					this.cutscene1Layer.setHidden(false)
					this.cutsceneScreen = 1;
					this.cutsceneOver = false
				}
			}
			if (event.type === GameEvents.LEVEL1){
				this.levelNumber = 1;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL2){
				this.levelNumber = 2;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL3){
				this.levelNumber = 3;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL4){
				this.levelNumber = 4;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL5){
				this.levelNumber = 5;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL6){
				this.levelNumber = 6;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL7){
				this.levelNumber = 7;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL8){
				this.levelNumber = 8;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL9){
				this.levelNumber = 9;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL10){
				this.levelNumber = 10;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if (event.type === GameEvents.LEVEL11){
				this.levelNumber = 11;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL12){
				this.levelNumber = 12;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL13){
				this.levelNumber = 13;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL14){
				this.levelNumber = 14;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
            } else if(event.type === GameEvents.LEVEL15){
				this.levelNumber = 15;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL16){
				this.levelNumber = 16;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL17){
				this.levelNumber = 17;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			} else if(event.type === GameEvents.LEVEL18){
				this.levelNumber = 18;
				this.switchLevel(this.levelNumber)
				this.gameplaySceneSwitch()
			}
		}
	}

	gameplaySceneSwitch() {
		this.gameLayer.setHidden(false)
		this.arrowLayer.setHidden(false);
		this.uiLayer.setHidden(false)
		this.pathdotLayer.setHidden(false)
		this.nextLevel.setHidden(true)
		this.levelSelect.setHidden(true);
		this.mainMenu.setHidden(true)
		this.paused = false;
		this.playing = true;
		this.levelNumberLabel.textColor = this.hardMode ? Color.RED : Color.YELLOW;
		(<CuePlayerController>this.player._ai).paused = false;
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
	}

	handleCollisions(){
		// Check for collision with black hole
		if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>this.black_hole.collisionShape)) {
			this.emitter.fireEvent(GameEvents.PLANET_HIT_BLACKHOLE, {id: this.player.id})
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "clear", loop: false, holdReference: false});
		}
		// Check for collision with asteroid(s)
		for (let asteroid of this.asteroids) {
			if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>asteroid.collisionShape)) {
				this.emitter.fireEvent(GameEvents.PLANET_COLLISION, {id: this.player.id})
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "planet_explode", loop: false, holdReference: false});
			}
		}
		// Check for collision with star(s)
		for (let star of this.stars) {
			if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>star.collisionShape)) {
				this.emitter.fireEvent(GameEvents.PLANET_COLLISION, {id: this.player.id})
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "planet_explode", loop: false, holdReference: false});
			}
		}

		// Check for collision with wormholes
		let touchedWormhole = false
		for (let wormhole of this.wormholes) {
			if (Base_Scene.checkCircletoCircleCollision(<Circle>this.player.collisionShape, <Circle>wormhole.collisionShape)) {
				if(!this.playerJustTouchedWormhole)
					this.emitter.fireEvent(GameEvents.PLANET_HIT_WORMHOLE, {playerID: this.player.id, wormholeID: wormhole.id})
				touchedWormhole = true
				this.playerJustTouchedWormhole = true
			}
		}
		if (!touchedWormhole)
			this.playerJustTouchedWormhole = false

		const viewportCenter = this.viewport.getCenter().clone();
		const paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.WORLD_PADDING.scaled(2));

		if (this.checkOffScreen(this.player, viewportCenter, paddedViewportSize)) {
			this.emitter.fireEvent(GameEvents.PLANET_OOB, {id: this.player.id})
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "oob", loop: false, holdReference: false});
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

	render(): void {
        // Get the visible set of nodes
        let visibleSet = this.sceneGraph.getVisibleSet();

        // Add parallax layer items to the visible set (we're rendering them all for now)
        this.parallaxLayers.forEach(key => {
            let pLayer = this.parallaxLayers.get(key);
            for(let node of pLayer.getItems()){
                if(node instanceof CanvasNode){
                    visibleSet.push(node);
                }
            }
        });

        // Send the visible set, tilemaps, and uiLayers to the renderer
        this.renderingManager.render(visibleSet, this.tilemaps, this.uiLayers);

		var level : Level = Levels.getLevel(this.viewport, this.levelNumber);
		if (!this.playerClearStage && !this.playerDead && !this.hardMode && !this.paused && this.cutsceneOver && this.playing) {
			for (let asteroid of level.asteroids) {
				Debug.drawCircle(asteroid.position, asteroid.mass/1.25, false, Color.WHITE);
			}
		}

        let nodes = this.sceneGraph.getAllNodes();
        this.tilemaps.forEach(tilemap => tilemap.visible ? nodes.push(tilemap) : 0);
        Debug.setNodes(nodes);
    }
}
