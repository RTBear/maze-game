MazeGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('game-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawBoard(board, dims, cell_size) {
        // context.strokeStyle = 'rgb(255, 255, 255)';//white
        context.strokeStyle = 'rgb(0, 0, 0)';//black
        context.lineWidth = 2;

        for (let i = 0; i < dims.w; i++) {
            for (let j = 0; j < dims.h; j++) {
                drawCell(board[i][j], cell_size);
            }
        }
        context.stroke();//draw maze lines

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(dims.w*cell_size, 0);
        context.lineTo(dims.w*cell_size, dims.h*cell_size);
        context.lineTo(0, dims.h*cell_size);
        context.closePath();
        context.lineWidth = 5;

        // context.strokeStyle = 'rgb(0, 0, 0)';
        context.stroke();
    }

    function drawCell(cell, cell_size) {
        if (cell.edge) {
            let modifier = 1;
            if (cell.edge.up === true) {
                context.moveTo(cell.x * cell_size, cell.y * cell_size);
                context.lineTo((cell.x + 1) * cell_size, cell.y * cell_size);
                //context.stroke();
            }

            if (cell.edge.right === true) {
                context.moveTo((cell.x + 1) * cell_size, cell.y * cell_size);
                context.lineTo((cell.x + 1) * cell_size, (cell.y + 1) * cell_size);
                //context.stroke();
            }

            if (cell.edge.down === true) {
                context.moveTo(cell.x * cell_size, (cell.y + 1) * cell_size);
                context.lineTo((cell.x + 1) * cell_size, (cell.y + 1) * cell_size);
                //context.stroke();
            }

            if (cell.edge.left === true) {
                context.moveTo(cell.x * cell_size, cell.y * cell_size);
                context.lineTo(cell.x * cell_size, (cell.y + 1) * cell_size);
                //context.stroke();
            }
            // context.stroke();
        }
    }

    function drawRectangle(spec) {
        // specExample {
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
        drawBoard: drawBoard
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