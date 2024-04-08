import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./FinProjectImp/Scenes/MainMenu";
import AABB from "./Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import Circle from "./Wolfie2D/DataTypes/Shapes/Circle";
import Debug_Scene from "./FinProjectImp/Scenes/Debug_Scene";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Note - just because your program passes all of these tests does not mean your algorithm works.
    // The tests should cover most cases, but run your own to be sure

    // runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            { name: "forward", keys: ["w"] },   // Forward is assigned to w
            { name: "backward", keys: ["s"] },  // and so on...
            { name: "turn_ccw", keys: ["a"] },
            { name: "turn_cw", keys: ["d"] },
        ],
        useWebGL: true,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){
    let aabb = new AABB(Vec2.ZERO, new Vec2(1, 1));
    let circle = new Circle(Vec2.ZERO, 1);

    // Both at (0, 0), should overlap
    HW2_CollisionTest(aabb, circle, true, "Overlap when both at (0, 0) not detected");

    circle.center.x = 1;
    // Overlap, but not same center
    HW2_CollisionTest(aabb, circle, true, "Overlap not detected");

    circle.center.x = 2;
    // Circle is touching right side of AABB
    HW2_CollisionTest(aabb, circle, true, "Overlap on right side of AABB not detected");

    circle.center.x = -2;
    // Circle is touching left side of AABB
    HW2_CollisionTest(aabb, circle, true, "Overlap or left side of AABB not detected");

    circle.center.x = 0;
    circle.center.y = -2;
    // Circle is touching top of AABB
    HW2_CollisionTest(aabb, circle, true, "Overlap on top of AABB not detected");

    circle.center.y = 2;
    // Circle is on bottom of AABB
    HW2_CollisionTest(aabb, circle, true, "Overlap on bottom of AABB not detected");

    circle.center.x = -2;
    circle.center.y = -2;
    // No collision - circle is too far away from the corner
    HW2_CollisionTest(aabb, circle, false, "Overlap detected when none is occurring");
 
    // To prevent floating point errors, we subtract a small number from the sqrt
    circle.center.x = -Math.sqrt(2)-0.0000001;
    circle.center.y = -Math.sqrt(2)-0.0000001;
    // Collision - circle is touching the top left corner
    HW2_CollisionTest(aabb, circle, true, "Overlap on top left corner of AABB not deteced");

    // Check other corners
    circle.center.x = 1
    circle.center.y = -1
    HW2_CollisionTest(aabb, circle, true, "Overlap on top right corner of AABB not deteced");

    circle.center.x = -1
    circle.center.y = 1.2
    HW2_CollisionTest(aabb, circle, true, "Overlap on bottom left corner of AABB not deteced");

    circle.center.x = 1.4
    circle.center.y = 1.4
    HW2_CollisionTest(aabb, circle, true, "Overlap on bottom right corner of AABB not deteced");
}

function HW2_CollisionTest(aabb: AABB, circle: Circle, value: boolean, message: string){
    console.assert(
        // TESTA - If we use this, I changed        vvv     from aabb to circle
        Debug_Scene.checkCircletoCircleCollision(circle , circle) === value,
        {
            aabb: aabb.toString(),
            circle: circle.toString(),
            errorMsg: message
        });
}