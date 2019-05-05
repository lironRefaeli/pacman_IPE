var canvas = document.getElementById('canvas')
let context = canvas.getContext('2d');
let game_interval;
let keyPressed;
let arrowsHandlerAF;

//game variables
let board;
let borad_columns;
let board_rows;
let myCopyBoard;
let pacman_direction;
let pacman;
let initPacmanRandomly; //pick pacman's position randomly at the first interval
let upEntry;
let leftEntry;
let rightEntry;
let downEntry;
let monster_array;
let number_of_points_input;
let points_color_5;
let points_color_15;
let points_color_25;
let music;
let score = 0;
let num_of_lives = 3;
let ateBonus = false;
let ateHeart = false;
let ateClock = false;
let numOfMonstersByUser = 2;
let gameTimeByUser = 70;
let keyboard = "1";
let session_is_over = false;
let player_win;
let to_init_points = true;


let wallImage = new Image();
wallImage.src = "wall.jpg";
let pacmanPlayerRight = new Image();
pacmanPlayerRight.src = "pacmanPlayerRight.jpg";
let pacmanPlayerUp = new Image();
pacmanPlayerUp.src = "pacmanPlayerUp.jpg";
let pacmanPlayerDown = new Image();
pacmanPlayerDown.src = "pacmanPlayerDown.jpg";
let pacmanPlayerLeft = new Image();
pacmanPlayerLeft.src = "pacmanPlayerLeft.jpg";
let monsterImage = new Image();
monsterImage.src = "monster.jpg";
let throphyImage = new Image();
throphyImage.src = "throphy.jpg";
let heartImage = new Image();
heartImage.src = "heart.png";
let clockImage = new Image();
clockImage.src = "clock.jpg";

//metadata variables
let start_time;
let time_on_clock;

//board variables
borad_columns = 19;
board_rows = 12;
board = [borad_columns];
myCopyBoard = [borad_columns];
keyPressed = {};

//define cells' representation
const freeCell = 0;
const wallCell = 1;
const pacmanCell = 2;
const monsterCell = 3;
const pointsCell5 = 5;
const pointsCell15 = 15;
const pointsCell25 = 25;
const bonusCell = 50;
const heartCell = 100;
const clockCell = 150;

function PlayGame() {

    keyboard = parseInt($('input[name=keyboard]:checked').val());
    number_of_points_input = document.getElementById('numOfBalls').value;
    points_color_5 = document.getElementById('fivePoints').value;
    points_color_15 = document.getElementById('fifteenPoints').value;
    points_color_25 = document.getElementById('twentyFivePoints').value;
    gameTimeByUser = document.getElementById('time').value;
    numOfMonstersByUser = document.getElementById('numOfMonsters').value;
    settingsModal.style.display = "none";
    updateData();
    display('game');
    initMusic();
    initGame();
}

function ChooseValusRandom() {

    settingsModal.style.display = "none";
    keyboard = 1;
    number_of_points_input = getRndInteger(50, 90);
    points_color_5 = getRandomColor();
    points_color_15 = getRandomColor();
    points_color_25 = getRandomColor();
    gameTimeByUser = getRndInteger(60, 120);
    numOfMonstersByUser = getRndInteger(1, 3);
    updateData();
    display('game');
    initMusic();
    initGame();

}

