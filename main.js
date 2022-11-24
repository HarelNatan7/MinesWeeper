'use strict'

const MINE = '💣'
const FLAG = '🚩'
const DEAD = '😵'
const THINK = '🤔'
const WON = '😎'
const LIVE = '❤️‍🔥'

var gBoard
var gGame
var gSeconds = 0
var gGameInterval
var gClicksNum
var gLives
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInIt() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        markedMines: 0,
        secsPassed: 0
    }
    gBoard = buildBoard()
    getRandomMines()
    renderBoard(gBoard)
    minutesLabel.innerHTML = '00'
    secondsLabel.innerHTML = '00'
    totalSeconds = 0
    gClicksNum = 0
    gLives = 3
    renderLives()
    document.querySelector('.restart-btn').innerText = THINK
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                i: i,
                j: j,
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

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = gBoard[i][j]
            var className = getClassName({ i, j })
            if (currCell.isMine) className += ' mine'
            var minesCount = setMinesNegsCount(board, i, j)
            currCell.minesAroundCount = minesCount
            strHTML += `<td data="${i}-${j}" class="cell ${className}"
            onclick="cellClicked(this, ${i},${j})";
            oncontextmenu="onRightClick(this, ${i},${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesCountAround = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) board[i][j].minesAroundCount = ++minesCountAround
        }
    }
    return minesCountAround
}

function onRightClick(elCell, i, j) {
    if (gBoard[i][j].isMarked) {
        gGame.markedCount--
        // Model
        gBoard[i][j].isMarked = false
        //DOM
        elCell.innerHTML = ''
        gClicksNum++
        if (gBoard[i][j].isMine) gGame.markedMines--
    } else {
        if (gGame.markedCount === gLevel.MINES) return
        gClicksNum++
        startTimer()
        gGame.markedCount++
        if (gBoard[i][j].isMine) gGame.markedMines++
        checkVictory()
        // Model
        gBoard[i][j].isMarked = true
        //DOM
        elCell.innerHTML = FLAG
    }
}

function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return
    if (currCell.isMarked) return
    if (!currCell.isShown) {
        // Model
        currCell.isShown = true
        // DOM
        elCell.classList.add('opened')
        gClicksNum++
        gGame.shownCount++
        var sound = new Audio('Sound/click.wav')
        sound.play()
        startTimer()
        checkVictory()
        if (currCell.isMine) {
            gLives--
            gBoard[i][j].isShown = true
            renderLives()
            elCell.innerHTML = MINE
            if (gLives === 0) {
                revealAllMine()
                gGame.isOn = false
                document.querySelector('.restart-btn').innerText = DEAD
                var sound = new Audio('Sound/lose_minesweeper.wav')
                sound.play()
                clearInterval(gGameInterval)
            }
        } else if (currCell.minesAroundCount) renderCell(currCell, currCell.minesAroundCount)
        else expandMines(gBoard, i, j)
        checkVictory()
    }
}

function expandMines(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                // Model
                currCell.isShown = true
                gGame.shownCount++
                //DOM
                document.querySelector('.cell-' + i + '-' + j).classList.add('opened')
                if (currCell.minesAroundCount) renderCell(currCell, currCell.minesAroundCount)
                else expandMines(gBoard, i, j)
            }
        }
    }
}

function renderLives() {
    document.querySelector('.lives').innerText = LIVE.repeat(gLives)
}

function getRandomMines() {
    var minesNum = gLevel.MINES
    for (var i = 0; i < minesNum; i++) {
        var currCell = drawCell()
        currCell.isMine = true
    }
}

function revealAllMine() {
    var allMines = document.querySelectorAll('.mine')
    allMines.forEach((td) => {
        td.classList.add('opened');
        td.innerHTML = MINE
    })
}

function checkVictory() {
    if (gGame.shownCount + gGame.markedMines === gLevel.SIZE * gLevel.SIZE) {
        gGame.isOn = false
        clearInterval(gGameInterval)
        document.querySelector('.restart-btn').innerText = WON
        var sound = new Audio('Sound/win.wav')
        sound.play()
    }
}

function changeLevel(el) {
    if (el.innerText === "Beginner") {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (el.innerText === "Professional") {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (el.innerText === "Legendary") {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
}

function restartButton() {
    clearInterval(gGameInterval)
    gClicksNum = 0
    document.querySelector('.restart-btn').innerText = THINK
    onInIt()
}

function drawCell() {
    var randIdx = getRandomInt(0, gBoard.length)
    var rand2ndIdx = getRandomInt(0, gBoard.length)
    var randCell = gBoard[randIdx][rand2ndIdx]
    return randCell
}

function startTimer() {
    if (gClicksNum === 1) gGameInterval = setInterval(setTime, 1000);
}

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}