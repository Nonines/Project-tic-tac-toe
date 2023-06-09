const Gameboard = () => {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  const getBoard = () => {
    return board;
  };

  const markCell = (playerID, row, column) => {
    const currentGrid = board;
    if (currentGrid[row][column] === 0) {
      currentGrid[row][column] = playerID;
      return true;
    }
    return false;
  };

  return { getBoard, markCell };
};

const Player = (name, id) => {
  const playerName = name;
  const playerID = id;

  return { playerName, playerID };
};

const GameController = (() => {
  const gameboard = Gameboard();
  const playerOne = Player("X", 1);
  let playerTwo = Player("O", 2);

  let turns = 0;
  let gameDrawn = false;
  let gameWon = false;
  let currentPlayer = playerOne;
  let vsCom = false;

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const selectCom = () => {
    playerTwo = Player("COM", 2);
    vsCom = true;
  };

  const selectPlayer = () => {
    playerTwo = Player("O", 2);
    vsCom = false;
  };

  const comSelection = () => {
    const gridValues = [];
    const validIndexes = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        gridValues.push(gameboard.getBoard()[i][j]);
      }
    }

    for (let i = 0; i < gridValues.length; i++) {
      if (gridValues[i] === 0) {
        validIndexes.push(i);
      }
    }

    const randomValidIndex =
      validIndexes[Math.floor(Math.random() * validIndexes.length)];

    return randomValidIndex;
  };

  const switchPlayer = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
    }

    if (currentPlayer === playerTwo && vsCom) {
      DisplayController.playerInput(comSelection());
    }
  };

  const win = (turns, id) => {
    const board = gameboard.getBoard();

    if (turns > 4) {
      if (board[0][0] === id && board[0][1] === id && board[0][2] === id) {
        return true;
      } else if (
        board[0][0] === id &&
        board[1][0] === id &&
        board[2][0] === id
      ) {
        return true;
      } else if (
        board[0][0] === id &&
        board[1][1] === id &&
        board[2][2] === id
      ) {
        return true;
      } else if (
        board[0][2] === id &&
        board[1][1] === id &&
        board[2][0] === id
      ) {
        return true;
      } else if (
        board[0][2] === id &&
        board[1][2] === id &&
        board[2][2] === id
      ) {
        return true;
      } else if (
        board[0][1] === id &&
        board[1][1] === id &&
        board[2][1] === id
      ) {
        return true;
      } else if (
        board[1][0] === id &&
        board[1][1] === id &&
        board[1][2] === id
      ) {
        return true;
      } else if (
        board[2][0] === id &&
        board[2][1] === id &&
        board[2][2] === id
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const gameEnded = (result) => {
    if (result === "draw") {
      gameDrawn = true;
    } else if (result === "win") {
      gameWon = true;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          gameboard.getBoard()[i][j] = 3;
        }
      }
    }
  };

  const gameState = () => {
    return { won: gameWon, drawn: gameDrawn };
  };

  const resetGame = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        gameboard.getBoard()[i][j] = 0;
      }
    }
    turns = 0;
    gameDrawn = false;
    gameWon = false;
    currentPlayer = playerOne;
  };

  const playRound = (row, column) => {
    if (gameboard.markCell(getCurrentPlayer().playerID, row, column)) {
      turns++;

      if (win(turns, getCurrentPlayer().playerID)) {
        gameEnded("win");
        return true;
      } else if (turns === 9) {
        gameEnded("draw");
        return true;
      } else {
        switchPlayer();
      }

      return true;
    } else {
      return false;
    }
  };

  return {
    playRound,
    getCurrentPlayer,
    gameState,
    resetGame,
    selectCom,
    selectPlayer,
  };
})();

const DisplayController = (() => {
  const vsPlayerSelection = document.querySelector(".vs-player");
  const vsComSelection = document.querySelector(".vs-com");
  const startGameSelection = document.querySelector(".start-game");
  const boardDialog = document.querySelector("#board-modal");
  const dialogCloseButton = document.querySelector("#close-modal");
  const dialogRestartButton = document.querySelector("#restart-game");
  const boardContainer = document.querySelector("#board-container");
  const turnInfoContainer = document.querySelector("#turn-info");

  const resetDisplay = () => {
    GameController.resetGame();
    turnInfoContainer.textContent = `${
      GameController.getCurrentPlayer().playerName
    }'s turn!`;
    for (let index = 0; index < boardContainer.children.length; index++) {
      const area = document.querySelector(
        `#board-container [data-area-index=${CSS.escape(index)}]`
      );
      area.textContent = "";
    }
  };

  vsPlayerSelection.addEventListener("click", () => {
    vsPlayerSelection.classList.add("selected");
    vsComSelection.classList.remove("selected");
  });

  vsComSelection.addEventListener("click", () => {
    vsComSelection.classList.add("selected");
    vsPlayerSelection.classList.remove("selected");
  });

  startGameSelection.addEventListener("click", () => {
    if (vsPlayerSelection.classList.contains("selected")) {
      boardDialog.showModal();
      resetDisplay();
      GameController.selectPlayer();
    } else if (vsComSelection.classList.contains("selected")) {
      boardDialog.showModal();
      resetDisplay();
      GameController.selectCom();
    }
  });

  dialogCloseButton.addEventListener("click", () => {
    boardDialog.close();
    resetDisplay();
  });

  dialogRestartButton.addEventListener("click", () => {
    resetDisplay();
  });

  const updateDisplay = (gridAreaIndex, playerId) => {
    const area = document.querySelector(
      `#board-container [data-area-index=${CSS.escape(gridAreaIndex)}]`
    );

    if (playerId === 1) {
      area.textContent = "X";
    } else if (playerId === 2) {
      area.textContent = "O";
    }

    const { won, drawn } = GameController.gameState();
    if (won) {
      turnInfoContainer.textContent = `${
        GameController.getCurrentPlayer().playerName
      } wins!`;
    } else if (drawn) {
      turnInfoContainer.textContent = "Draw!";
    } else {
      turnInfoContainer.textContent = `${
        GameController.getCurrentPlayer().playerName
      }'s turn!`;
    }
  };

  const playerInput = (index) => {
    const activePlayer = GameController.getCurrentPlayer();

    switch (index) {
      case 0:
        if (GameController.playRound(0, 0)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 1:
        if (GameController.playRound(0, 1)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 2:
        if (GameController.playRound(0, 2)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 3:
        if (GameController.playRound(1, 0)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 4:
        if (GameController.playRound(1, 1)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 5:
        if (GameController.playRound(1, 2)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 6:
        if (GameController.playRound(2, 0)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 7:
        if (GameController.playRound(2, 1)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
      case 8:
        if (GameController.playRound(2, 2)) {
          updateDisplay(index, activePlayer.playerID);
        }
        break;
    }
  };

  for (let index = 0; index < boardContainer.children.length; index++) {
    let gridArea = boardContainer.children.item(index);
    gridArea.dataset.areaIndex = index;

    gridArea.addEventListener("click", () => {
      playerInput(index);
    });
  }

  return { playerInput };
})();