function updateData() {
    score = 0;
    num_of_lives = 3;
    to_init_points = true;
    if (ateBonus)
        ateBonus = false;
    if (ateClock)
        ateClock = false;
    if (ateHeart)
        ateHeart = false;
    document.getElementById("labelScore").value = 0;

    $('#life1').css("visibility", "visible");
    $('#life2').css("visibility", "visible");
    $('#life3').css("visibility", "visible");
    $('#life4').css("visibility", "hidden");
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function initGame() {
    if (num_of_lives != 0) {
        start_time = new Date();
        gameTimeByUser;
        document.getElementById("labelTime").value = gameTimeByUser + " seconds";
        document.getElementById("labelScore").value = score;
        initEntries();
        initPacmanData();
        initGameBoard();
        if (to_init_points) {
            initPoints();
            to_init_points = false;
        }
        else {
            copyPoints();
        }
        initCopyBoard();
        copyBoardToBoard(); //for saving the points positions
        //initMusic();
        initBonus();
        if (!ateHeart) {
            initHeart();
        }
        initClock();
        arrowKeysHandler();
        initMonstersStartPositions();
        drawPacmanPlayerRandomly();
        draw();

        switch (keyboard) {
            case 1:
                addEventListener("keydown", arrowsHandlerAF); //when 'keydown' event occurs, 'arrowsHandlerAF' is called
                break;

            case 2:
                addEventListener("keydown", lettersHandlerAF); //when 'keydown' event occurs, 'arrowsHandlerAF' is called
                break;

            case 3:
                addEventListener("keydown", numbersHandlerAF); //when 'keydown' event occurs, 'arrowsHandlerAF' is called
                break;
        }

    }

}


function initEntries() {
    upEntry = new Object();
    upEntry.j = 0;
    upEntry.i = 9;
    leftEntry = new Object()
    leftEntry.j = 6;
    leftEntry.i = 0;
    rightEntry = new Object();
    rightEntry.j = 4;
    rightEntry.i = 18;
    downEntry = new Object();
    downEntry.j = 11;
    downEntry.i = 7;
}

function initPacmanData() {
    pacman = new Object();
    pacman_direction = "right";
    initPacmanRandomly = true;
}

function initGameBoard() {

    // i is for columns, j is for rows
    for (let i = 0; i < borad_columns; i++) {
        board[i] = new Array(board_rows);
        for (let j = 0; j < board[i].length; j++) {
            if (isWall(i, j)) {
                board[i][j] = wallCell;
            }
            else {
                board[i][j] = freeCell;
            }
        }
    }
}

function initPoints() {
    var numOf5Points = number_of_points_input * 0.6;
    var numOf15Points = number_of_points_input * 0.3;
    var numOf25Points = number_of_points_input * 0.1;

    var emptyCell;

    for (var i = 0; i < numOf5Points; i++) {
        emptyCell = getRandomFreeCell();
        board[emptyCell[0]][emptyCell[1]] = pointsCell5;
    }
    for (var i = 0; i < numOf15Points; i++) {
        emptyCell = getRandomFreeCell();
        board[emptyCell[0]][emptyCell[1]] = pointsCell15;
    }
    for (var i = 0; i < numOf25Points; i++) {
        emptyCell = getRandomFreeCell();
        board[emptyCell[0]][emptyCell[1]] = pointsCell25;
    }
}

function copyPoints() {
    for (var i = 0; i < borad_columns; i++) {
        for (var j = 0; j < board_rows; j++) {
            if (myCopyBoard[i][j] === pointsCell5 || myCopyBoard[i][j] === pointsCell15 || myCopyBoard[i][j] === pointsCell25) {
                board[i][j] = myCopyBoard[i][j];
            }
        }
    }
}

function initCopyBoard() {
    for (let i = 0; i < borad_columns; i++) {
        myCopyBoard[i] = new Array(board_rows);
        for (let j = 0; j < board[i].length; j++) {
            myCopyBoard[i][j] = 0;
        }
    }
}

function initMusic() {
    if (music != null)
        music.pause();
    music = document.createElement("AUDIO");
    music.setAttribute("src", "music.mp3");
    music.play();
}

function initBonus() {
    ateBonus = false;
    bonusImage = new Object();
    emptyCell = getRandomFreeCell();
    bonusImage.i = 1
    bonusImage.j = 10
    board[1][10] = bonusCell;
    myCopyBoard[1][10] = bonusCell;

}

function initHeart() {
    ateHeart = false;
    heart = new Object();
    emptyCell = getRandomFreeCell();
    heart.i = emptyCell[0];
    heart.j = emptyCell[1];
    board[emptyCell[0]][emptyCell[1]] = heartCell;
    myCopyBoard[emptyCell[0]][emptyCell[1]] = heartCell;
}

function initClock() {
    ateClock = false;
    clock = new Object();
    emptyCell = getRandomFreeCell();
    clock.i = emptyCell[0];
    clock.j = emptyCell[1];
    board[emptyCell[0]][emptyCell[1]] = clockCell;
    myCopyBoard[emptyCell[0]][emptyCell[1]] = clockCell;
}

function arrowKeysHandler() {
    arrowsHandlerAF = function (e) {

        if (start_time === undefined)
            start_time = new Date();

        if (game_interval === undefined)
            defineInterval();


        for (let i = 37; i < 41; i++) {
            keyPressed[i] = false;
        }

        switch (e.keyCode) {
            case 38:
                keyPressed[38] = true;
                break;

            case 40:
                keyPressed[40] = true;
                break;

            case 37:
                keyPressed[37] = true;
                break;

            case 39:
                keyPressed[39] = true;
                break;
        }
    }

    lettersHandlerAF = function (e) {

        if (start_time === undefined)
            start_time = new Date();

        if (game_interval === undefined)
            defineInterval();

        keyPressed[65] = false;  //a
        keyPressed[83] = false; //s
        keyPressed[68] = false; //d
        keyPressed[87] = false; //w

        switch (e.keyCode) {
            case 65:
                keyPressed[65] = true;
                break;

            case 83:
                keyPressed[83] = true;
                break;

            case 68:
                keyPressed[68] = true;
                break;

            case 87:
                keyPressed[87] = true;
                break;
        }
    }

    numbersHandlerAF = function (e) {

        if (start_time === undefined)
            start_time = new Date();

        if (game_interval === undefined)
            defineInterval();

        keyPressed[49] = false;  //1
        keyPressed[50] = false; //2
        keyPressed[51] = false; //3
        keyPressed[53] = false; //5

        switch (e.keyCode) {
            case 49:
                keyPressed[49] = true;
                break;

            case 50:
                keyPressed[50] = true;
                break;

            case 51:
                keyPressed[51] = true;
                break;

            case 53:
                keyPressed[53] = true;
                break;
        }
    }


}

function GetKeyPressed() {
    if (keyboard === 1) {
        if (keyPressed[38]) {
            return 1; // up
        }
        else if (keyPressed[40]) {
            return 2; // down
        }
        else if (keyPressed[37]) {
            return 3; // left
        }
        else if (keyPressed[39]) {
            return 4; // right
        }
    }

    if (keyboard === 2) {
        if (keyPressed[87]) {
            return 1; // up
        }
        else if (keyPressed[83]) {
            return 2; // down
        }
        else if (keyPressed[65]) {
            return 3; // left
        }
        else if (keyPressed[68]) {
            return 4; // right
        }
    }

    if (keyboard === 3) {
        if (keyPressed[53]) {
            return 1; // up
        }
        else if (keyPressed[50]) {
            return 2; // down
        }
        else if (keyPressed[49]) {
            return 3; // left
        }
        else if (keyPressed[51]) {
            return 4; // right
        }
    }

}


function defineInterval() {
    clearInterval(game_interval);
    game_interval = setInterval(updateCharactersPositions, 250); //every 270 millis func 'updateCharactersPosition' is being called
}

function updateCharactersPositions() {
    updateGameTime();
    if (!ateBonus) {
        updateBonusHeartOrClockPosition(bonusImage, bonusCell);
    }
    if (!ateHeart) {
        updateBonusHeartOrClockPosition(heart, heartCell);
    }
    if (!ateClock) {
        updateBonusHeartOrClockPosition(clock, clockCell);
    }

    updatePacmanPosition();
    updateMonstersPosition();
    draw();
    if (session_is_over) {
        endSession();
    }

}

function updateGameTime() {

    var currentTime = document.getElementById("labelTime").value;
    var time_on_clock = parseFloat(currentTime.substring(0, currentTime.indexOf(' ')));
    if (time_on_clock < 0) {
        endGame();
    }
    gameTimeByUser = time_on_clock - 0.25
    document.getElementById("labelTime").value = gameTimeByUser + " seconds";
}

function updateMonstersPosition() {

    //i is columns, j is rows
    for (var i = 0; i < monster_array.length; i++) {
        monster = monster_array[i];

        if (board[monster.i][monster.j] === pacmanCell) {
            score = score - 10;
            session_is_over = true;
            return;
        }

        //This cell was a pointCell before it was monsterCell
        if (myCopyBoard[monster.i][monster.j] === pointsCell5 || myCopyBoard[monster.i][monster.j] === pointsCell15 ||
            myCopyBoard[monster.i][monster.j] === pointsCell25) {
            restorePointsToBoard(monster.i, monster.j);
        }
        else {
            board[monster.i][monster.j] = freeCell;
        }

        xDistance = monster.i - pacman.i;
        yDistance = monster.j - pacman.j;

        //monster's bottom-right from pacman
        if (xDistance >= 0 && yDistance >= 0) {
            var goLeft = true;
            if (xDistance === 0) { goLeft = false; }
            //move monster left
            if (kindOfCell(monster.i - 1, monster.j) != wallCell && kindOfCell(monster.i - 1, monster.j) != monsterCell && goLeft) {
                monster.i--;
            }
            //move monster up
            else if (kindOfCell(monster.i, monster.j - 1) != wallCell && kindOfCell(monster.i, monster.j - 1) != monsterCell) {
                monster.j--;
            }
            //move monster right 
            else if (kindOfCell(monster.i + 1, monster.j) != wallCell) {
                monster.i++;
            }
            //move monster down
            else if (kindOfCell(monster.i, monster.j + 1) != wallCell) {
                monster.j++;
            }
        }

        //monster's top-right from pacman
        if (xDistance >= 0 && yDistance < 0) {
            var goLeft = true;
            if (xDistance === 0) { goLeft = false; }

            //move monster left
            if (kindOfCell(monster.i - 1, monster.j) != wallCell && kindOfCell(monster.i - 1, monster.j) != monsterCell && goLeft) {
                monster.i--;
            }
            //move monster down
            else if (kindOfCell(monster.i, monster.j + 1) != wallCell && kindOfCell(monster.i, monster.j + 1) != monsterCell) {
                monster.j++;
            }
            //move monster up
            else if (kindOfCell(monster.i, monster.j - 1) != wallCell) {
                monster.j--;
            }
            //move monster right
            else if (kindOfCell(monster.i + 1, monster.j) != wallCell) {
                monster.i++;
            }

        }

        //monster's top-left from pacman
        if (xDistance < 0 && yDistance < 0) {
            //move monster right
            if (kindOfCell(monster.i + 1, monster.j) != wallCell && kindOfCell(monster.i + 1, monster.j) != monsterCell) {
                monster.i++;
            }
            //move monster down
            else if (kindOfCell(monster.i, monster.j + 1) != wallCell && kindOfCell(monster.i, monster.j + 1) != monsterCell) {
                monster.j++;
            }
            //move monster up
            else if (kindOfCell(monster.i, monster.j - 1) != wallCell) {
                monster.j--;
            }
            //move monster left
            else if (kindOfCell(monster.i - 1, monster.j) != wallCell) {
                monster.i--;
            }
        }

        //monster's bottom-left from pacman
        if (xDistance < 0 && yDistance >= 0) {
            //move monster right
            if (kindOfCell(monster.i + 1, monster.j) != wallCell && kindOfCell(monster.i + 1, monster.j) != monsterCell) {
                monster.i++;
            }
            //move monster up
            else if (kindOfCell(monster.i, monster.j - 1) != wallCell && kindOfCell(monster.i, monster.j - 1) != monsterCell) {
                monster.j--;
            }
            //move monster down
            else if (kindOfCell(monster.i, monster.j + 1) != wallCell) {
                monster.j++;
            }
            //move monster left
            else if (kindOfCell(monster.i - 1, monster.j) != wallCell) {
                monster.i--;
            }
        }
        monster_array[i] = monster;
        if (board[monster.i][monster.j] === pacmanCell) {
            score = score - 10;
            session_is_over = true;
            return;
        }
        board[monster.i][monster.j] = monsterCell;
        if (board[monster.i][monster.j] === board[pacman.i][pacman.j]) {

        }
    }

}

function updatePacmanPosition() {
    let direction = GetKeyPressed();

    board[pacman.i][pacman.j] = 0;
    myCopyBoard[pacman.i][pacman.j] = 0;

    // i is columns, j is rows
    switch (direction) {
        case 1: //up or entry in the upper frame
            if ((pacman.j > 1 && kindOfCell(pacman.i, pacman.j - 1) != wallCell) ||
                pacman.j === (upEntry.j + 1) && pacman.i === upEntry.i) {
                pacman.j--;
                pacman_direction = "up";
            }
            else if (pacman.j === upEntry.j && pacman.i === upEntry.i) {
                pacmanChangeEntry("upToBottom");
            }
            break;

        case 2: //down or entry in the bottom frame
            if (((pacman.j < board_rows - 2) && kindOfCell(pacman.i, pacman.j + 1) != wallCell) ||
                pacman.j === (downEntry.j - 1) && pacman.i === downEntry.i) {
                pacman.j++;
                pacman_direction = "down";
            }
            else if (pacman.j === downEntry.j && pacman.i === downEntry.i) {
                pacmanChangeEntry("bottomToUp");
            }
            break;

        case 3: //left or entry in the left frame
            if ((pacman.i > 1 && kindOfCell(pacman.i - 1, pacman.j) != wallCell) ||
                pacman.i === (leftEntry.i + 1) && pacman.j === leftEntry.j) {
                pacman.i--;
                pacman_direction = "left";
            }
            else if (pacman.j === leftEntry.j && pacman.i === leftEntry.i) {
                pacmanChangeEntry("leftToRight");
            }
            break;

        case 4: //right or entry in the right frame
            if ((pacman.i < (borad_columns - 2) && kindOfCell(pacman.i + 1, pacman.j) != wallCell) ||
                pacman.i === (rightEntry.i - 1) && pacman.j === rightEntry.j) {
                pacman.i++;
                pacman_direction = "right";
            }
            else if (pacman.j === rightEntry.j && pacman.i === rightEntry.i) {
                pacmanChangeEntry("rightToLeft");
            }
            break;


        default:
            break;
    }

    updateScore(pacman.i, pacman.j);

    if (board[pacman.i][pacman.j] === bonusCell) {
        ateBonus = true;
    }
    else if (board[pacman.i][pacman.j] === heartCell) {
        ateHeart = true;
        num_of_lives++;
        switch (num_of_lives) {
            case 2:
                $('#life2').css("visibility", "visible");
                break;
            case 3:
                $('#life3').css("visibility", "visible");
                break;
            case 4:
                $('#life4').css("visibility", "visible");
                break;
    
        }
        
        
    }
    else if (board[pacman.i][pacman.j] === clockCell) {
        ateClock = true;
        updateTimeBonus();
    }
    board[pacman.i][pacman.j] = 2;

    player_win = true;
    for (var i = 0; i < borad_columns && player_win; i++) {
        for (var j = 0; j < board_rows && player_win; j++) {
            if (board[i][j] === pointsCell5 || board[i][j] === pointsCell15 || board[i][j] === pointsCell25) {
                player_win = false;
            }
        }
    }
    if (player_win) {
        endGame();
    }
}

//moving randomly
function updateBonusHeartOrClockPosition(character, charCell) {
    if (myCopyBoard[character.i][character.j] === pointsCell5 || myCopyBoard[character.i][character.j] === pointsCell15 ||
        myCopyBoard[character.i][character.j] === pointsCell25) {
        restorePointsToBoard(character.i, character.j);
    }
    else if (board[character.i][character.j - 1] === pacmanCell || board[character.i][character.j + 1] === pacmanCell ||
        board[character.i - 1][character.j] === pacmanCell || board[character.i + 1][character.j] === pacmanCell) {
        return;
    }
    else {
        board[character.i][character.j] = freeCell;
    }

    var randomNumber = Math.random();

    //moving up
    if (randomNumber < 0.25 && board[character.i][character.j - 1] === freeCell &&
        !isEntry(character.i, character.j - 1)) {
        character.j--;
    }
    //moving down
    else if (randomNumber >= 0.25 && randomNumber < 0.5 && board[character.i][character.j + 1] === freeCell &&
        !isEntry(character.i, character.j + 1)) {
        character.j++;
    }
    //moving right
    else if (randomNumber <= 0.5 && randomNumber < 0.75 && board[character.i + 1][character.j] === freeCell &&
        !isEntry(character.i + 1, character.j)) {
        character.i++;
    }
    //moving left
    else if (randomNumber >= 0.75 && board[character.i - 1][character.j] === freeCell &&
        !isEntry(character.i - 1, character.j)) {
        character.i--;
    }

    board[character.i][character.j] = charCell;
    myCopyBoard[character.i][character.j] = charCell;

}

function pacmanChangeEntry(fromWhereToWhere) {
    switch (fromWhereToWhere) {
        case "upToBottom":
            pacman.i = downEntry.i;
            pacman.j = downEntry.j;
            break;
        case "bottomToUp":
            pacman.i = upEntry.i;
            pacman.j = upEntry.j;
            break;
        case "leftToRight":
            pacman.i = rightEntry.i;
            pacman.j = rightEntry.j;
            break;
        case "rightToLeft":
            pacman.i = leftEntry.i;
            pacman.j = leftEntry.j;
            break;
        default:
            break;
    }
}

//isObstacle
function isWall(col_idx, row_idx) {
    //entries in the frame - moving from one side of the board to the oppisite side
    if ((col_idx == 0 && row_idx == 6) || (col_idx == (borad_columns - 1) && row_idx == 4) ||
        (row_idx == 0 && col_idx == 9) || (row_idx == (board_rows - 1) && col_idx == 7)) { return false; }

    //the frame of the game
    if (col_idx == 0 || col_idx == (borad_columns - 1)) { return true; }

    //the frame of the game
    if (row_idx == 0 || row_idx == (board_rows - 1)) { return true; }

    //defining walls in the middle of the board
    if ((col_idx == 2 && [2, 4, 5, 9].indexOf(row_idx) > -1) || (col_idx == 3 && [7, 9].indexOf(row_idx) > -1) ||
        (col_idx == 4 && [2, 3, 4, 5, 7, 9].indexOf(row_idx) > -1) || (col_idx == 5 && [5, 9].indexOf(row_idx) > -1) ||
        (col_idx == 6 && [2, 3, 5, 8, 9].indexOf(row_idx) > -1) || (col_idx == 7 && [9].indexOf(row_idx) > -1) ||
        (col_idx == 8 && [2, 3, 4].indexOf(row_idx) > -1) ||
        (col_idx == 9 && [2, 6, 10].indexOf(row_idx) > -1) || (col_idx == 10 && [4, 5, 6, 8].indexOf(row_idx) > -1) ||
        (col_idx == 11 && [8, 10].indexOf(row_idx) > -1) || (col_idx == 12 && [2, 3, 4, 6].indexOf(row_idx) > -1) ||
        (col_idx == 13 && [6, 7, 9].indexOf(row_idx) > -1) || (col_idx == 14 && [2, 3, 7, 9].indexOf(row_idx) > -1) ||
        (col_idx == 15 && [5, 7, 9].indexOf(row_idx) > -1) || (col_idx == 16 && [2, 3, 4, 5, 7, 9].indexOf(row_idx) > -1)) { return true; }

    return false;
}


function draw() {
    canvas.width = canvas.width; //clean board
    for (var i = 0; i < borad_columns; i++) {
        for (var j = 0; j < board_rows; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;

            if (board[i][j] == wallCell) {
                context.beginPath();
                context.drawImage(wallImage, center.x - 30, center.y - 30, 60, 60);
                continue;
            }
            if (board[i][j] === pacmanCell && !initPacmanRandomly) {
                context.beginPath();
                drawPacmanPlayer(center);
                continue;
            }

            if (board[i][j] === monsterCell) {
                context.beginPath();
                context.drawImage(monsterImage, center.x - 30, center.y - 30, 60, 60);
                continue;

            }
            if (board[i][j] === pointsCell5 || board[i][j] === pointsCell15 || board[i][j] === pointsCell25) {
                drawPoints(board[i][j], center);
            }
            if (board[i][j] === bonusCell) {
                context.beginPath();
                context.drawImage(throphyImage, center.x - 30, center.y - 30, 60, 60);
            }

            if (board[i][j] === heartCell) {
                context.beginPath();
                context.drawImage(heartImage, center.x - 30, center.y - 30, 60, 60);
            }

            if (board[i][j] === clockCell) {
                context.beginPath();
                context.drawImage(clockImage, center.x - 30, center.y - 30, 60, 60);
            }


        }
    }
}

function drawPoints(foodValue, center) {
    var foodColor;
    switch (foodValue) {
        case 5:
            foodColor = points_color_5; //color
            break;
        case 15:
            foodColor = points_color_15; //color
            break;
        case 25:
            foodColor = points_color_25; //color
            break;
    }
    context.beginPath();
    context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
    context.fillStyle = foodColor; //color
    context.fill();

    context.font = 'bold 14pt Calibri';
    context.fillStyle = 'white';
    if (foodColor === 'white' || foodColor === '#fff' || foodColor === '#ffffff' || foodColor === 'rgb(255,255,255)')
        context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(foodValue, center.x, center.y + 8);


}

function drawPacmanPlayer(center) {

    if (pacman_direction === "right")
        context.drawImage(pacmanPlayerRight, center.x - 30, center.y - 30, 60, 60);
    if (pacman_direction === "up")
        context.drawImage(pacmanPlayerUp, center.x - 30, center.y - 30, 60, 60);
    if (pacman_direction === "down")
        context.drawImage(pacmanPlayerDown, center.x - 30, center.y - 30, 60, 60);
    if (pacman_direction === "left")
        context.drawImage(pacmanPlayerLeft, center.x - 30, center.y - 30, 60, 60);

}

function drawPacmanPlayerRandomly() {
    var chosenCell = getRandomFreeCell();
    var cellCenter = new Object();
    cellCenter.x = chosenCell[0] * 60 + 30;
    cellCenter.y = chosenCell[1] * 60 + 30;
    board[chosenCell[0]][chosenCell[1]] = 2; //pacmanPlayer's cell
    pacman.i = chosenCell[0];
    pacman.j = chosenCell[1];
    context.beginPath();
    context.drawImage(pacmanPlayerRight, cellCenter.x - 30, cellCenter.y - 30, 60, 60);
    initPacmanRandomly = false;
}

function initMonstersStartPositions() {
    monster_array = new Array();
    var monster_A = new Object();
    var monster_B = new Object();
    var monster_C = new Object();

    board[1][1] = monsterCell;
    monster_A.i = 1;
    monster_A.j = 1;
    monster_array[0] = monster_A;

    if (numOfMonstersByUser > 1) {
        board[borad_columns - 2][board_rows - 2] = monsterCell;
        monster_B.i = borad_columns - 2;
        monster_B.j = board_rows - 2;
        monster_array[1] = monster_B;

    }

    if (numOfMonstersByUser > 2) {
        board[borad_columns - 2][1] = monsterCell;
        monster_C.i = borad_columns - 2;
        monster_C.j = 1;
        monster_array[2] = monster_C;
    }

}

function getRandomFreeCell() {
    let randomColumnIdx = Math.floor(Math.random() * borad_columns);
    let randomRowIdx = Math.floor(Math.random() * board_rows);
    while (board[randomColumnIdx][randomRowIdx] != freeCell) {
        randomColumnIdx = Math.floor(Math.random() * borad_columns);
        randomRowIdx = Math.floor(Math.random() * board_rows);
    }
    return [randomColumnIdx, randomRowIdx];
}

function kindOfCell(i, j) {
    return board[i][j];
}

function copyBoardToBoard() {
    for (let i = 0; i < borad_columns; i++) {
        for (let j = 0; j < board_rows; j++) {
            myCopyBoard[i][j] = board[i][j];
        }
    }
}

function restorePointsToBoard(i, j) {
    var points = myCopyBoard[i][j];

    switch (points) {
        case pointsCell5:
            board[i][j] = pointsCell5;
            break;

        case pointsCell15:
            board[i][j] = pointsCell15;
            break;

        case pointsCell25:
            board[i][j] = pointsCell25;
            break;
    }
}

function PacmanMonsterOrWallCell(i, j) {
    if (board[i][j] === wallCell || board[i][j] === monsterCell || board[i][j] === pacmanCell) {
        return true;
    }
    return false;
}

function isEntry(i, j) {
    if ((j === 0 && i === 9) || (j === 6 && i === 0) || (j === 4 && i === 18) || (j === 11 && i === 7)) {
        return true;
    }
    return false;
}

function updateScore(i, j) {
    if (board[i][j] === pointsCell5) {
        score = score + 5;
        myCopyBoard[i][j] = 2;
    }

    else if (board[i][j] === pointsCell15) {
        score = score + 15;
        myCopyBoard[i][j] = 2;
    }

    else if (board[i][j] === pointsCell25) {
        score = score + 25;
        myCopyBoard[i][j] = 2;
    }

    else if (board[i][j] === bonusCell) {
        score = score + 50;
    }

    document.getElementById("labelScore").value = score;
}

function updateTimeBonus() {
    var currentTime = document.getElementById("labelTime").value;
    var res = parseInt(currentTime.substring(0, currentTime.indexOf(' ')));
    gameTimeByUser = res + 15;
    document.getElementById("labelTime").value = gameTimeByUser + " seconds";
}


function endSession() {
    session_is_over = false;

    switch (num_of_lives) {
        case 1:
            $('#life1').css("visibility", "hidden");
            break;
        case 2:
            $('#life2').css("visibility", "hidden");
            break;
        case 3:
            $('#life3').css("visibility", "hidden");
            break;
        case 4:
            $('#life4').css("visibility", "hidden");
            break;

    }
    num_of_lives--;

    clearInterval(game_interval);
    game_interval = undefined;
    if (num_of_lives === 0) {
        switch (keyboard) {
            case 1:
                removeEventListener("keydown", arrowsHandlerAF);
                for (let i = 37; i < 41; i++) {
                    keyPressed[i] = false;
                }

            case 2:
                removeEventListener("keydown", lettersHandlerAF);
                keyPressed[65] = false;  //a
                keyPressed[83] = false; //s
                keyPressed[68] = false; //d
                keyPressed[87] = false; //w

            case 3:
                removeEventListener("keydown", numbersHandlerAF);
                keyPressed[49] = false;  //1
                keyPressed[50] = false; //2
                keyPressed[51] = false; //3
                keyPressed[53] = false; //5    

        }
        endGame();

    }
    else {
        initGame();
    }

}

function endGame() {

    clearInterval(game_interval);
    game_interval = undefined;

    if (music !== undefined) {
        music.pause();
    }

    if (!player_win) {
        showMessage("You Lost!");
    }
    else if (time_on_clock < 0 && score < 150) {
        showMessage("You can do better")
        num_of_lives = 0;
    }
    else {
        showMessage("We have a Winner!!!");
        num_of_lives = 0;
    }

}


function showMessage(message) {
    document.getElementById("headline_endGame").innerHTML = message;
    var modalGameOver = document.getElementById('gameOverModal');
    modalGameOver.style.display = "block";
}
