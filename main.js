'use strict'

const MINE = '💣'
const FLAG = '🚩'
const DEAD = '😵'
const THINK = '🤔'
const WON = '😎'
const LIVE = '❤️‍🔥'
const HINT = '💡'

var gBoard
var gGame
var isFirstClick
var gIsHint
var gSeconds = 0
var gGameInterval
var gClicksNum
var gLives
var gHints
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
    setMines()
    renderBoard(gBoard)
    isFirstClick = true
    gIsHint = false
    minutesLabel.innerHTML = '00'
    secondsLabel.innerHTML = '00'
    totalSeconds = 0
    gClicksNum = 0
    gLives = 3
    gHints = 3
    renderLives()
    renderHints()
    document.querySelector('.restart-btn').innerText = THINK
    clearInterval(gGameInterval)
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
            if (currCell.isMine) className += ' mine' // Add 'mine' class for every Mine
            var minesCount = setMinesNegsCount(board, i, j)
            currCell.minesAroundCount = minesCount // Add the negMines to every cell object
            strHTML += `<td class="cell ${className}"
            onclick="cellClicked(this, ${i},${j})";
            oncontextmenu="onRightClick(this, ${i},${j})" ></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) { // simple negs function
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
    if (gBoard[i][j].isMarked) { // Right click on a Marked cell
        gGame.markedCount--
        // Model
        gBoard[i][j].isMarked = false
        //DOM
        elCell.innerHTML = ''
        gClicksNum++
        if (gBoard[i][j].isMine) gGame.markedMines--
    } else { // Right click on any other cell
        if (gGame.markedCount === gLevel.MINES) return // Dont allow to use more flag than mines
        gClicksNum++
        startTimer()
        gGame.markedCount++
        if (gBoard[i][j].isMine) gGame.markedMines++
        // Model
        gBoard[i][j].isMarked = true
        //DOM
        elCell.innerHTML = FLAG
        checkVictory()
    }
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var currCell = gBoard[i][j]
    if (currCell.isMarked) return // Dont allow to click on marked cell
    if (gIsHint) {
        return revealNegs(i, j)
    }
    if (!currCell.isShown) {
        // Model
        currCell.isShown = true
        // DOM
        elCell.classList.add('opened')
        gClicksNum++
        gGame.shownCount++
        // var sound = new Audio('Sound/click.wav') // Play click sound
        // sound.play()
        startTimer() // Start timer only on first click
        checkVictory() // Check maybe its the last cell
        if (currCell.isMine) { // When clicking on Mine
            if (isFirstClick) {
                return handleFirstClick(currCell)
            }
            // Model 
            gBoard[i][j].isShown = true
            // DOM
            elCell.innerHTML = MINE
            gLives-- // Remove one Life
            renderLives()
            if (gLives === 0) {
                revealAllMine()
                gGame.isOn = false
                document.querySelector('.restart-btn').innerText = DEAD // Put a BOMBED face
                var sound = new Audio('Sound/lose_minesweeper.wav') // Play lose sound
                sound.play()
                clearInterval(gGameInterval) // Stop timer
            }
        } else if (currCell.minesAroundCount) {
            renderCell(currCell, currCell.minesAroundCount) // When clicking on cell with Negs only show the Num
        }
        else expandMines(gBoard, i, j) // When clicking on cell without Negs, start the Show 😎
    }
    isFirstClick = false
    checkVictory() // Another check for win
}

function revealNegs(cellI, cellJ) {
    gIsHint = false
    var openedCells = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (gBoard[i][j].isMine) elCell.innerHTML = MINE
            else if (gBoard[i][j].minesAroundCount) elCell.innerHTML = gBoard[i][j].minesAroundCount
            elCell.classList.add('opened')
            openedCells.push({ i, j })
        }
    }
    setTimeout(() => {
        for (var i = 0; i < openedCells.length; i++) {
            var currCell = openedCells[i]
            var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)
            if (!gBoard[currCell.i][currCell.j].isShown) {
                elCell.classList.remove('opened')
                elCell.innerHTML = ''
            }
        }
        gHints--
        document.querySelector('.hints').innerHTML = HINT.repeat(gHints)
    }, 1000);
}

function handleFirstClick(cell) {
    gBoard = buildBoard()
    setMines(cell)
    renderBoard(gBoard)
    isFirstClick = false
    gClicksNum--
    gGame.shownCount--

    var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
    cellClicked(elCell, cell.i, cell.j)
}

function expandMines(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) { // Reach only Empty/Negs Cells
                // Model
                currCell.isShown = true
                gGame.shownCount++
                //DOM
                document.querySelector('.cell-' + i + '-' + j).classList.add('opened')
                if (currCell.minesAroundCount) renderCell(currCell, currCell.minesAroundCount) // Cell with Negs
                else expandMines(gBoard, i, j) // Cell without Negs, run the show again 😎
            }
        }
    }
}

function renderLives() { // Render ❤️‍🔥 for gLives amount
    document.querySelector('.lives').innerText = LIVE.repeat(gLives)
}

function renderHints() {
    document.querySelector('.hints').innerText = HINT.repeat(gHints)
}

function onHintClick() {
    gIsHint = true
}

function setMines(cell = null) { // Place Mines randomly
    var minesNum = gLevel.MINES
    for (var i = 0; i < minesNum; i++) {
        var currCell = drawCell()
        if (cell) {
            if (currCell.i === cell.i && currCell.j === cell.j) {
                i--
                continue
            }
        }
        currCell.isMine = true
    }
}

function revealAllMine() { // When losing, reveal all the Mines
    var allMines = document.querySelectorAll('.mine')
    allMines.forEach((td) => {
        td.classList.add('opened');
        td.innerHTML = MINE
    })
}

function checkVictory() {
    if (gGame.shownCount + gGame.markedMines === gLevel.SIZE * gLevel.SIZE) { // The condition to win
        gGame.isOn = false
        clearInterval(gGameInterval)
        document.querySelector('.restart-btn').innerText = WON
        var sound = new Audio('Sound/win.wav')
        sound.play()
    }
}

function changeLevel(el) {
    if (el.innerText === "Beginner") {
        el.style.backgroundColor = 'rgb(186, 134, 113)'
        gLevel.SIZE = 4
        gLevel.MINES = 2
        document.querySelector('.b2').style.backgroundColor = 'lightgray'
        document.querySelector('.b2').style.backgroundColor = 'lightgray'
    } else if (el.innerText === "Professional") {
        el.style.backgroundColor = 'rgb(186, 134, 113)'
        gLevel.SIZE = 8
        gLevel.MINES = 14
        document.querySelector('.b1').style.backgroundColor = 'lightgray'
        document.querySelector('.b3').style.backgroundColor = 'lightgray'
    } else if (el.innerText === "Legendary") {
        el.style.backgroundColor = 'rgb(186, 134, 113)'
        gLevel.SIZE = 12
        gLevel.MINES = 32
        document.querySelector('.b1').style.backgroundColor = 'lightgray'
        document.querySelector('.b2').style.backgroundColor = 'lightgray'
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