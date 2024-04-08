export enum GameEvents {
	PLAY_GAME = "PLAY_GAME",
	CONTROLS = "CONTROLS",
	ABOUT = "ABOUT",
	MENU = "MENU",
	FIRE_BALL = "FIRE_BALL",

	PLANET_COLLISION = "PLANET_COLLISION",
	PLANET_HIT_WORMHOLE = "PLANET_HIT_WORMHOLE",
	PLANET_HIT_BLACKHOLE = "PLANET_HIT_BLACKHOLE",
	PLANET_OOB = "PLANET_OOB",
}

export enum GameAnimations {
	// TESTA - These will be changed later on
	CUE_IDLE = "idle",
	CUE_COLLISION = "explode",
}
