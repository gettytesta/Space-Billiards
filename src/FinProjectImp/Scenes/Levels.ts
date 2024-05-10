import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Level, { Asteroid, WormholePair, Star } from "./LevelType";

// bhp - Position of the black hole
// cp - Position of the cue

// This class will simply hold getters that get a Level class with the proper data
export default class Levels {
	static getLevel(viewport:Viewport, levelNum:number) : Level {
		switch (levelNum) {
			case 0:
				return this.getTutorialLevel(viewport)
			case 1:
				return this.getLevel1(viewport)
			case 2:
				return this.getLevel2(viewport)
			case 3:
				return this.getLevel3(viewport)
			case 4:
				return this.getLevel4(viewport)
			case 5:
				return this.getLevel5(viewport)
			case 6:
				return this.getLevel6(viewport)
			case 7:
				return this.getLevel7(viewport)
			case 8:
				return this.getLevel8(viewport)
			case 9:
				return this.getLevel9(viewport)
			case 10:
				return this.getLevel10(viewport)
			case 11:
				return this.getLevel11(viewport)
			case 12:
				return this.getLevel12(viewport)
			case 13:
				return this.getLevel13(viewport)
			case 14:
				return this.getLevel14(viewport)
			case 15:
				return this.getLevel15(viewport)
			case 16:
				return this.getLevel16(viewport)
			case 17:
				return this.getLevel17(viewport)
			case 18:
				return this.getLevel18(viewport)
			case 19:
				return this.getLevel19(viewport)
			case 20:
				return this.getLevel20(viewport)
			case 21:
				return this.getLevel21(viewport)
			case 22:
				return this.getLevel22(viewport)
			case 23:
				return this.getLevel23(viewport)
			case 24:
				return this.getLevel24(viewport)
			case 25:
				return this.getLevel25(viewport)
			case 26:
				return this.getLevel26(viewport)
			case 27:
				return this.getLevel27(viewport)
			default:
				// Random level selected
				if (levelNum > 99) {
					return this.getRandomGenLevel(viewport)
				}
				return this.getLevel1(viewport)
		}
	}

	/**
	 * 	TESTA - For the time being, I wont be adding any wormholes to the levels. They'll be added once we get the sprite worked out.
	 */

