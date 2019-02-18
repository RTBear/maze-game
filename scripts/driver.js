//a maze game by Ryan Mecham
MazeGame.main = (function (graphics, objects) {
    //general globals
    var g_lastTimeStamp = performance.now();

    //board constants
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    //gameplay constants
    const MOVE_BUFFER_LEN = 1;
    const MOVE_SPEED = 1;
    const MS_PER_MOVE = 150;

    //gameplay globals
    var GAME_WIDTH = 5;//5x5, 10x10, 15x15, 20x20
    var GAME_HEIGHT = 5;
    var CELL_WIDTH = CANVAS_WIDTH / GAME_WIDTH;//for use if using non-square gameboard
    var CELL_HEIGHT = CANVAS_HEIGHT / GAME_HEIGHT;//for use if using non-square gameboard (I am using only square gameboards)
    var CELL_SIZE = CELL_WIDTH;//only square game boards allowed for now :)

    var SNAKES = [];//array of snake objects
    var GAME_GRID = null;//data structure for game board
    var GAME_OVER = false;
    var HIGH_SCORES = [];

    //directions
    const UP = 'up';
    const RIGHT = 'right';
    const DOWN = 'down';
    const LEFT = 'left';

    function updateHighScores() {
        for (let snake of SNAKES) {
            HIGH_SCORES.push(snake.score);
        }
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
        for (let snake of SNAKES) {
            scoreDiv.innerHTML = '<p class="text-center">Current Score: <span id="score">' + snake.score + '</span></p>'
        }
    }

    function gameover() {
        GAME_OVER = true;
        let gameoverDiv = document.getElementById('gameover');
        gameoverDiv.classList.remove('hidden');
        updateHighScores();
    }

    function clear_game() {
        SNAKES = null;
        GAME_GRID = null;
        GAME_OVER = false;
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
        GAME_WIDTH = mazeSize.width;
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
        // PLAYER.x = 0;
        // PLAYER.y = 0;

        GAME_GRID[GAME_HEIGHT - 1][GAME_WIDTH - 1].isFinish = true;

        console.log(GAME_GRID);

        requestAnimationFrame(gameLoop);
    }

    function update() {
    }

    function render() {
        graphics.clear();
        graphics.context.save();
        // console.log('here', GAME_WIDTH)
        graphics.drawBoard(GAME_GRID, { w: GAME_WIDTH, h: GAME_HEIGHT }, CELL_SIZE);
        // graphics.drawPlayer(PLAYER);
        graphics.context.restore();
    }

    function gameLoop(timestamp) {
        if (!GAME_OVER) {
            let elapsedTime = timestamp - g_lastTimeStamp;

            // processInput(elapsedTime);
            update(elapsedTime);
            render(elapsedTime);

            g_lastTimeStamp = timestamp;
            requestAnimationFrame(gameLoop);
        }
    }

    document.getElementById('newgame').addEventListener('click', init);

}(MazeGame.graphics, MazeGame.objects));