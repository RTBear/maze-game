//a maze game by Ryan Mecham
MazeGame.main = (function (graphics, objects, input) {
    //directions
    const UP = 'up';
    const RIGHT = 'right';
    const DOWN = 'down';
    const LEFT = 'left';

    //general globals
    var g_lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();

    //board constants
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    //gameplay globals
    var GAME_WIDTH = 5;//5x5, 10x10, 15x15, 20x20
    var GAME_HEIGHT = 5;
    var CELL_WIDTH = CANVAS_WIDTH / GAME_WIDTH;//for use if using non-square gameboard
    var CELL_HEIGHT = CANVAS_HEIGHT / GAME_HEIGHT;//for use if using non-square gameboard (I am using only square gameboards)
    var CELL_SIZE = CELL_WIDTH;//only square game boards allowed for now :)

    var GAME_GRID = null;//data structure for game board
    var PLAYER = objects.Player({
        imageSrc: '/assets/images/pushpin-red.png',
        location: { x: 0, y: 0 },
        gameSize: { width: CELL_WIDTH, height: CELL_WIDTH },
        renderSize: { width: CELL_WIDTH, height: CELL_WIDTH },
        direction: RIGHT,
        canMove: {
            up: false,
            right: false,
            down: false,
            left: false,
        },
    })
    var GAME_OVER = false;
    var HIGH_SCORES = [];


    function updateHighScores() {
        // for (let snake of SNAKES) {
        //     HIGH_SCORES.push(snake.score);
        // }
        HIGH_SCORES.sort(function (a, b) { return a - b; });//default sort is alphabetical
        HIGH_SCORES.reverse();
        let highscoresDiv = document.getElementById('high-scores');
        while (highscoresDiv.firstChild) {
            highscoresDiv.removeChild(highscoresDiv.firstChild);
        }
        for (let score of HIGH_SCORES) {
            s = document.createElement('li');
            s.appendChild(document.createTextNode('' + score));
            document.getElementById('high-scores').appendChild(s);
        }
    }

    function updateScores() {
        let scoreDiv = document.getElementById('scores');
        scoreDiv.innerHTML = '<p class="text-center">Current Score: <span id="score">' + PLAYER.score + '</span></p>'
    }

    function gameover() {
        GAME_OVER = true;
        let gameoverDiv = document.getElementById('gameover');
        gameoverDiv.classList.remove('hidden');
        updateHighScores();
    }

    function clear_game() {
        GAME_GRID = null;
        GAME_OVER = false;
        PLAYER.reset();
    }

    function getMazeSize() {
        let size = document.querySelector('#maze-size input[name=mazeSize]:checked');
        let sizes_arr = size.value.split('x');

        return {
            width: sizes_arr[0],
            height: sizes_arr[1]
        }
    }

    function init() {
        clear_game();
        const MAZE_SIZE_TO_GAME_SIZE_MULTIPLIER = 3;//because each cell in a 5x5 maze will consist of 9 actual game cells 
        //set maze size
        let mazeSize = getMazeSize();
        console.log(mazeSize)
        GAME_WIDTH = mazeSize.width;//TODO: move game board into its own class/file
        GAME_HEIGHT = mazeSize.height;
        CELL_WIDTH = CANVAS_WIDTH / GAME_WIDTH;//for use if using non-square gameboard
        CELL_HEIGHT = CANVAS_HEIGHT / GAME_HEIGHT;//for use if using non-square gameboard
        CELL_SIZE = CELL_WIDTH;//only square game boards allowed for now :)

        GAME_GRID = objects.Maze({
            width: GAME_WIDTH * MAZE_SIZE_TO_GAME_SIZE_MULTIPLIER,
            height: GAME_HEIGHT * MAZE_SIZE_TO_GAME_SIZE_MULTIPLIER
        });

        //for now start is always top-left and end is always bottom-right
        //TODO: consider making these random or place end at farthest point from start
        GAME_GRID[0][0].isOccupied = true;//start at top left of screen
        GAME_GRID[0][0].isStart = true;//start at top left of screen

        PLAYER.updateCanMove({
            up: !GAME_GRID[0][0].edge.up,//if not an edge
            right: !GAME_GRID[0][0].edge.right,
            down: !GAME_GRID[0][0].edge.down,
            left: !GAME_GRID[0][0].edge.left
        });
        PLAYER.updateSize({
            gameSize: { width: CELL_WIDTH, height: CELL_WIDTH },
            renderSize: { width: CELL_WIDTH, height: CELL_WIDTH },
        });

        GAME_GRID[GAME_HEIGHT - 1][GAME_WIDTH - 1].isFinish = true;

        console.log(GAME_GRID);

        requestAnimationFrame(gameLoop);
    }

    function update(elapsedTime) {
        // PLAYER.updateScore(elapsedTime);
        PLAYER.updateCanMove({
            up: !GAME_GRID[PLAYER.location.y][PLAYER.location.x].edge.up,//if not an edge
            right: !GAME_GRID[PLAYER.location.y][PLAYER.location.x].edge.right,
            down: !GAME_GRID[PLAYER.location.y][PLAYER.location.x].edge.down,
            left: !GAME_GRID[PLAYER.location.y][PLAYER.location.x].edge.left
        });
    }

    function render(elapsedTime) {
        graphics.clear();
        graphics.context.save();
        // console.log('here', GAME_WIDTH)
        //renderer.maze.render(GAME_GRID)//this would require setting up renderer as well as making game_grid its own, more robust, object that stores stuff like game_width, cell_size, etc.
        graphics.drawBoard(GAME_GRID, { w: GAME_WIDTH, h: GAME_HEIGHT }, CELL_SIZE);
        //TODO draw scoreboard
        graphics.context.restore();

        graphics.context.save();
        graphics.drawPlayer(PLAYER);
        graphics.context.restore();
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        // myMouse.update(elapsedTime);
    }

    function gameLoop(timestamp) {
        if (!GAME_OVER) {
            let elapsedTime = timestamp - g_lastTimeStamp;

            processInput(elapsedTime);
            update(elapsedTime);
            render(elapsedTime);

            g_lastTimeStamp = timestamp;
            requestAnimationFrame(gameLoop);
        }
    }

    //register handlers and input
    document.getElementById('newgame').addEventListener('click', init);

    myKeyboard.register('w', PLAYER.moveUp);
    myKeyboard.register('d', PLAYER.moveRight);
    myKeyboard.register('s', PLAYER.moveDown);
    myKeyboard.register('a', PLAYER.moveLeft);

    myKeyboard.register('ArrowUp', PLAYER.moveUp);
    myKeyboard.register('ArrowRight', PLAYER.moveRight);
    myKeyboard.register('ArrowDown', PLAYER.moveDown);
    myKeyboard.register('ArrowLeft', PLAYER.moveLeft);

    myKeyboard.register('i', PLAYER.moveUp);
    myKeyboard.register('l', PLAYER.moveRight);
    myKeyboard.register('k', PLAYER.moveDown);
    myKeyboard.register('j', PLAYER.moveLeft);

}(MazeGame.graphics, MazeGame.objects, MazeGame.input));