	static getTutorialLevel(viewport:Viewport) : Level {
		var bhp = new Vec2(180, viewport.getCenter().y+120)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x-400, 200), 100)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, 200))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x+320, 200),
																	new Vec2(viewport.getCenter().x+400, 200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y+120)
		return new Level(bhp, asteroids, stars, wormholePairs, cp);
	}

	// No obstacles
	static getLevel1(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, new Array(), new Array(), new Array(), cp);
	}

	// One asteroid, curve around it
	static getLevel2(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 180)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), new Array(), cp);
	}

	// One asteroid, one star
	static getLevel3(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y-180)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 180)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-150))]
		// var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(600, 700), new Vec2(600, 200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Two asteroids, gravity cancels
	static getLevel4(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-100), 180),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+100), 180)]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), new Array(), cp);
	}

	// Wall of stars, tough curve
	static getLevel5(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y+100)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+50, viewport.getCenter().y), 150)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y-350)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y-250)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y-140)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y+140)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y+250)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y+350)),]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Two asteroids, star in middle, hard bend
	static getLevel6(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-100), 180),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+100), 180)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Wormhole w/ bend
	static getLevel7(viewport:Viewport) : Level {
		var bhp = new Vec2(110, viewport.getCenter().y-310)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(300, viewport.getCenter().y-30), 150)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y-350)),
									new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y-210)),
									new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y-70)),
									new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y+70)),
									new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y+210)),
									new Star(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y+350)),]

		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x+350, viewport.getCenter().y-240),
																	 new Vec2(420, viewport.getCenter().y+200))]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y+140)
		return new Level(bhp, asteroids, stars, wormholePairs, cp);
	}

	// Two asteroid, curve around both
	static getLevel8(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+200, viewport.getCenter().y-50), 200),
											new Asteroid(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y+50), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y+180))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+100)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Two asteroid, curve around both, harder
	static getLevel9(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+220, viewport.getCenter().y-50), 200),
											new Asteroid(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y+50), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+220, viewport.getCenter().y+100))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+100)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	static getLevel10(viewport:Viewport) : Level {
		var cp = new Vec2(120, viewport.getCenter().y)
		var bhp = new Vec2(1000, viewport.getCenter().y+100)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(300, viewport.getCenter().y), 150),
											new Asteroid(new Vec2(900, viewport.getCenter().y+200), 200)]
		var stars : Array<Star> = [new Star(new Vec2(700, viewport.getCenter().y)),
								new Star(new Vec2(700, viewport.getCenter().y+100)),
								new Star(new Vec2(700, viewport.getCenter().y-100)),
								new Star(new Vec2(700, viewport.getCenter().y-200)),
								new Star(new Vec2(700, viewport.getCenter().y+200)),
								new Star(new Vec2(700, viewport.getCenter().y-300)),
								new Star(new Vec2(700, viewport.getCenter().y+300))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(400, viewport.getCenter().y),
																	new Vec2(800, viewport.getCenter().y+300))]
		return new Level(bhp , asteroids, stars, wormholePairs, cp)
	}

	// Three asteroids, overlapping
	static getLevel11(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-100, viewport.getCenter().y-300)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+110, viewport.getCenter().y-100), 180),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+100), 180),
											new Asteroid(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y-80), 180)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+200, viewport.getCenter().y-200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y+220)
		return new Level(bhp, asteroids, stars, new Array(), cp);
}


	static getLevel12(viewport:Viewport) : Level {

		var cp = new Vec2(120, viewport.getCenter().y)
		var bhp = new Vec2(425, viewport.getCenter().y-40)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(775, viewport.getCenter().y), 450)]
		var stars : Array<Star> = [new Star(new Vec2(250, viewport.getCenter().y))]
		return new Level(bhp , asteroids, stars, new Array(), cp)
	}
	static getLevel13(viewport:Viewport) : Level {
		var cp = new Vec2(120, viewport.getCenter().y+ 300)
		var bhp = new Vec2(570, viewport.getCenter().y+300)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(530, viewport.getCenter().y-150), 200)]
		var stars : Array<Star> = [new Star(new Vec2(200, viewport.getCenter().y+300)),
								   new Star(new Vec2(255, viewport.getCenter().y+225)),
								   new Star(new Vec2(310, viewport.getCenter().y+150)),
								   new Star(new Vec2(365, viewport.getCenter().y+75)),
								   new Star(new Vec2(420, viewport.getCenter().y)),
								   new Star(new Vec2(475, viewport.getCenter().y-75)),
								   ]
		return new Level(bhp , asteroids, stars, new Array(), cp)
	}
	static getLevel14(viewport:Viewport) : Level {
		var cp = new Vec2(120, viewport.getCenter().y)
		var bhp = new Vec2(950, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = []
		var stars : Array<Star> = [new Star(new Vec2(500, viewport.getCenter().y)),
								new Star(new Vec2(500, viewport.getCenter().y+100)),
								new Star(new Vec2(500, viewport.getCenter().y-100)),
								new Star(new Vec2(500, viewport.getCenter().y-200)),
								new Star(new Vec2(500, viewport.getCenter().y+200)),
								new Star(new Vec2(500, viewport.getCenter().y-300)),
								new Star(new Vec2(500, viewport.getCenter().y+300)),
								new Star(new Vec2(950, viewport.getCenter().y-200)),
								new Star(new Vec2(950, viewport.getCenter().y+200))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(300, viewport.getCenter().y-200),
																	new Vec2(700, viewport.getCenter().y+200)),
												   new WormholePair(new Vec2(300, viewport.getCenter().y),
																	new Vec2(700, viewport.getCenter().y-200)),
												   new WormholePair(new Vec2(300, viewport.getCenter().y+200),
																	new Vec2(700, viewport.getCenter().y))]
		return new Level(bhp , asteroids, stars, wormholePairs, cp)
	}
	static getLevel15(viewport:Viewport) : Level {		
		var cp = new Vec2(viewport.getCenter().x - 360, viewport.getCenter().y+200)
		var bhp = new Vec2(viewport.getCenter().x + 300, viewport.getCenter().y+200)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+220), 450)]
		var stars : Array<Star> = [new Star(new Vec2(400, viewport.getCenter().y+200)),
								   new Star(new Vec2(500, viewport.getCenter().y)),
								   new Star(new Vec2(700, viewport.getCenter().y))
								  ]
		return new Level(bhp , asteroids, stars, new Array(), cp)
	}

	// One giant asteroid, curve all the way around it
	static getLevel16(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y-200)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 300)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+350, viewport.getCenter().y))]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y+200)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Aim into wormholes perfectly
	static getLevel17(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-350, viewport.getCenter().y+250)
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-420, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x-280, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x-420, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x-280, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x+280, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x+420, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+280, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y)),
									new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y+250))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x-350, viewport.getCenter().y-250),
																	new Vec2(viewport.getCenter().x+350, viewport.getCenter().y+220))]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y-250)
		return new Level(bhp, new Array(), stars, wormholePairs, cp);
	}

	// Aim perfectly into 'star hole'
	static getLevel18(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-450, viewport.getCenter().y-180)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+200, viewport.getCenter().y-40), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-450, viewport.getCenter().y-280)),
									new Star(new Vec2(viewport.getCenter().x-450, viewport.getCenter().y-80)),
									new Star(new Vec2(viewport.getCenter().x-350, viewport.getCenter().y-260)),
									new Star(new Vec2(viewport.getCenter().x-350, viewport.getCenter().y-100))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+200)
		return new Level(bhp, asteroids, stars, new Array(), cp);
 	}

	// Wormhole into tight bend (Kamil)
	static getLevel19(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-450, viewport.getCenter().y+250)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+200), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-500, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x-400, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x-300, viewport.getCenter().y+100))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x-450, viewport.getCenter().y-250),
																	new Vec2(viewport.getCenter().x+450, viewport.getCenter().y+220))]
		var cp = new Vec2(viewport.getCenter().x, viewport.getCenter().y-100)
		return new Level(bhp, asteroids, stars, wormholePairs, cp);
 	}

	// Square bend (Kamil)
	static getLevel20(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+280)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y-140), 250),
											new Asteroid(new Vec2(viewport.getCenter().x-130, viewport.getCenter().y+170), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+480, viewport.getCenter().y)),
									new Star(new Vec2(viewport.getCenter().x+370, viewport.getCenter().y)),
									new Star(new Vec2(viewport.getCenter().x+260, viewport.getCenter().y))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y-300)
		return new Level(bhp, asteroids, stars, new Array(), cp);
 	}

	// Wormhole into tight asteroid bend w/ bh (Kamil)
	 static getLevel21(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x+140, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 250)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x+190, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+190, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x+240, viewport.getCenter().y)),
									new Star(new Vec2(viewport.getCenter().x+100, viewport.getCenter().y-100))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x+150, viewport.getCenter().y-250),
																	new Vec2(viewport.getCenter().x-350, viewport.getCenter().y+220))]
		var cp = new Vec2(viewport.getCenter().x+250, viewport.getCenter().y+250)
		return new Level(bhp, asteroids, stars, wormholePairs, cp);
 	}

	// Swirl into goal (Kinda Kamil)
	static getLevel22(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x, viewport.getCenter().y+260)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 480)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-160)),
									new Star(new Vec2(viewport.getCenter().x+110, viewport.getCenter().y+110)),
									new Star(new Vec2(viewport.getCenter().x+190, viewport.getCenter().y+190)),
									new Star(new Vec2(viewport.getCenter().x+270, viewport.getCenter().y+270))]
		var cp = new Vec2(viewport.getCenter().x+480, viewport.getCenter().y+200)
		return new Level(bhp, asteroids, stars, new Array(), cp);
 	}

	// Idek what to call it
	static getLevel23(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x+480, viewport.getCenter().y+220)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+220, viewport.getCenter().y+60), 250),
											new Asteroid(new Vec2(viewport.getCenter().x-200, viewport.getCenter().y-100), 250)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-480, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+480, viewport.getCenter().y+60))]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(viewport.getCenter().x-480, viewport.getCenter().y+60),
																	new Vec2(viewport.getCenter().x+480, viewport.getCenter().y-100))]
		var cp = new Vec2(viewport.getCenter().x-480, viewport.getCenter().y-250)
		return new Level(bhp, asteroids, stars, wormholePairs, cp);
 	}

	// Tons of cancelling gravity circles
	static getLevel24(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-450, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x-300, viewport.getCenter().y-90), 180),
											new Asteroid(new Vec2(viewport.getCenter().x-300, viewport.getCenter().y+90), 180),
											new Asteroid(new Vec2(viewport.getCenter().x-200, viewport.getCenter().y-90), 180),
											new Asteroid(new Vec2(viewport.getCenter().x-200, viewport.getCenter().y+90), 180),
											new Asteroid(new Vec2(viewport.getCenter().x+230, viewport.getCenter().y-200), 250)]
		var cp = new Vec2(viewport.getCenter().x+480, viewport.getCenter().y-250)
		return new Level(bhp, asteroids, new Array(), new Array(), cp);
 	}

	// Two asteroids, curve around both, even harder
	static getLevel25(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-150, viewport.getCenter().y-320)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+220, viewport.getCenter().y-50), 200),
											new Asteroid(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y+50), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-150, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x+220, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x+50, viewport.getCenter().y-250))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+100)
		return new Level(bhp, asteroids, stars, new Array(), cp);
 	}


	static getLevel26(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y+220)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-50), 400)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-360)),
									new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y+300)),
									new Star(new Vec2(viewport.getCenter().x-100, viewport.getCenter().y-280)),
									new Star(new Vec2(viewport.getCenter().x-100, viewport.getCenter().y+250)),
									new Star(new Vec2(viewport.getCenter().x-200, viewport.getCenter().y-100)),
									new Star(new Vec2(viewport.getCenter().x-200, viewport.getCenter().y+100)),
									new Star(new Vec2(viewport.getCenter().x+420, viewport.getCenter().y))]
		var cp = new Vec2(viewport.getCenter().x+420, viewport.getCenter().y-320)
		return new Level(bhp, asteroids, stars, new Array(), cp);
 	}

	// Three asteroids, impossible (not actually)
	static getLevel27(viewport:Viewport) : Level {
		var bhp = new Vec2(viewport.getCenter().x-450, viewport.getCenter().y+220)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x+250, viewport.getCenter().y-150), 200),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+130), 200),
											new Asteroid(new Vec2(viewport.getCenter().x-250, viewport.getCenter().y-150), 200)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x-250, viewport.getCenter().y+280)),
									new Star(new Vec2(viewport.getCenter().x+250, viewport.getCenter().y+110)),
									new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-300)),
									new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-100))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y+220)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}


	// Create a random level
	static getRandomGenLevel(viewport:Viewport) : Level {
		// Array for the positions of objects so they aren't overlapping
		var usedPositions = []
		// Bounds for where anything can spawn
		var xMin = 150
		var xMax = 2*(viewport.getHalfSize().x) - xMin
		var yMin = 150
		var yMax = 2*(viewport.getHalfSize().y) - yMin
		// Radius where no two objects can spawn this close
		var bubble = 40000

		// Choose a random location for the cue
		var cp = new Vec2(Math.random()*(xMax-xMin)+xMin, Math.random()*(yMax-yMin)+yMin)
		usedPositions.push(cp.clone())

		// Bounds for where the black hole can spawn
		var bxMin = 150
		var bxMax = 2*(viewport.getHalfSize().x) - xMin
		var byMin = 150
		var byMax = 2*(viewport.getHalfSize().y) - yMin
		// Find what quadrant we should place the black hole in
		if (cp.x < viewport.getCenter().x) {
			// Cue is on the left side
			bxMin = viewport.getCenter().x
		} else {
			// Cue is on the right side
			bxMax = viewport.getCenter().x
		}
		if (cp.y < viewport.getCenter().y) {
			// Cue is on the top
			byMin = viewport.getCenter().y
		} else {
			// Cue is on the bottom
			byMax = viewport.getCenter().y
		}
		// Choose a semi-random location for the black hole
		let quadrantRand = Math.random()
		var bhp
		var check = true
		while (check) {
			if (quadrantRand > 0.56) {
				// Opposite corners
				bhp = new Vec2(Math.random()*(bxMax-bxMin)+bxMin, Math.random()*(byMax-byMin)+byMin)
			} else if (quadrantRand > 0.28) {
				// Opposite side l-r
				bhp = new Vec2(Math.random()*(bxMax-bxMin)+bxMin, Math.random()*(yMax-yMin)+yMin)
			} else {
				// Opposite side t-b
				bhp = new Vec2(Math.random()*(xMax-xMin)+xMin, Math.random()*(byMax-byMin)+byMin)
			}
			if (bhp.distanceSqTo(cp) < 200000) {
				check = true
			} else {
				check = false;
			}
		}
		usedPositions.push(bhp.clone())

		// Positions for the obstacles
		var starPositions : Array<Star> = []
		var asteroidPositions : Array<Asteroid> = []
		var wormholePositions : Array<WormholePair> = []

		// Place the first star in between the planet and the black hole
		var sp1
		var obsXPos
		var obsYPos
		if (cp.x > bhp.x) {
			obsXPos = (cp.x - bhp.x)/2 + bhp.x
		} else {
			obsXPos = (bhp.x - cp.x)/2 + cp.x
		}
		if (cp.y > bhp.y) {
			obsYPos = (cp.y - bhp.y)/2 + bhp.y
		} else {
			obsYPos = (bhp.y - cp.y)/2 + cp.y
		}
		sp1 = new Vec2(obsXPos, obsYPos)
		usedPositions.push(sp1.clone())
		starPositions.push(new Star(sp1.clone()))

		// Find the number of obstacles we'll use
		var numStars = Math.floor((Math.random()*3) + 1)
		var asteroidMassSum = Math.random()*400 + 150
		let obsP

		for (let i = 0; i < numStars; i++) {
			check = true
			while (check) {
				obsP = new Vec2(Math.random()*(xMax-xMin)+xMin, Math.random()*(yMax-yMin)+yMin)
				for (let pos of usedPositions) {
					if (obsP.distanceSqTo(pos) < bubble) {
						check = true
						break
					} else {
						check = false;
					}
				}
			}
			usedPositions.push(obsP.clone())
			starPositions.push(new Star(obsP.clone()))
		}

		let randMass
		while (asteroidMassSum > 150) {
			check = true
			while (check) {
				obsP = new Vec2(Math.random()*(xMax-xMin)+xMin, Math.random()*(yMax-yMin)+yMin)
				for (let pos of usedPositions) {
					if (obsP.distanceSqTo(pos) < bubble) {
						check = true
						break
					} else {
						check = false;
					}
				}
			}
			usedPositions.push(obsP.clone())
			randMass = Math.random()*150 + 150
			asteroidPositions.push(new Asteroid(obsP.clone(), Math.floor(randMass)))
			asteroidMassSum -= randMass
		}

		return new Level(bhp.clone(), asteroidPositions, starPositions, wormholePositions, cp.clone());
	}
}
