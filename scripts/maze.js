function makeMaze(width = 15, height = 15) {
    let WALL = 0;
    let PASSAGE = 1;
    // only odd shapes
    let shapeX = Math.trunc(width / 2) * 2 + 1;
    let shapeY = Math.trunc(height / 2) * 2 + 1;
    console.log('w', width, 'sx', shapeX)
    console.log('h', height, 'sy', shapeY)

    // build actual maze
    var maze = blankBoard(shapeX = shapeX, shapeY = shapeY, borderVal = WALL, fillVal = WALL)
    console.log(maze)
    print2dArr(maze)

    let x = getRandomInt(shapeX - 1)
    let y = getRandomInt(shapeY - 1)

    // let x = 0;
    // let y = 0;

    let neighbors = getNeighbors(x, y);
    maze[y][x] = PASSAGE;//make the cell a passage
    connectWithNeighbors(neighbors, x, y);//start connecting interior

    return maze
    // print2dArr(maze)

    function connectWithNeighbors(neighbors, x, y) {
        //try to connect with random neighbor if they are a passage
        while (neighbors.length > 0) {
            // console.log(neighbors)
            let neigborNum = getRandomInt(neighbors.length - 1);
            let y2 = neighbors[neigborNum][0];//random neighbor
            let x2 = neighbors[neigborNum][1];
            if (maze[y2][x2] == WALL) {//if only one of the two cells divided by the wall at connY, connX is a passage, make the whole thing a passage
                maze[y2][x2] = PASSAGE;
                let connY = y2 + Math.trunc((y - y2) / 2);
                let connX = x2 + Math.trunc((x - x2) / 2);
                maze[connY][connX] = PASSAGE;
                connectWithNeighbors(getNeighbors(x2, y2), x2, y2);
            }
            neighbors.splice(neigborNum, 1);
        }
    }

    function getNeighbors(x, y) {
        //get neighbors
        let neighbors = [];//"neighbors are 2 cells away"
        if (x > 1) { neighbors.push([y, x - 2]); }
        if (x < shapeX - 2) { neighbors.push([y, x + 2]); }
        if (y > 1) { neighbors.push([y - 2, x]); }
        if (y < shapeY - 2) { neighbors.push([y + 2, x]); }

        for (n of neighbors) {
            // n[0] is y
            y2 = n[0];
            x2 = n[1];
            let connY = y2 + Math.trunc((y - y2) / 2);
            let connX = x2 + Math.trunc((x - x2) / 2);
        }
        return neighbors;
    }

}

function Cell(spec) {
    let isPassage = false; //default
    let isOccupied = false; //default
    let containsBreadcrumb = false; //default
    let partOfShortestPath = false; //default

    isPassage = spec.isPassage;
    isOccupied = spec.isOccupied;
    containsBreadcrumb = spec.containsBreadcrumb;
    partOfShortestPath = spec.partOfShortestPath;

    Cell.prototype.toString = function () {
        return (this.isPassage) ? '1' : '0';
    }

    let thisCell = {
        isPassage: isPassage,
        isOccupied: isOccupied,
        containsBreadcrumb: containsBreadcrumb,
        partOfShortestPath: partOfShortestPath
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

function print2dArr(arr = []) {
    s = ''
    for (let i = 0; i < arr.length; i++) {
        let row = '';
        for (let j = 0; j < arr[0].length; j++) {
            row += arr[i][j];
        }
        s += row + '\n';
    }
    console.log(s)
}

function blankBoard(shapeX = 5, shapeY = 5, borderVal = 1, fillVal = 0) {//create 2d array filled with fillValue
    let a = [];
    for (let i = 0; i < shapeY; i++) {//for each row
        if (i == 0 || i == shapeY - 1) {
            var row = new Array(shapeX).fill(borderVal);
        } else {
            var row = new Array(shapeX).fill(fillVal);
        }
        row[0] = borderVal;
        row[shapeX - 1] = borderVal;
        a.push(row);
    }
    return a;
}

let maze = makeMaze(25, 15);
print2dArr(maze)