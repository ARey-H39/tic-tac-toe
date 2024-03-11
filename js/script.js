const GameInit = (function () {
    const players = [];

    const el_container = document.querySelector('.game-start');
    const startBtn = el_container.querySelector('.game-start__btn');
    startBtn.addEventListener('click', initialize);

    function createPlayers() {
        console.log(players.length);
        if (players.length > 0) clearPlayers();

        let player1Name = el_container.querySelector('input#first-player__name').value || "Player 1";
        let player2Name = el_container.querySelector('input#second-player__name').value || "Player 2";
        
        players.push(Player(player1Name, "X"));
        players.push(Player(player2Name, "O"));
    }

    function clearPlayers() {
        for (let i = 0; i <= players.length; i++) {
            players.pop();
        }
    }

    function hideInit() {
        el_container.style.display = "none";
    }

    function displayInit() {
        el_container.style.display = "block";
    }

    function getPlayers() {
        return players;
    }

    function initialize() {
        createPlayers();
        hideInit();
        GameFlow.startGame();
    }

    return {
        displayInit,
        getPlayers
    }
})();

const GameBoard = (function () {
    const _gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    let el_gameBoard = document.querySelector('.game-board');
    bindEvents();

    function renderGameBoard() {
        if (el_gameBoard.style.display !== "grid") el_gameBoard.style.display = "grid";
        el_gameBoard.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            let gameBoardCell = document.createElement('div');
            gameBoardCell.classList.add('game-board__cell');
            gameBoardCell.dataset.cellIndex = i;
            gameBoardCell.innerText = _gameBoard[i];
            el_gameBoard.appendChild(gameBoardCell);
        }
    }

    function bindEvents() {
        el_gameBoard.addEventListener('click', checkCell);
    }

    function removeEvents() {
        el_gameBoard.removeEventListener('click', checkCell);
    }

    function resetGameBoard() {
        removeEvents();
        bindEvents();
        for (let i = 0; i < _gameBoard.length; i++) {
            _gameBoard[i] = ' ';
        }
    }

    function addMarker(cellIndex) {
        _gameBoard[cellIndex] = GameFlow.getCurrentPlayer().marker;
        renderGameBoard();
        GameStatus.checkStatus();
        GameFlow.changeTurn();
    }

    function checkCell(e) {
        if (!e.target.matches('div.game-board__cell')) return;

        const cellIndex = e.target.dataset.cellIndex;
        if (_gameBoard[cellIndex] !== ' ') return;
        addMarker(cellIndex);
    }

    function getGameBoard() {
        return _gameBoard;
    }

    function hideGameBoard() {
        el_gameBoard.style.display = "none";
    }

    function displayGameBoard() {
        el_gameBoard.style.display = "grid";
    }

    return {
        getGameBoard,
        renderGameBoard,
        removeEvents,
        displayGameBoard,
        hideGameBoard,
        resetGameBoard
    }
})();

const Player = function (name, marker) {
    return {
        name,
        marker
    }
};

const GameFlow = (function() {
    const PlayersList = [];
    let currentPlayer;
    let currentTurn;

    function startGame() {
        if (PlayersList.length > 0) {
            for (let i = 0; i <= PlayersList.length; i++) {
                PlayersList.pop();
            }
        }

        for (let player of GameInit.getPlayers()) {
            PlayersList.push(player);
        }
        currentPlayer = PlayersList[0];
        currentTurn = 1;
        GameBoard.renderGameBoard();
        GameStatus.init();
        GameControls.displayBtns();
    }

    function stopGame() {
        GameBoard.removeEvents();
    }

    function changeTurn() {
        currentTurn++;
        currentPlayer = currentTurn % 2 === 0 ? PlayersList[1] : PlayersList[0];
        GameStatus.checkStatus();
    }

    function restartGame() {
        GameBoard.resetGameBoard();
        GameStatus.resetStatus();
        startGame();
    }

    function goBack() {
        restartGame();
        GameBoard.hideGameBoard();
        GameControls.hideBtns();
        GameStatus.hideStatus();
        GameInit.displayInit();
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function getCurrentTurn() {
        return currentTurn;
    }

    return {
        getCurrentPlayer,
        getCurrentTurn,
        changeTurn,
        startGame,
        stopGame,
        restartGame,
        goBack
    }
})();

const GameStatus = (() => {
    let gameWinner;
    let winStatus = false;

    let el_container = document.querySelector('.game-status');

    function init() {
        if (el_container.classList.contains('game-status--end')) el_container.classList.remove('game-status--end');
        el_container.style.display = "block";
        displayTurn();
    }

    function hideStatus() {
        el_container.style.display = "none";
    }

    function checkStatus() {
        checkWinner();

        if (winStatus == false && GameFlow.getCurrentTurn() < 10) {
            displayTurn();
            return;
        }
        displayResult();
    }

    function resetStatus() {
        gameWinner = null;
        winStatus = false;
    }

    function displayTurn() {
        el_container.innerText = `Turn ${GameFlow.getCurrentTurn()}: (${GameFlow.getCurrentPlayer().marker}) ${GameFlow.getCurrentPlayer().name}'s Turn`;
    }

    function displayResult() {

        if(winStatus) {
            GameFlow.stopGame();
            el_container.innerText = gameWinner.name + " (" + gameWinner.marker + ") is the winner!"
            el_container.classList.add('game-status--end');
        }

        else if (!winStatus) {
            GameFlow.stopGame();
            el_container.innerText = "Draw! No one won, but also no one lost..."
            el_container.classList.add('game-status--end');
        }
    }

    function checkWinner() {
        const gameBoard = GameBoard.getGameBoard();
        const currentMarker = GameFlow.getCurrentPlayer().marker;

        if (gameBoard[0] === currentMarker && gameBoard[1] === currentMarker && gameBoard[2] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
        else if (gameBoard[3] === currentMarker && gameBoard[4] === currentMarker && gameBoard[5] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
        else if (gameBoard[6] === currentMarker && gameBoard[7] === currentMarker && gameBoard[8] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }

        else if (gameBoard[0] === currentMarker && gameBoard[3] === currentMarker && gameBoard[6] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
        else if (gameBoard[1] === currentMarker && gameBoard[4] === currentMarker && gameBoard[7] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
        else if (gameBoard[2] === currentMarker && gameBoard[5] === currentMarker && gameBoard[8] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }

        else if (gameBoard[0] === currentMarker && gameBoard[4] === currentMarker && gameBoard[8] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
        else if (gameBoard[2] === currentMarker && gameBoard[4] === currentMarker && gameBoard[6] === currentMarker) { winStatus = true; gameWinner = GameFlow.getCurrentPlayer() }
    }

    return {
        checkStatus,
        init,
        resetStatus,
        hideStatus
    }

})();

const GameControls = (() => {
    const el_container = document.querySelector('.game-controls');
    const restartBtn = el_container.querySelector('.game-controls__btn--restart');
    const menuBtn = el_container.querySelector('.game-controls__btn--start-menu');

    restartBtn.addEventListener('click', GameFlow.restartGame);
    menuBtn.addEventListener('click', GameFlow.goBack);


    function displayBtns() {
        el_container.style.display = "flex";
    }

    function hideBtns() {
        el_container.style.display = "none";
    }

    return {
        displayBtns,
        hideBtns
    }
})();
