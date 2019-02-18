//a snake game by Ryan Mecham
MazeGame.main = (function (graphics) {
    //general globals
    var g_newGameBtn = document.getElementById('newgame');
    var g_lastTimeStamp = performance.now();
    var g_elapsedTime = 0;

    //board constants
    const GAME_WIDTH = 20;
    const GAME_HEIGHT = 20;
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    const CELL_WIDTH = CANVAS_WIDTH / GAME_WIDTH;//for use if using non-square gameboard
    const CELL_HEIGHT = CANVAS_HEIGHT / GAME_HEIGHT;//for use if using non-square gameboard
    const CELL_SIZE = CELL_WIDTH;//only square game boards allowed for now :)

    //gameplay constants
    const NUM_SNAKES = 1;
    const INITIAL_SNAKE_LEN = 1;
    const APPLE_INCR_LEN = 3;
    const NUM_APPLES = 1;
    const NUM_WALLS = 15;
    const MOVE_BUFFER_LEN = 1;
    const MOVE_SPEED = 1;
    const MS_PER_MOVE = 150;

    //gameplay globals
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

    function init() {
        clear_game();
        SNAKES = [];
        GAME_GRID = makeMaze(GAME_WIDTH, GAME_HEIGHT);

        requestAnimationFrame(gameLoop);
    }

    function update() {
        for (let snake of SNAKES) {
            snake.updatePosition();
        }
        updateScores();
    }

    function render() {
        graphics.clear();
        graphics.context.save();
        graphics.drawBoard(GAME_GRID, { w: GAME_WIDTH, h: GAME_HEIGHT }, CELL_SIZE);
        graphics.context.restore();
    }

    function gameLoop(timestamp) {
        if (!GAME_OVER) {
            g_elapsedTime = timestamp - g_lastTimeStamp;
            update();
            render();

            g_lastTimeStamp = timestamp;
            requestAnimationFrame(gameLoop);
        }
    }

    g_newGameBtn.addEventListener('click', init)
})(MazeGame.graphics);