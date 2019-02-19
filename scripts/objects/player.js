// ------------------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
//
// spec = {
//      imageSrc: ,   //[(relative) file path] Web server location of the image or sprite
//      location: { x: , y: }, //[integer] location on gameboard (not in canvas pixels)
//      gameSize: { width: , height: }, //[integer] size relative to gameboard (typically the same size as cell_size)
//      renderSize: { width: , height: }, //[percent (0-1)] size to render relative to gameSize (eg take full or half cell)
//      direction: ,//direction player is facing
//      canMove: { //object full of booleans denoting available movement directions
//          up: ,
//          right: ,
//          down: ,
//          left: 
//      },
// }
//
// ------------------------------------------------------------------------
MazeGame.objects.Player = function (spec) {
    'use strict';

    //make sure a valid spec was passed in. This is not a exhaustive check.
    if (
        typeof spec == 'undefined'
        || typeof spec.imageSrc == 'undefined'
        || typeof spec.location == 'undefined'
        || typeof spec.gameSize == 'undefined'
        || typeof spec.renderSize == 'undefined'
        || typeof spec.direction == 'undefined'
        || typeof spec.canMove == 'undefined'
    ) {
        throw "invalid player spec";
    }

    // spec = {
        //      imageSrc: ,   //[(relative) file path] Web server location of the image or sprite
        //      location: { x: , y: }, //[integer] location on gameboard (not in canvas pixels)
        //      gameSize: { width: , height: }, //[integer] size relative to gameboard (typically the same size as cell_size)
        //      renderSize: { width: , height: }, //[percent (0-1)] size to render relative to gameSize (eg take full or half cell)
        //      direction: ,//direction player is facing
        //      canMove: { //object full of booleans denoting available movement directions
        //          up: ,
        //          right: ,
        //          down: ,
        //          left: 
        //      },
        // }

    let initial_location_x = spec.location.x;
    let initial_location_y = spec.location.y;
    let initial_direction = spec.direction;

    let Directions = {//syntactic sugar
        up: 'up',
        right: 'right',
        down: 'down',
        left: 'left',
    };

    let score = 0;

    function moveForward() {
        if (spec.direction === Directions.up && spec.canMove.up) {
            //move up
            moveUp();
        } else if (spec.direction === Directions.right && spec.canMove.right) {
            //move right
            moveRight();
        } else if (spec.direction === Directions.down && spec.canMove.down) {
            //move down
            moveDown();
        } else if (spec.direction === Directions.left && spec.canMove.left) {
            //move left
            moveLeft();
        }
    }

    function calculateScore(elapsedTime) {
        //do stuff
    }

    function moveUp() {
        if (spec.canMove.up) {
            spec.location.y -= 1;
        }
    }

    function moveRight() {
        if (spec.canMove.right) {
            spec.location.x += 1;
        }
    }

    function moveDown() {
        if (spec.canMove.down) {
            spec.location.y += 1;
        }
    }

    function moveLeft() {
        if (spec.canMove.left) {
            spec.location.x -= 1;
        }
    }

    function updateCanMove(cm) {
        spec.canMove = {
            up: cm.up,
            right: cm.right,
            down: cm.down,
            left: cm.left,
        }
    }

    function updateSize(size){
        
    }

    function reset() {
        console.log('----------------------')
        console.log('RESET')
        console.log('----------------------')
        console.log('l',initial_location_x,initial_location_y);
        spec.location.x = initial_location_x;
        spec.location.y = initial_location_y;
        spec.direction = initial_direction;
    }

    let api = {
        moveUp: moveUp,
        moveRight: moveRight,
        moveDown: moveDown,
        moveLeft: moveLeft,
        calculateScore: calculateScore,
        updateCanMove: updateCanMove,
        reset: reset,
        get location() { return spec.location; },
        get direction() { return spec.direction; },
        get gameSize() { return spec.gameSize; },
        get renderSize() { return spec.renderSize; },
        get score() { return spec.score; },
    }

    return api;
}