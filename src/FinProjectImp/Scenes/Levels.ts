import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Level, { Asteroid } from "./LevelType";

// bhp - Position of the black hole
// cp - Position of the cue

// This class will simply hold getters that get a Level class with the proper data
export default class Levels {
	static getLevel1(viewport:Viewport) : Level {
		var bhp = new Vec2(150, viewport.getCenter().y)
		var asteroids : Array<Asteroid> = [new Asteroid(viewport.getCenter().clone(), 10)]
		var cp = new Vec2(viewport.getCenter().x+400, viewport.getCenter().y)
		return new Level(bhp,asteroids,cp);
	}
}