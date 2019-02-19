MazeGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('game-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawShortestPath(gameGrid, pathGrid, x, y, size) {
        const UP = 'up';
        const RIGHT = 'right';
        const DOWN = 'down';
        const LEFT = 'left';
        // let movesLeft = pathGrid[y][x];
        while (pathGrid[y][x]) {//while you are not at goal
            let canMove = {
                up: !gameGrid[y][x].edge.up,//if not an edge
                right: !gameGrid[y][x].edge.right,
                down: !gameGrid[y][x].edge.down,
                left: !gameGrid[y][x].edge.left
            }

            for (dir in canMove) {
                if (canMove[dir]) {//if you can move a direction... move there
                    if (dir == UP) {
                        let y2 = y - 1;
                        if (pathGrid[y2][x] == pathGrid[y][x] - 1) {//if I can move in a direction and that direction is the next move on shortest path...
                            y = y2;
                            break;
                        }
                    } else if (dir == RIGHT) {
                        let x2 = x + 1;
                        if (pathGrid[y][x2] == pathGrid[y][x] - 1) {//if I can move in a direction and that direction is the next move on shortest path...
                            x = x2;
                            break;
                        }
                    } else if (dir == DOWN) {
                        let y2 = y + 1;
                        if (pathGrid[y2][x] == pathGrid[y][x] - 1) {//if I can move in a direction and that direction is the next move on shortest path...
                            y = y2;
                            break;
                        }
                    } else if (dir == LEFT) {
                        let x2 = x - 1;
                        if (pathGrid[y][x2] == pathGrid[y][x] - 1) {//if I can move in a direction and that direction is the next move on shortest path...
                            x = x2;
                            break;
                        }
                    }
                }
            }
            drawShortPathSection(x, y, size);
        }
    }
    function drawShortPathSection(x, y, size) {
        let w = size / 3;
        let h = size / 3;
        drawRectangle({
            w: w,
            h: h,
            x: (x * size) + (size - w) / 2,
            y: (y * size) + (size - h) / 2,
            fillStyle: 'rgba(226, 226, 15, 1)',
            strokeStyle: 'rgba(226, 226, 15, 1)',
            lineWidth: 0
        });
    }

    function drawBreadcrumbs(player) {
        //bc is an array of location objects of form {x: <int>, y: <int>}
        let w = player.gameSize.width / 4;
        let h = player.gameSize.width / 4;
        for (let crumb of player.breadcrumbs) {
            drawRectangle({
                w: w,
                h: h,
                x: (crumb.x * player.gameSize.width) + (player.gameSize.width - w) / 2,
                y: (crumb.y * player.gameSize.height) + (player.gameSize.width - h) / 2,
                fillStyle: 'rgba(0,0,200,.2)',
                strokeStyle: 'rgba(0,0,200,.2)',
                lineWidth: 0
            });
        }
    }

    function drawPlayer(player) {
        //TODO:draw player on board/canvas
        //player should know own direction and coordinates
        drawRectangle({
            x: (player.location.x * player.gameSize.width) + player.gameSize.width / 4,
            y: (player.location.y * player.gameSize.height) + player.gameSize.height / 4,
            w: player.gameSize.width / 2,
            h: player.gameSize.height / 2,
            fillStyle: 'rgba(0,0,200,1)',
            strokeStyle: 'rgba(0,0,200,1)',
            lineWidth: 0
        });
    }

    function drawBoard(board, dims, cell_size) {
        // context.strokeStyle = 'rgb(255, 255, 255)';//white
        context.strokeStyle = 'rgb(0, 0, 0)';//black
        context.lineWidth = 2;

        for (let i = 0; i < dims.h; i++) {
            for (let j = 0; j < dims.w; j++) {
                drawCell(board[i][j], cell_size);
            }
        }

        context.stroke();//draw maze lines

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(dims.w * cell_size, 0);
        context.lineTo(dims.w * cell_size, dims.h * cell_size);
        context.lineTo(0, dims.h * cell_size);
        context.closePath();
        context.lineWidth = 5;

        // context.strokeStyle = 'rgb(0, 0, 0)';
        context.stroke();
    }

    function drawCell(cell, cell_size) {
        if (cell.isStart) {
            drawRectangle({
                x: cell.x * cell_size,
                y: cell.y * cell_size,
                w: cell_size,
                h: cell_size,
                fillStyle: 'rgba(0,200,0,0.5)',
                strokeStyle: 'rgba(0,200,0,0.5)',
                lineWidth: 0
            });
        }
        if (cell.isFinish) {
            drawRectangle({
                x: cell.x * cell_size,
                y: cell.y * cell_size,
                w: cell_size,
                h: cell_size,
                fillStyle: 'rgba(200,0,0,0.5)',
                strokeStyle: 'rgba(200,0,0,0.5)',
                lineWidth: 0
            });
        }

        if (cell.edge) {
            let modifier = 1;
            if (cell.edge.up === true) {
                context.moveTo(cell.x * cell_size, cell.y * cell_size);
                context.lineTo((cell.x + 1) * cell_size, cell.y * cell_size);
            }

            if (cell.edge.right === true) {
                context.moveTo((cell.x + 1) * cell_size, cell.y * cell_size);
                context.lineTo((cell.x + 1) * cell_size, (cell.y + 1) * cell_size);
            }

            if (cell.edge.down === true) {
                context.moveTo(cell.x * cell_size, (cell.y + 1) * cell_size);
                context.lineTo((cell.x + 1) * cell_size, (cell.y + 1) * cell_size);
            }

            if (cell.edge.left === true) {
                context.moveTo(cell.x * cell_size, cell.y * cell_size);
                context.lineTo(cell.x * cell_size, (cell.y + 1) * cell_size);
            }
        }

    }

    function drawRectangle(spec) {
        // specExample { //no fields are required
        //     strokeStyle = 'rgba(0, 0, 255, 1)',
        //     fillStyle = 'rgba(0, 0, 255, 1)',
        //     lineWidth = 5,
        //     x = canvas.width / 4 + 0.5,
        //     y = canvas.height / 4 + 0.5,
        //     w = canvas.width / 2,
        //     h = canvas.height / 2
        // }
        if (!spec) {
            console.log('Rectangle Spec is undefined');
            return;
        }
        // console.log('spec',spec)
        context.save();

        context.strokeStyle = spec.strokeStyle != 'undefined' ? spec.strokeStyle : 'rgba(0, 0, 111, 1)';
        context.fillStyle = spec.fillStyle != 'undefined' ? spec.fillStyle : '';
        context.lineWidth = spec.lineWidth != 'undefined' ? spec.lineWidth : 5;

        var x = spec.x != 'undefined' ? spec.x : canvas.width / 4 + 0.5;
        var y = spec.y != 'undefined' ? spec.y : canvas.height / 4 + 0.5;
        var w = spec.w != 'undefined' ? spec.w : canvas.width / 2;
        var h = spec.h != 'undefined' ? spec.h : canvas.height / 2;

        context.strokeRect(x, y, w, h);
        context.fillRect(x, y, w, h);

        context.restore();
    }

    function Texture(spec) {
        let ready = false;
        let image = new Image();

        image.onload = function () {
            ready = true;
        };
        image.src = spec.imageSrc;

        function draw() {
            if (ready) {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                context.restore();
            }
        }

        function updateRotation(howMuch) {
            spec.rotation += howMuch;
        }

        return {
            draw: draw,
            updateRotation: updateRotation
        };
    }

    let api = {
        clear: clear,
        Texture: Texture,
        drawRectangle: drawRectangle,
        drawBoard: drawBoard,
        drawPlayer: drawPlayer,
        drawBreadcrumbs: drawBreadcrumbs,
        drawShortestPath: drawShortestPath,
    };

    Object.defineProperty(api, 'context', {
        value: context,
        writable: false,
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(api, 'canvas', {
        value: canvas,
        writable: false,
        enumerable: true,
        configurable: false
    });

    return api;
}());