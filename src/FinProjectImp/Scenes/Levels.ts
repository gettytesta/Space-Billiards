import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Level, { Asteroid, WormholePair } from "./LevelType";

// bhp - Position of the black hole
// cp - Position of the cue

// This class will simply hold getters that get a Level class with the proper data
export default class Levels {
	static getLevel(viewport:Viewport, levelNum:number) : Level {
		switch (levelNum) {
			case 1:
				return this.getLevel1(viewport)
			case 2:
				return this.getLevel2(viewport)
			case 3:
				return this.getLevel3(viewport)
			default:
				return this.getLevel1(viewport)
		}
	}

	static getLevel1(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 100)]
		var cp = new Vec2(viewport.getCenter().x+350, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	static getLevel2(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y-80), 100),
											new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y+80), 100)]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, new Array(), cp);
	}

	static getLevel3(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(new Vec2(viewport.getCenter().x, viewport.getCenter().y), 100)]
		var wormholePairs : Array<WormholePair> = [new WormholePair(new Vec2(600, 700), new Vec2(600, 200)),
													new WormholePair(new Vec2(800, 700), new Vec2(300, 200))]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp, asteroids, wormholePairs, cp);
	}
}
