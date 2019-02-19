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
    var g_showShortestPath = false;//show shortest path to finish
    var g_showBreadcrumbs = false;//show all visited squares
    var g_showHint = false;//show next best square
    let g_shortestPath = null; 

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
        // updateHighScores();
    }

    function clear_game() {
        GAME_GRID = null;
        GAME_OVER = false;
        let gameoverDiv = document.getElementById('gameover');
        gameoverDiv.classList.add('hidden');
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

    function toggleShortestPath() { g_showShortestPath = !g_showShortestPath; }

    function toggleBreadCrumbs() { g_showBreadcrumbs = !g_showBreadcrumbs; console.log('bc toggle') }

    function toggleHint() { g_showHint = !g_showHint; }

    function findShortestPath(x = GAME_WIDTH - 1, y = GAME_HEIGHT - 1) {
        // console.log(GAME_GRID[y][x]);
        // console.log(g_shortestPath);

        if (y == 0 && x == 0) {
            return;
        }

        let canMove = {
            up: !GAME_GRID[y][x].edge.up,//if not an edge
            right: !GAME_GRID[y][x].edge.right,
            down: !GAME_GRID[y][x].edge.down,
            left: !GAME_GRID[y][x].edge.left
        }

        for (dir in canMove) {
            if (canMove[dir]) {//if you can move a direction... move there
                if (dir == UP) {
                    let y2 = y - 1;
                    if (g_shortestPath[y2][x] == 0 && !(y2 == GAME_HEIGHT - 1 && x == GAME_WIDTH - 1)) {
                        g_shortestPath[y2][x] = g_shortestPath[y][x] + 1;
                        if (y2 == 0 && x == 0) {
                            return;
                        }
                        findShortestPath(x, y2);
                    }
                } else if (dir == RIGHT) {
                    let x2 = x + 1;
                    if (g_shortestPath[y][x2] == 0 && !(y == GAME_HEIGHT - 1 && x2 == GAME_WIDTH - 1)) {
                        g_shortestPath[y][x2] = g_shortestPath[y][x] + 1;
                        if (y == 0 && x2 == 0) {
                            return;
                        }
                        findShortestPath(x2, y);
                    }
                } else if (dir == DOWN) {
                    let y2 = y + 1;
                    if (g_shortestPath[y2][x] == 0 && !(y2 == GAME_HEIGHT - 1 && x == GAME_WIDTH - 1)) {
                        g_shortestPath[y2][x] = g_shortestPath[y][x] + 1;
                        if (y2 == 0 && x == 0) {
                            return;
                        }
                        findShortestPath(x, y2);
                    }
                } else if (dir == LEFT) {
                    let x2 = x - 1;
                    if (g_shortestPath[y][x2] == 0 && !(y == GAME_HEIGHT - 1 && x2 == GAME_WIDTH - 1)) {
                        g_shortestPath[y][x2] = g_shortestPath[y][x] + 1;
                        if (y == 0 && x2 == 0) {
                            return;
                        }
                        findShortestPath(x2, y);
                    }
                } else {
                    return;
                }
            }
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


        g_shortestPath = [];
        for(let i=0;i<GAME_HEIGHT;i++){
            let row = [];
            for(let j=0;j<GAME_WIDTH;j++){
                row.push(0);
            }
            g_shortestPath.push(row);
        }

        findShortestPath();
        console.log(GAME_GRID);
        console.log(g_shortestPath);


        requestAnimationFrame(gameLoop);
    }

    function update(elapsedTime) {
        // PLAYER.updateScore(elapsedTime);
        if(PLAYER.location.x == GAME_WIDTH - 1 && PLAYER.location.y == GAME_HEIGHT - 1){
            gameover();
        }
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
        //renderer.maze.render(GAME_GRID)//this would require setting up renderer as well as making game_grid its own, more robust, object that stores stuff like game_width, cell_size, etc.
        graphics.drawBoard(GAME_GRID, { w: GAME_WIDTH, h: GAME_HEIGHT }, CELL_SIZE);
        //TODO draw scoreboard
        if (g_showShortestPath) {
            graphics.drawShortestPath(gameGrid=GAME_GRID, pathGrid=g_shortestPath, x=PLAYER.location.x, y=PLAYER.location.y, size=CELL_SIZE);
        }
        if (g_showBreadcrumbs) {
            graphics.drawBreadcrumbs(PLAYER);
        }
        if (g_showHint) {
            graphics.drawHint(gameGrid=GAME_GRID, pathGrid=g_shortestPath, x=PLAYER.location.x, y=PLAYER.location.y, size=CELL_SIZE);
        }
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

    myKeyboard.register('p', toggleShortestPath);
    myKeyboard.register('b', toggleBreadCrumbs);
    myKeyboard.register('h', toggleHint);
    myKeyboard.register('q', function(){console.log(PLAYER.location,PLAYER.canMove);});


}(MazeGame.graphics, MazeGame.objects, MazeGame.input));