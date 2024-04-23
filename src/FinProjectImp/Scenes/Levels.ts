import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Level, { Asteroid, WormholePair } from "./LevelType";

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
			default:
				return this.getLevel1(viewport)
		}
	}

	/**
	 * 	TESTA - For the time being, I wont be adding any wormholes to the levels. They'll be added once we get the sprite worked out.
	 */

	static getTutorialLevel(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, new Array(), new Array(), cp);
	}

	// No obstacles
	static getLevel1(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, new Array(), new Array(), cp);
	}

	// One asteroid, curve around it
	static getLevel2(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 150)]
		/*
		let whPair = new WormholePair(new Vec2(viewport.getCenter().x, viewport.getCenter().y - 300),
									  new Vec2(viewport.getCenter().x, viewport.getCenter().y + 300));
									  */
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	// Two asteroids, gravity cancels
	static getLevel3(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-80), 150),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+80), 150)]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}


	static getLevel4(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 150)]
		// var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(600, 700), new Vec2(600, 200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	static getLevel5(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 150)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	static getLevel6(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 150)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	static getLevel7(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 150)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}
}
