'use strict'

var gBoard

const MINE = '💣'
const FLAG = '🚩'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInIt() {
    gBoard = buildBoard()
    getRandomMines()
    renderBoard(gBoard)
    console.table(gBoard)
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board;
}

function getRandomMines() {
    var minesNum = gLevel.SIZE
    for (var i = 0; i <= minesNum; i++) {
        var currCell = drawCell()
        currCell.isMine = true
    }
}

function drawCell() {
    var randIdx = getRandomInt(0, gBoard.length)
    var rand2ndIdx = getRandomInt(0, gBoard.length)
    var randCell = gBoard[randIdx][rand2ndIdx]
    return randCell
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = gBoard[i][j]
            var minesCount = setMinesNegsCount(board, i, j)
            currCell = (currCell.isMine) ? MINE : minesCount
            var className = 'cell closed'
            strHTML += `<td data-i="${i}" data-j="${j}" class="${className}" onclick="cellClicked(this, ${i},${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML += strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesCountAround = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) minesCountAround++
        }
    }
    return minesCountAround
}

function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    var minesCount = setMinesNegsCount(gBoard, i, j)
    if (!currCell.isShown) {
        elCell.classList.remove('closed')
        currCell.isShown = true
        if (currCell.isMine) elCell.innerHTML = MINE
        else if (minesCount === 0) elCell.innerHTML = ''
        else elCell.innerHTML = minesCount
    }
}