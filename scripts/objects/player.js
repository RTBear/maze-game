// ------------------------------------------------------------------------
//
// Creates a Player object, with functions for managing state.
//
// spec = {
//     imageSrc: ,   //[(relative) file path] Web server location of the image or sprite
//     location: { x: , y: }, //[integer] location on gameboard (not in canvas pixels)
//     gameSize: { width: , height: }, //[integer] size relative to gameboard (typically the same size as cell_size)
//     renderSize: { width: , height: }, //[percent (0-1)] size to render relative to gameSize (eg take full or half cell)
//     direction: ,//direction player is facing
//     canMove: { //object full of booleans denoting available movement directions
//         up: ,
//         right: ,
//         down: ,
//         left: 
//     }
// 
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

    Directions = {//syntactic sugar
        up: 'up',
        right: 'right',
        down: 'down',
        left: 'left',
    };

    function moveForward() {
        if (player.direction === Directions.up && canMove.up) {
            //move up
            moveUp();
        } else if (player.direction === Directions.right && canMove.right) {
            //move right
            moveRight();
        } else if (player.direction === Directions.down && canMove.down) {
            //move down
            moveDown();
        } else if (player.direction === Directions.left && canMove.left) {
            //move left
            moveLeft();
        }
    }

    function moveUp() {
        if (canMove.up) {
            location.y -= 1;
        }
    }

    function moveRight() {
        if (canMove.right) {
            location.x += 1;
        }
    }

    function moveDown() {
        if (canMove.down) {
            location.y += 1;
        }
    }

    function moveLeft() {
        if (canMove.left) {
            location.x -= 1;
        }
    }

    let api = {
        moveUp: moveUp,
        moveRight: moveRight,
        moveDown: moveDown,
        moveLeft: moveLeft,
        get location() { return location; },
        get direction() { return direction; },
        get gameSize() { return gameSize; },
        get renderSize() { return renderSize; },
    }

    return api;
}