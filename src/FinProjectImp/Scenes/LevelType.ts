import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

export default class Level {
	public black_hole_pos: Vec2;

	public asteroids: Array<Asteroid>;

	// TESTA - Not implementing 2 cues yet
	public cue_pos: Vec2;

    constructor(bhp: Vec2, a: Array<Asteroid>, cp: Vec2) {
		this.black_hole_pos = bhp
		this.asteroids = a
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