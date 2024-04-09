export enum GameEvents {
	PLAY_GAME = "PLAY_GAME",
	CONTROLS = "CONTROLS",
	ABOUT = "ABOUT",
	MENU = "MENU",
	TRAJECTORY_SET = "TRAJECTORY_SET",
	FIRE_BALL = "FIRE_BALL",
	RESET_TRAJECTORY = "RESET_TRAJECTORY",

	PLANET_COLLISION = "PLANET_COLLISION",
	PLANET_HIT_BLACKHOLE = "PLANET_HIT_BLACKHOLE",
	PLANET_OOB = "PLANET_OOB",
}

export enum GameAnimations {
	// TESTA - These will be changed later on
	CUE_IDLE = "idle",
	CUE_COLLISION = "explode",
}