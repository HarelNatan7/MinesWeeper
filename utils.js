'use strict'

//* GETS AN EMPTY GLOBAL VAR OF GNUMS AND BUILDS IT ACCORDING TO THE GNUMSRANGE LENGTH
function resetNums() {
    gNums = []
    for (var i = 0; i < gNumsRange; i++) {
        gNums.push(i + 1)
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* DRAWS A RANDOM NUMBER FROM GNUMS ARRAY AND SPLICES THAT NUM SO IT WONT REPEAT ITSELF
//needs globla gNums
function drawCell() {
    var randIdx = getRandomInt(0, gNums.length)
    var num = gNums[randIdx]
    gNums.splice(randIdx, 1)
    return num
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* GET RANDOM INT INCLUSIVE / EXLUCIVE
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
//!/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* CREATES BOARD ACCORDING TO GLOBAL SIZE VAR
function createBoard() {
    var size = gSize
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = VAR /**what we put in */
        }
    }
    return board
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* GETS A BOARD FROM CREATEBOARD AND RENDERING IT TO THE DOM
//renders only tr so need to come inside a table with class board
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellData = `data="i-j"`
            strHTML += `<td data-i=“${i}” data-j=“${j}” onclick=“onCellClicked(this, ${currCell})” >${currCell}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML += strHTML
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* INCASE WE NEED TO WORK/RENDER ON NEW MATRIX
function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* CREATE ITEMS
function createBalloons(count) {
    var balloons = []
    for (var i = 0; i < count; i++) {
        var balloon = createBalloon(i)
        balloons.push(balloon)
    }
    return balloons
}
///////////////////////////////////////////////////////////////////////////////////////////////
function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* RENDER ONLY CELL TO DOM
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
    elCell.classList.add(`num-color-${value}`)
}
////////////////////////////////////////////////////////////////
//* GET RANDOM COLOR
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* SHOW / HIDE ELEMENT
function hideElement(selector) {
    const el = document.querySelector(selector)
    el.hidden = true
}
function showElement(selector) {
    const el = document.querySelector(selector)
    el.hidden = false
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* GET ANY CELL TO AN ARRAY
function getEmptyCell(board) {
    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (!currCell)
                emptyCells.push({ i: i, j: j })
        }
    }
    //* CHOOSE A RANDOM INDEX FROM THAT ARRAY AND RETURN THE CELL ON THAT INDEX
    const randomIdx = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[randomIdx]
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* NEIGHBORS LOOP
function countFoodAround(board, rowIdx, colIdx) {
    var countAround = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            countAround++
        }
    }
    return countAround
}
///////////////////////////////////////////////////////////////////////////////////////////////
//* NEIGHBORS LOOP SAYS WHO IS SOMTHING
function countFoodAround(board, rowIdx, colIdx) {
    var countAround = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            //   if(/**what you need to find */)
            //   countAround.push(board[i][j])
        }
    }
    return countAround
}
////////////////////////////////////////////////////////////
// printPrimaryDiagonal(gMat)
function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d]
        console.log(item)
    }
}
// printSecondaryDiagonal(gMat)
function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1]
        console.log(item)
    }
}
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}