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
import MainMenu from "./Main_Menu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";


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

	private paused = false;

	// TESTA - This will be our array for all asteroids in the scene.
	private asteroids: Array<AnimatedSprite> = new Array();

	private stars: Array<AnimatedSprite> = new Array();

	// TESTA - IDK if we'll even do 2 planet gameplay so this might be unused
	private planets: Array<AnimatedSprite> = new Array(2);
	private wormholes: Array<AnimatedSprite> = new Array();
	private wormholePairs: Array<WormholePair> = new Array();
	private black_hole: Sprite

	private arrow: Sprite

	private backgroundStars: Array<Rect> = new Array();
	private backgroundStarAlphaDirections: Array<boolean> = new Array();

	private cs1: Sprite;
	private cs2: Sprite;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);

	// Timer for the tutorial cutscene
	private cutsceneTimer = 0;
	private cutsceneFade1: Rect;
	private cutsceneFade2: Rect;

	// Each layer used for the game
	private nextLevel: Layer;
	private tryAgain: Layer;
	private gameLayer: Layer;
	private uiLayer: Layer;
	private backgroundLayer: Layer;
	private cutscene1Layer: Layer;
	private cutscene2Layer: Layer;
	private pauseLayer: Layer;


	initScene(init: Record<string, any>): void {
		this.levelNumber = init.levelNum
	}

	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		// Load in the planet spritesheet
		this.load.spritesheet("star", "hw2_assets/spritesheets/star.json");
		this.load.spritesheet("asteroid", "hw2_assets/spritesheets/asteroid.json");
		this.load.spritesheet("wormhole", "hw2_assets/spritesheets/wormhole.json")

		this.load.spritesheet("green_orange_planet_player", "hw2_assets/spritesheets/green_orange_planet.json")
		this.load.spritesheet("blue_teal_planet_player", "hw2_assets/spritesheets/blue_teal_planet.json")
		this.load.spritesheet("pink_yellow_planet_player", "hw2_assets/spritesheets/pink_yellow_planet.json")

		this.load.image("black_hole", "hw2_assets/sprites/black_hole.png")
		this.load.image("arrow", "hw2_assets/sprites/Arrow.png")

		// Load in the sfx
		this.load.audio("fire", "hw2_assets/sfx/fire.wav")
		this.load.audio("planet_explode", "hw2_assets/sfx/planet_explode.wav")
		this.load.audio("oob", "hw2_assets/sfx/oob.wav")
		this.load.audio("music", "hw2_assets/music/intro.mp3")

		// Load in the cutscene images for the tutorial
		this.load.image("cutscene1", "hw2_assets/cutscene/Space Billiards CS1.png")
		this.load.image("cutscene2", "hw2_assets/cutscene/Space Billiards CS2.png")
	}

	unloadScene(): void {
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
			rect.position.set(x, y);
			rect.size.set(size, size);
			rect.color.set(255, 255, 255, Math.random());
			this.backgroundStars.push(rect as Rect);
			this.backgroundStarAlphaDirections.push(Math.random() < 0.5);
		}

		
		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.gameLayer = this.addLayer("primary", 5);

		// Initialize the cues, asteroids, and black hole
		this.initializeObjects(this.levelNumber);
		
		// Initialize the UI
		this.initializeUI();

		this.initializeLayers();

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
		this.receiver.subscribe(GameEvents.UNPAUSE)


		// If we've selected the Tutorial Level
		if (this.levelNumber === 0) {
			this.backgroundLayer.setHidden(true)
			this.gameLayer.setHidden(true)
			this.uiLayer.setHidden(true)

			this.cutscene1Layer.setHidden(false)
		}

		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "music", loop: true, holdReference: true});
	}

	updateScene(deltaT: number){
		this.handleEvents();
		if (this.paused) {
			return
		}

		this.handleCutscene(deltaT);

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
				if(star.color.a <= 0) {
					star.color.a = 0;
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

		for (let asteroid of level.asteroids) {
			if(asteroid.position.distanceTo(this.player.position) > asteroid.mass)
				continue;
			let deltaV = new Vec2();
			deltaV.copy(asteroid.position);
			deltaV.sub(this.player.position);

			let distance = deltaV.mag();

			deltaV.normalize();
			deltaV.scale((asteroid.mass - distance + 20) * 3);

			(<CuePlayerController>this.player.ai).assignedVelocity.add(deltaV.scaled(deltaT))
		}

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

		this.player = this.add.animatedSprite("green_orange_planet_player", "primary");
		this.player.addPhysics()
		this.player.position = level.cue_pos;
		this.player._velocity = Vec2.ZERO
		this.player.animation.play("idle");
		this.player.setCollisionShape(new Circle(Vec2.ZERO, 32))

		// Adding a new layer just for the arrow
		this.addLayer("arrow", 6);
		this.arrow = this.add.sprite("arrow", "arrow")
		this.arrow.isCollidable = false;
		this.arrow.visible = false;


		this.player.addAI(CuePlayerController, {owner: this.player, arrow: this.arrow});

		for (let asteroid of level.asteroids) {
			let currAsteroid = this.add.animatedSprite("asteroid", "primary")
			currAsteroid.animation.play("idle")
			currAsteroid.position = asteroid.position
			currAsteroid.addAI(AsteroidAI)
			currAsteroid.setCollisionShape(new Circle(Vec2.ZERO, 32));
			this.asteroids.push(currAsteroid)
		}

		for (let star of level.stars) {
			let currStar = this.add.animatedSprite("star", "primary")
			currStar.animation.play("idle")
			currStar.position = star.position
			currStar.scale.set(1.4, 1.4)
			currStar.setCollisionShape(new Circle(Vec2.ZERO, 32));
			this.stars.push(currStar)
		}

		let colorIndex = 0
		let colors = ["white", "red", "blue", "green"]
		for (let wormholePair of level.wormholePairs) {
			let color = colors[colorIndex % (colors.length+1)]
			colorIndex++
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

		this.black_hole = this.add.sprite("black_hole", "primary")
		this.black_hole.setCollisionShape(new Circle(Vec2.ZERO, 50))
		this.black_hole.position = level.black_hole_pos
		// TESTA - Bc the sprite I made was small, scale it here. We won't do this with the final sprite
		this.black_hole.scale.set(1, 1)
	}

	/**
	 * Creates all of our UI layer components
	 */
	initializeUI(): void {
		// UILayer stuff
		this.uiLayer = this.addUILayer("gameUi");

		const center = this.viewport.getCenter();

		// Fire Button
		const fire = this.add.uiElement(UIElementType.BUTTON, "gameUi", {position: new Vec2(center.x, center.y - 100), text: "Fire!"});
        fire.size.set(200, 50);
		fire.position = new Vec2(1080,750)
        fire.borderWidth = 2;
        fire.borderColor = Color.ORANGE;
        fire.backgroundColor = Color.BLACK;
        fire.onClickEventId = GameEvents.FIRE_BALL;

		// Pause Button - not functional yet
		const pause = this.add.uiElement(UIElementType.BUTTON, "gameUi", {position: new Vec2(center.x, center.y - 100), text: "Pause"});
        pause.size.set(200, 50);
		pause.position = new Vec2(125,750)
        pause.borderWidth = 2;
        pause.borderColor = Color.WHITE;
        pause.backgroundColor = Color.BLACK;
        pause.onClickEventId = GameEvents.PAUSE;
	}

	/**
	 * Creates object pools for our items.
	 * For more information on object pools, look here:
	 * https://gameprogrammingpatterns.com/object-pool.html
	 */
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

		// Unpause
		const unpause = this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x-200, center.y+100), text: "Unpause"});
		unpause.size.set(230, 50);
		unpause.borderWidth = 2;
		unpause.borderColor = Color.WHITE;
		unpause.backgroundColor = Color.BLACK;
		unpause.onClickEventId = GameEvents.UNPAUSE;

		// Return to Menu
		retMenu = this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x+200, center.y+100), text: "Return to Menu"});
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

		this.cutscene2Layer = this.addLayer("cutscene2Layer", 3)
		this.cutscene2Layer.setHidden(true)

		this.cs2 = this.add.sprite("cutscene2", "cutscene2Layer")
		this.cs2.position = this.viewport.getCenter()

		let viewportSize = new Vec2(this.viewport.getHalfSize().x * 2,
									this.viewport.getHalfSize().y * 2);
		this.cutsceneFade1 = this.add.graphic("RECT", "cutscene1Layer",
										{position: this.viewport.getCenter(),
										 size: viewportSize}) as Rect;
		this.cutsceneFade2 = this.add.graphic("RECT", "cutscene2Layer",
										{position: this.viewport.getCenter(),
										 size: viewportSize}) as Rect;

		let c = new Color(0, 0, 0, 1)
		this.cutsceneFade1.color = c;
		this.cutsceneFade2.color = c;
	}

	resetLevel(levelNumber: number): void {
		var level : Level = Levels.getLevel(this.viewport, levelNumber);

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

		this.player.visible = true
		this.player.position = level.cue_pos;
		this.player._velocity = Vec2.ZERO;
		(<CuePlayerController>this.player._ai).resetAI(this.player)
		this.player.animation.play("idle");

		// Reset Asteroids
		if (level.asteroids.length > this.asteroids.length) {
			// Add more asteroids to this.asteroids
			while (this.asteroids.length < level.asteroids.length) {
				let currAsteroid = this.add.animatedSprite("asteroid", "primary")
				currAsteroid.animation.play("idle")
				currAsteroid.addAI(AsteroidAI)
				currAsteroid.setCollisionShape(new Circle(Vec2.ZERO, 32));
				this.asteroids.push(currAsteroid)
			}
		} else if (level.asteroids.length < this.asteroids.length) {
			// Remove sprites from list
			// Bad way of doing this but I'm lazy
			while (this.asteroids.length > level.asteroids.length) {
				this.remove(this.asteroids.pop())
			}
		}
		var i = 0;
		for (let asteroid of level.asteroids) {
			this.asteroids[i].position = asteroid.position
			i++;
		}

		// Reset Stars
		if (level.stars.length > this.stars.length) {
			// Add more stars to this.stars
			while (this.stars.length < level.stars.length) {
				let currStar = this.add.animatedSprite("star", "primary")
				currStar.animation.play("idle")
				currStar.scale.set(1.4, 1.4)
				currStar.setCollisionShape(new Circle(Vec2.ZERO, 32));
				this.stars.push(currStar)
			}
		} else if (level.stars.length < this.stars.length) {
			// Remove sprites from list
			// Bad way of doing this but I'm lazy
			while (this.stars.length > level.stars.length) {
				this.remove(this.stars.pop())
			}
		}
		var i = 0;
		for (let star of level.stars) {
			this.stars[i].position = star.position
			i++;
		}


		// TODO - Need to do wormhole stuff here


		this.black_hole.position = level.black_hole_pos


		this.playerDead = false;
		this.playerClearStage = false;
	}

	handleCutscene(deltaT: number): void {
		if (this.levelNumber !== 0 || this.cutsceneTimer > 16) {
			return
		}
		let interval = 8;
		let fadeTime = 1;

		this.cutsceneTimer += deltaT

		this.cutsceneFade1.color.a = 0;
		this.cutsceneFade2.color.a = 0;

		if(this.cutsceneTimer <= interval) {
			if(this.cutsceneTimer > interval - fadeTime) {
				let amountThrough = ((this.cutsceneTimer - (interval-fadeTime)) / fadeTime);
				if(amountThrough < 0) amountThrough = 0;
				if(amountThrough > 1) amountThrough = 1;

				this.cutsceneFade1.color.a = amountThrough;
			}
		}
		else if(this.cutsceneTimer <= interval*2) {
			if(this.cutsceneTimer > interval*2 - fadeTime) {
				let amountThrough = ((this.cutsceneTimer - (interval*2-fadeTime)) / fadeTime);
				if(amountThrough < 0) amountThrough = 0;
				if(amountThrough > 1) amountThrough = 1;

				this.cutsceneFade2.color.a = amountThrough;
			}
		}

		if (this.cutsceneTimer > interval*2) {
			this.cutscene2Layer.setHidden(true)
			this.gameLayer.setHidden(false)
			this.uiLayer.setHidden(false)
			this.backgroundLayer.setHidden(false)
		} else if (this.cutsceneTimer > interval) {
			this.cutscene1Layer.setHidden(true)
			this.cutscene2Layer.setHidden(false)
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
				this.tryAgain.setHidden(false)
				this.gameLayer.setHidden(true)
				this.uiLayer.setHidden(true)
			} else if (event.type === GameEvents.LEVEL_PASS) {
				this.nextLevel.setHidden(false)
				this.gameLayer.setHidden(true)
				this.uiLayer.setHidden(true)
			} else if (event.type === GameEvents.MENU) {
				this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "music"})
				this.sceneManager.changeToScene(MainMenu)
			} else if (event.type === GameEvents.NEXT_LEVEL) {
				this.levelNumber += 1
				this.switchLevel(this.levelNumber)
				this.gameLayer.setHidden(false)
				this.uiLayer.setHidden(false)
				this.nextLevel.setHidden(true)
			} else if (event.type === GameEvents.TRY_AGAIN) {
				this.resetLevel(this.levelNumber)
				this.gameLayer.setHidden(false)
				this.uiLayer.setHidden(false)
				this.tryAgain.setHidden(true)
			} else if (event.type === GameEvents.PAUSE) {
				this.pauseLayer.setHidden(false)
				this.paused = true;
				(<CuePlayerController>this.player._ai).paused = true;
			} else if (event.type === GameEvents.UNPAUSE) {
				this.pauseLayer.setHidden(true)
				this.paused = false;
				(<CuePlayerController>this.player._ai).paused = false;
			}
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
		/*
		for(let i = 0; i < this.backgroundStars.length; i++) {
			let star: AABB = this.backgroundStars[i];
			(this.renderingManager as CanvasRenderer).ctx 
			Debug.drawBox(star.center, star.halfSize, true,
						  new Color(255, 255, 255, this.backgroundStarAlphas[i]));
		}
		*/

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
		if (!this.playerClearStage && !this.playerDead) {
			for (let asteroid of level.asteroids) {
				Debug.drawCircle(asteroid.position, asteroid.mass, false, Color.WHITE);
			}
		}

        let nodes = this.sceneGraph.getAllNodes();
        this.tilemaps.forEach(tilemap => tilemap.visible ? nodes.push(tilemap) : 0);
        Debug.setNodes(nodes);
    }
}
