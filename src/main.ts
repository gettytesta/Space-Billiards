import Game from "./Wolfie2D/Loop/Game";
import AABB from "./Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import Circle from "./Wolfie2D/DataTypes/Shapes/Circle";
import Base_Scene from "./FinProjectImp/Scenes/Base_Scene";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Note - just because your program passes all of these tests does not mean your algorithm works.
    // The tests should cover most cases, but run your own to be sure

    // runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        useWebGL: true,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    const fontFile = 'hw2_assets/fonts/BlueScreen.ttf';
	const fontFace = new FontFace('BlueScreen', `url(${fontFile})`);

	document.fonts.add(fontFace);
	document.fonts.load(`url(${fontFile})`).then(() => {
		console.log('Custom font loaded');
	});

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(Base_Scene, {});
})();
