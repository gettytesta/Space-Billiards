import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Level {
	public black_hole_pos: Vec2;

	public asteroids: Array<Asteroid>;
	public stars: Array<Star>;
	public wormholePairs: Array<WormholePair>;

	// TESTA - Not implementing 2 cues yet
	public cue_pos: Vec2;

    constructor(bhp: Vec2, a: Array<Asteroid>, s: Array<Star>, w: Array<WormholePair>, cp: Vec2) {
		this.black_hole_pos = bhp
		this.asteroids = a
		this.stars = s
		this.wormholePairs = w
		this.cue_pos = cp
    }
}

export class Asteroid {
	public position: Vec2;
	// TESTA - Mass will need to be tied to the size of the asteroid!!!
	public mass: number;

	constructor(p: Vec2, m: number) {
		this.position = p;
		this.mass = m
	}
}

export class Star {
	public position: Vec2;

	constructor(p:Vec2) {
		this.position = p
	}
}

export class WormholePair {
	public positions: Vec2[];
	public spriteIDs: number[];

	constructor(p1: Vec2, p2: Vec2) {
		this.positions = new Array(2);
		this.spriteIDs = new Array(2);
		this.positions[0] = p1;
		this.positions[1] = p2;
	}
}


