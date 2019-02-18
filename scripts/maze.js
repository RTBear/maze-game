function makeMaze(width = 15, height = 15) {
    let shapeX = width;
    let shapeY = height;

    console.log('w', width, 'sx', shapeX);
    console.log('h', height, 'sy', shapeY);

    // build actual maze
    var maze = blankBoard(shapeX = shapeX, shapeY = shapeY);

    //generate maze with random "seed" cell //this will likely break after maze parsing update
    // let x = getRandomInt(shapeX - 1);
    // let y = getRandomInt(shapeY - 1);

    let x = 1;
    let y = 1;

    maze[y][x].isPassage = true;//make the cell a passage
    let neighbors = getNeighbors(x, y);
    connectWithNeighbors(neighbors, x, y);//start connecting interior

    return parseMazeEdges(maze);

    function connectWithNeighbors(neighbors, x, y) {
        //try to connect with random neighbor if they are a passage
        while (neighbors.length > 0) {
            // console.log(neighbors)
            let neigborNum = getRandomInt(neighbors.length - 1);
            let y2 = neighbors[neigborNum][0];//random neighbor
            let x2 = neighbors[neigborNum][1];
            if (maze[y2][x2].isPassage == false) {//if only one of the two cells divided by the wall at connY, connX is a passage, make the whole thing a passage
                maze[y2][x2].isPassage = true;
                if (y2 > y) {
                    //neighbor is below
                    maze[y2 - 1][x2].isPassage = true;
                    maze[y2 - 2][x2].isPassage = true;
                } else if (y2 < y) {
                    //neighbor is above
                    maze[y2 + 1][x2].isPassage = true;
                    maze[y2 + 2][x2].isPassage = true;
                } else if (x2 > x) {
                    //neighbor is to the right
                    maze[y2][x2 - 1].isPassage = true;
                    maze[y2][x2 - 2].isPassage = true;
                } else if (x2 < x) {
                    //neighbor is to the left
                    maze[y2][x2 + 1].isPassage = true;
                    maze[y2][x2 + 2].isPassage = true;
                }
                connectWithNeighbors(getNeighbors(x2, y2), x2, y2);
            }
            neighbors.splice(neigborNum, 1);
        }
    }

    function getNeighbors(x, y) {
        //get neighbors
        let neighbors = [];//"neighbors are 3 cells away"
        if (x > 2) { neighbors.push([y, x - 3]); }
        if (x < shapeX - 3) { neighbors.push([y, x + 3]); }
        if (y > 2) { neighbors.push([y - 3, x]); }
        if (y < shapeY - 3) { neighbors.push([y + 3, x]); }

        return neighbors;
    }

    function parseMazeEdges(maze) {//maze is 2d array representation of a maze
        let shapeY = maze.length;
        let shapeX = maze[0].length;
    
        let parsedMaze = [];
        for (let i = 1; i < shapeY; i += 3) {//for each row
            var row = [];
            for (let j = 1; j < shapeX; j += 3) {
                row.push(new Cell({
                    isPassage: true,
                    edge: {
                        up: ! maze[i - 1][j].isPassage,//use not because edge.up == true sounds like up is blocked
                        right: ! maze[i][j + 1].isPassage,
                        down: ! maze[i + 1][j].isPassage,
                        left: ! maze[i][j - 1].isPassage
                    },
                    x: Math.trunc(j/3),//remember, 3 is "width" of an unparsed cell
                    y: Math.trunc(i/3)
                }));
            }
            parsedMaze.push(row);
        }
        return parsedMaze
    }

}

function Cell(spec) {
    let isPassage = false; //default
    let isOccupied = false; //default
    let containsBreadcrumb = false; //default
    let partOfShortestPath = false; //default
    let x = 0; //default
    let y = 0; //default

    isPassage = spec.isPassage;
    isOccupied = spec.isOccupied;
    containsBreadcrumb = spec.containsBreadcrumb;
    partOfShortestPath = spec.partOfShortestPath;
    x = spec.x;
    y = spec.y;

    //cell edges(optional)
    edge = spec.edge;

    let thisCell = {
        isPassage: isPassage,
        isOccupied: isOccupied,
        containsBreadcrumb: containsBreadcrumb,
        partOfShortestPath: partOfShortestPath,
        edge: edge,
        x: x,
        y: y
    };

    return thisCell;
}

//credit for getRandomInt function goes to [alienriver49 and Ionut G. Stan] 
//on stackoverflow (https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range)
//max(inclusive),min(inclulsive)
function getRandomInt(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printMazeString(arr = []) {
    s = ''
    for (let i = 0; i < arr.length; i++) {
        let row = '';
        for (let j = 0; j < arr[0].length; j++) {
            row += arr[i][j].isPassage ? ' ' : '█';
        }
        s += row + '\n';
    }
    console.log(s)
}

function blankBoard(shapeX = 5, shapeY = 5) {//create 2d array of Cell objects that are all walls
    let a = [];
    for (let i = 0; i < shapeY; i++) {//for each row
        var row = [];
        for (let j = 0; j < shapeX; j++) {
            row.push(new Cell({ 
                isPassage: false,
                x: j,
                y: i
            }));
        }
        a.push(row);
    }
    return a;
}
