// The Pieces, each row represents a different rotation.
const lTetromino = [
    [[1,1],[1,2],[1,3],[2,3]],
    [[1,2],[0,2],[-1,2],[-1,3]],
    [[0,2],[0,1],[0,0],[-1,0]],
    [[-1,1],[0,1],[1,1],[1,0]]
]

const zTetromino = [
    [[1,1],[2,1],[2,2],[3,2]],
    [[3,2],[3,3],[2,3],[2,4]],
    [[2,4],[1,4],[1,3],[0,3]],
    [[1,1],[1,2],[0,2],[0,3]]
]

const sTetromino = [
    [[1,2],[2,1],[2,2],[3,1]],
    [[2,2],[3,3],[2,3],[3,4]],
    [[2,3],[1,4],[1,3],[0,4]],
    [[1,3],[0,2],[1,2],[0,1]]
]

const tTetromino = [
    [[1,1],[2,1],[2,2],[3,1]],
    [[1,0],[1,1],[0,1],[1,2]],
    [[0,0],[1,0],[1,-1],[2,0]],
    [[2,-1],[2,0],[3,0],[2,1]]
]

const oRotation = [[1,1],[1,2],[2,1],[2,2]]

const oTetromino =  [
    oRotation,oRotation,oRotation,oRotation
]

const iTetromino = [
    [[1,1],[1,2],[1,3],[1,4]],
    [[-1,3],[0,3],[1,3],[2,3]],
    [[0,1],[0,2],[0,3],[0,4]],
    [[-1,1],[0,1],[1,1],[2,1]]
]

