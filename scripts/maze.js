function maze(width = 81, height = 51) {
    let WALL = 0;
    let PASSAGE = 1;
    // only odd shapes
    let shapeX = Math.trunc(width / 2) * 2 + 1;
    let shapeY = Math.trunc(height / 2) * 2 + 1;
    console.log('w', width, 'sx', shapeX)
    console.log('h', height, 'sy', shapeY)

    // build actual maze
    var Z = blankBoard(shapeX = shapeX, shapeY = shapeY, borderVal = WALL, fillVal = WALL)
    console.log(Z)
    print2dArr(Z)

    let x = getRandomInt(shapeX - 1)
    let y = getRandomInt(shapeY - 1)

    let neighbors = getNeighbors(x, y);
    Z[y][x] = PASSAGE;//make the cell a passage
    connectWithNeighbors(neighbors, x, y);

    function connectWithNeighbors(neighbors, x, y) {
        //try to connect with random neighbor if they are a passage
        while (neighbors.length > 0) {
            // console.log(neighbors)
            let neigborNum = getRandomInt(neighbors.length - 1);
            let y2 = neighbors[neigborNum][0];//random neighbor
            let x2 = neighbors[neigborNum][1];
            if (Z[y2][x2] == WALL) {//if only one of the two cells divided by the wall at connY, connX is a passage, make the whole thing a passage
                Z[y2][x2] = PASSAGE;
                let connY = y2 + Math.trunc((y - y2) / 2);
                let connX = x2 + Math.trunc((x - x2) / 2);
                Z[connY][connX] = PASSAGE;
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

    print2dArr(Z)
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

maze(20, 15, complexity = 1, density = 15);