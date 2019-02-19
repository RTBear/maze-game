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

    let score = 999;//TODO: if I am going to just start with some high number, then harder mazes need to start with a higher number
    //scoring scheme idea: start with score of double the calculated minimum number of steps and subtract one point per move
    
    let breadcrumbs = [];

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

    function addBreadcrumb(crumb){
        breadcrumbs.push(crumb);
        score -= 1;
        //TODO maybe make list contain only unique locations
    }

    function moveUp() {
        if (spec.canMove.up) {
            addBreadcrumb({
                x: spec.location.x,
                y: spec.location.y
            });
            spec.location.y -= 1;
            disableMovementUntilUpdate();
        }
    }

    function moveRight() {
        if (spec.canMove.right) {
            addBreadcrumb({
                x: spec.location.x,
                y: spec.location.y
            });
            spec.location.x += 1;
            disableMovementUntilUpdate();
        }
    }

    function moveDown() {
        if (spec.canMove.down) {
            addBreadcrumb({
                x: spec.location.x,
                y: spec.location.y
            });
            spec.location.y += 1;
            disableMovementUntilUpdate();
        }
    }

    function moveLeft() {
        if (spec.canMove.left) {
            addBreadcrumb({
                x: spec.location.x,
                y: spec.location.y
            });
            spec.location.x -= 1;
            disableMovementUntilUpdate();
        }
    }

    function disableMovementUntilUpdate() {
        updateCanMove({
            up: false,
            right: false,
            down: false,
            left: false,
        });//cannot move until main game loop updates canmove
    }

    function updateCanMove(cm) {
        spec.canMove = {
            up: cm.up,
            right: cm.right,
            down: cm.down,
            left: cm.left,
        }
    }

    function updateSize(size) {
        spec.gameSize.width = size.gameSize.width;
        spec.gameSize.height = size.gameSize.height;

        spec.renderSize.width = size.renderSize.width;
        spec.renderSize.height = size.renderSize.height;
    }

    function reset() {
        // console.log('----------------------')
        // console.log('RESET')
        // console.log('----------------------')
        spec.location.x = initial_location_x;
        spec.location.y = initial_location_y;
        spec.direction = initial_direction;
        breadcrumbs = [];
    }

    let api = {
        moveUp: moveUp,
        moveRight: moveRight,
        moveDown: moveDown,
        moveLeft: moveLeft,
        calculateScore: calculateScore,
        updateCanMove: updateCanMove,
        reset: reset,
        updateSize: updateSize,
        get location() { return spec.location; },
        get direction() { return spec.direction; },
        get gameSize() { return spec.gameSize; },
        get renderSize() { return spec.renderSize; },
        get score() { return score; },
        get breadcrumbs() { return breadcrumbs; },
        get canMove() { return spec.canMove; },
    }

    return api;
}