const theTetrominoes = [lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
const typeOfTetrominoes = ['l', 'z', 's', 't', 'o', 'i']
const colours = ['orange', 'red', 'green', 'purple', 'yellow', 'blue']
const fallTime = 1000 // Default 1000 = 1 second.
const tileSize = 20 // Laptop preferred 20px, desktop preferred 40px, must change css accordingly.
let grid = createGrid()
let currentBlock
let scoreDisplay
let tetrominoID
let currentColumnIndex
let currentRowIndex
let rotation = 0
let timerId
let startBtn = null
let gameMusic = null
let score = 0

/**
 * Plays the tetris theme on loop.
 */
function playMusic() {
    gameMusic = new Audio('audio/tetrisTheme.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.5
    gameMusic.load();
    gameMusic.play()
}

/**
 * Pauses the tetris theme.
 */
function pauseMusic() {
    gameMusic.pause()
}

/**
 * Plays audio specified by filename.
 *
 * @param soundFileName
 */
function playSound(soundFileName) {
    if(typeof soundFileName === "string") {
        let gameSound = new Audio('audio/'+soundFileName+'.mp3')
        gameSound.play()
    }
}

/**
 * @returns A 20x10 2D array populated with empty strings.
 */
function createGrid() {
    console.log("grid")
    let gridSquares = []
    for (let i = 0; i < 20; i++) {
        gridSquares[i] = []
        for (let j = 0; j < 10; j++) {
            gridSquares[i][j] = ''
        }
    }
    return gridSquares
}

/**
 * Randomly spawns a new tetromino after checking for game over conditions.
 */
function newTetromino() {
    console.log("newTetromino")
    tetrominoID = Math.floor(Math.random() * theTetrominoes.length)
    currentRowIndex = 0
    currentColumnIndex = 4
    rotation = 0
    let currentPiece = theTetrominoes[tetrominoID]
    let tilesOfPiece = []
    for (let i = 0; i < currentPiece.length; i++) {
        tilesOfPiece[i] = document.createElement('div')
        tilesOfPiece[i].setAttribute("class","block")
        tilesOfPiece[i].setAttribute("id", typeOfTetrominoes[tetrominoID])
        document.getElementById("tetris-bg").appendChild(tilesOfPiece[i])
    }
    currentBlock = tilesOfPiece

    // Checks top of grid is empty
    let associativeArray = theTetrominoes[tetrominoID][rotation]
    if (associativeArray.some(index => grid[currentRowIndex + index[1] - 1][currentColumnIndex + index[0] - 1] !== '')) {
        gameOver()
    } else {
        // Update score
        addScore()

        // Draws tile onto screen
        currentBlock.forEach(tile => {
            tile.style.backgroundColor = colours[tetrominoID]
            tile.style.backgroundImage = 'url(images/' + colours[tetrominoID] + 'Tile.png)'
        })
        translate()
    }
}

/**
 * Checks every row in the grid to see if it is full, then removes said rows and shifts the rest of the tiles down
 * whilst adding new empty rows to the top of the grid.
 */
function completeRow() {
    console.log("complete row")
    let emptyRow = ['', '', '', '', '', '', '', '', '', '']
    let tileToBeRemoved
    let tileToBeShifted
    let removeCount = 0
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
        let complete = 0
        // Checks each column in the row to see if it is full.
        for (let columnIndex = 0; columnIndex < grid[rowIndex].length; columnIndex++) {
            if (grid[rowIndex][columnIndex] !== '') {
                complete++
            } else {
                break;
            }
        }
        // Remove a row.
        if (complete === 10) {
            removeCount++
            complete = 0
            // Deletes the div blocks.
            for (let i = 0; i < grid[rowIndex].length; i++) {
                tileToBeRemoved = grid[rowIndex][i]
                tileToBeRemoved.remove()
            }
            // Shifts down all the pieces above the removed row.
            for (let shiftDownRowIndex = rowIndex; shiftDownRowIndex >= 0; shiftDownRowIndex--) {
                for (let i = 0; i < grid[shiftDownRowIndex].length; i++) {
                    tileToBeShifted = grid[shiftDownRowIndex][i]
                    if (tileToBeShifted != '') {
                        let yAxis = parseInt(tileToBeShifted.style.top.slice(0,-2)) + tileSize
                        tileToBeShifted.style.top = yAxis + 'px'
                    }
                }
            }
            // Deletes the row from the grid and adds a new empty row.
            grid.splice(rowIndex,1)
            grid.unshift(emptyRow)
            console.log(grid)

        }
    }
    // Plays a special sound if 4 or more rows are removed at once.
    if (removeCount >= 4) {
        playSound("line-removal4")
    }else if (removeCount > 1) {
        playSound("line-remove")
    }
}

/**
 * Moves the blocks representing the tetromino.
 */
function translate() {
    console.log("translate")
    for (let i = 0; i < currentBlock.length; i++) {
        let tile = currentBlock[i]
        let pieceType = theTetrominoes[tetrominoID][rotation]
        let relativeColumnPosition = pieceType[i][0] - 1
        let relativeRowPosition = pieceType[i][1] - 1
        let xAxis = tileSize * (currentColumnIndex + relativeColumnPosition)
        let yAxis = tileSize * (currentRowIndex + relativeRowPosition)

        tile.style.left = xAxis + 'px'
        tile.style.top = yAxis + 'px'
    }
    currentBlock.forEach(tile => {
        console.log(tile)
    })
}

// Assign functions to keyCodes.
function keyboardInterrupt(keyInput) {
    console.log("keyboard interrupt")
    if (keyInput.keyCode === 32) {
        hardDrop()
    } else if (keyInput.keyCode === 37 || keyInput.keyCode === 65) {
        moveLeft()
    } else if (keyInput.keyCode === 38 || keyInput.keyCode === 87) {
        rotate()
    } else if (keyInput.keyCode === 39 || keyInput.keyCode === 68) {
        moveRight()
    } else if (keyInput.keyCode === 40 || keyInput.keyCode === 83) {
        moveDown()
    }
}

/**
 * @returns Boolean of if the tetromino would collide if it were to go down by one tile.
 */
function downCollisionDetection() {
    console.log("down collision detection")
    // Checks if tile below is floor or occupied.
    let associativeArray = theTetrominoes[tetrominoID][rotation]
    try {
        return (associativeArray.some(index => (currentRowIndex + index[1] === 20)) || associativeArray.some(index => grid[currentRowIndex + index[1]][currentColumnIndex + index[0] - 1] !== ''))
    } catch (error) {
        // Out of bounds but javascript returns undefined, so we catch a type error instead.
        if (error instanceof TypeError) {
            return true
        }else {
            throw error
        }
    }
}

/**
 * @returns Boolean of if the tetromino would collide if it were to go left by one tile.
 */
function leftCollisionDetection() {
    console.log("left collision detection")
    // Checks if tile below is left wall or occupied.
    let associativeArray = theTetrominoes[tetrominoID][rotation]
    try {
        return (associativeArray.some(index => currentColumnIndex + index[0] - 2 < 0) || associativeArray.some(index => grid[currentRowIndex + index[1] - 1][currentColumnIndex + index[0] - 2] !== ''))
    } catch (error) {
        // Out of bounds but javascript returns undefined, so we catch a type error instead.
        if (error instanceof TypeError) {
            return true
        }else {
            throw error
        }
    }
}

/**
 * @returns Boolean of if the tetromino would collide if it were to go right by one tile.
 */
function rightCollisionDetection() {
    console.log("right collision detection")
    // Checks if tile below is right wall or occupied.
    let associativeArray = theTetrominoes[tetrominoID][rotation]
    try {
        return (associativeArray.some(index => currentColumnIndex + index[0] > 9) || associativeArray.some(index => grid[currentRowIndex + index[1] - 1][currentColumnIndex + index[0]] !== ''))
    } catch (error) {
        // Out of bounds but javascript returns undefined, so we catch a type error instead.
        if (error instanceof TypeError) {
            return true
        }else {
            throw error
        }
    }
}

/**
 * @returns Boolean of if the tetromino is colliding with a border or block.
 */
function selfCollisionDetection() {
    console.log("self collision detection")
    let associativeArray = theTetrominoes[tetrominoID][rotation]
    // Checks if the tetromino is colliding.
    try {
        return (associativeArray.some(index => grid[currentRowIndex + index[1] - 1][currentColumnIndex + index[0] - 1] !== ''))
    } catch (error) {
        // Out of bounds but javascript returns undefined, so we catch a type error instead.
        if (error instanceof TypeError) {
            return true
        }else {
            throw error
        }
    }
}

/**
 * Moves the tetromino left by one tile.
 */
function moveLeft() {
    console.log("left")
    if (!leftCollisionDetection()) {
        currentColumnIndex--
        translate()
    }
}

/**
 * Moves the tetromino right by one tile.
 */
function moveRight() {
    console.log("right")
    if (!rightCollisionDetection()) {
        currentColumnIndex++
        translate()
    }
}

/**
 * Moves the tetromino down by one tile.
 */
function moveDown() {
    console.log("down")
    if (!downCollisionDetection()) {
        currentRowIndex++
        playSound("whoosh")
        translate()
    }
}

/**
 * Rotates the tetromino 90 degrees clockwise.
 */
function rotate() {
    console.log("rotate")
    rotation++
    rotation %= 4
    if (selfCollisionDetection()) {
        rotation--
        rotation %= 4
    }else {
        playSound("block-rotate")
    }
    translate()
}

/**
 * Moves the tetromino down until it collides.
 */
function hardDrop() {
    console.log("hard drop")
    while (!downCollisionDetection()) {
        currentRowIndex++
    }
    playSound("line-drop")
    translate()
    freeze()
}

/**
 * Stops the tetromino in place and calls for a complete row check and a new tetromino.
 */
function freeze() {
    console.log(grid)
    if (downCollisionDetection()) {
        let associativeArray = theTetrominoes[tetrominoID][rotation]
        for (let i = 0; i < associativeArray.length; i++) {
            let index = associativeArray[i]
            let tile = currentBlock[i]
            try {
                grid[currentRowIndex + index[1] - 1][currentColumnIndex + index[0] - 1] = tile
            } catch (error) {
                // Out of bounds but javascript returns undefined, so we catch a type error instead.
                if (!(error instanceof TypeError)) {
                    throw error
                }
            }

        }
        completeRow()
        newTetromino()
    } else {
        moveDown()
    }

}

/**
 * Adds one to the users score and displays it on the webpage.
 */
function addScore() {
    score++
    scoreDisplay.innerHTML = score
}

/**
 * Resets the game and posts the users score to the server.
 */
function gameOver() {
    console.log("Game Over")
    startBtn.style.visibility = "visible";
    pauseMusic()
    playSound('gameOver')
    document.removeEventListener('keyup', keyboardInterrupt)
    clearInterval(timerId)
    grid = createGrid()
    let scoreForm = document.getElementById('score-form')
    let scoreInput = document.getElementById('score-input')
    scoreInput.setAttribute('value',score)
    scoreForm.submit()
}

// Start of the code.
document.addEventListener('DOMContentLoaded', () => {
    // Page Setup
    startBtn = document.querySelector('#start-button')
    scoreDisplay = document.querySelector('#score')

    startBtn.addEventListener('click', () => {
        console.log("startbtn")
        document.getElementById("tetris-bg").innerHTML = ''
        startBtn.style.visibility = "hidden";
        //playMusic()
        score = 0
        document.addEventListener('keyup', keyboardInterrupt)
        timerId = setInterval(freeze, fallTime)

        newTetromino()
    })
})

