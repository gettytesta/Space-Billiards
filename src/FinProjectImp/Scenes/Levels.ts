import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
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
			default:
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
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 150)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), new Array(), cp);
	}

	// One asteroid, one star
	static getLevel3(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y-180)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 150)]
		var stars : Array<Star> = [new Star(new Vec2(viewport.getCenter().x, viewport.getCenter().y-150))]
		// var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(600, 700), new Vec2(600, 200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, stars, new Array(), cp);
	}

	// Two asteroids, gravity cancels
	static getLevel4(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-80), 150),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+80), 150)]
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
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-80), 150),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+80), 150)]
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
}
