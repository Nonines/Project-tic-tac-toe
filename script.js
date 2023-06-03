const Gameboard = () => {
  const board = [];
  const rows = 3;
  const columns = 3;

  // creates the 2d array matching to the gameboard's grids
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  const getBoard = () => {
    return board;
  };

  // allows a player to place a marker in a board cell
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
  const playerOne = Player("Player 1", 1);
  const playerTwo = Player("Player 2", 2);

  let turns = 0;
  let gameDrawn = false;
  let gameWon = false;
  let currentPlayer = playerOne;

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const switchPlayer = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
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
      // fill the board array with a random value that is not a playerID
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
    console.log(`Current player: ${getCurrentPlayer().playerName}`);

    // If a legal move is played, insert the player id in the board
    if (gameboard.markCell(getCurrentPlayer().playerID, row, column)) {
      turns++;

      // and if any of the win conditions are satisfied, end the game
      if (win(turns, getCurrentPlayer().playerID)) {
        console.log(`${getCurrentPlayer().playerName} wins!!`);
        gameEnded("win");
        return true;

        // or if 9 turns have already been played, draw the game
      } else if (turns === 9) {
        console.log("Draw!");
        gameEnded("draw");
        return true;

        // or if there's no winner yet, switch players
      } else {
        switchPlayer();
      }

      console.log(gameboard.getBoard());
      console.log(`Next player: ${getCurrentPlayer().playerName}`);
      return true;

      // if the move is illegal provide an error msg and return false
    } else {
      console.log("Invalid move");
      return false;
    }
  };

  return { playRound, getCurrentPlayer, gameState, resetGame };
})();

const displayController = (() => {
  const vsPlayerSelection = document.querySelector(".vs-player");
  const vsComSelection = document.querySelector(".vs-com");
  const startGameSelection = document.querySelector(".start-game");
  const boardDialog = document.querySelector("#board-modal");
  const dialogCloseButton = document.querySelector("#close-modal");
  const boardContainer = document.querySelector("#board-container");
  const turnInfoContainer = document.querySelector("#turn-info");

  turnInfoContainer.textContent = `${
    GameController.getCurrentPlayer().playerName
  }'s turn`;

  vsPlayerSelection.addEventListener("click", () => {
    vsPlayerSelection.classList.add("selected");
    vsComSelection.classList.remove("selected");
  });

  vsComSelection.addEventListener("click", () => {
    vsComSelection.classList.add("selected");
    vsPlayerSelection.classList.remove("selected");
  });

  startGameSelection.addEventListener("click", () => {
    if (
      vsPlayerSelection.classList.contains("selected") ||
      vsComSelection.classList.contains("selected")
    ) {
      boardDialog.showModal();
    }
  });

  dialogCloseButton.addEventListener("click", () => {
    boardDialog.close();
    GameController.resetGame();
    turnInfoContainer.textContent = `${
      GameController.getCurrentPlayer().playerName
    }'s turn`;
    for (let index = 0; index < boardContainer.children.length; index++) {
      const area = document.querySelector(
        `#board-container [data-area-index=${CSS.escape(index)}]`
      );
      area.textContent = "";
    }
  });

  const updateDisplay = (gridAreaIndex, playerId) => {
    // update board display
    const area = document.querySelector(
      `#board-container [data-area-index=${CSS.escape(gridAreaIndex)}]`
    );

    if (playerId === 1) {
      area.textContent = "X";
    } else if (playerId === 2) {
      area.textContent = "O";
    }

    // update info display
    const { won, drawn } = GameController.gameState();
    if (won) {
      turnInfoContainer.textContent = `${
        GameController.getCurrentPlayer().playerName
      } has won`;
    } else if (drawn) {
      turnInfoContainer.textContent = "The game has ended in a draw";
    } else {
      turnInfoContainer.textContent = `${
        GameController.getCurrentPlayer().playerName
      }'s turn`;
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

  // Handles click events for the grid areas
  for (let index = 0; index < boardContainer.children.length; index++) {
    let gridArea = boardContainer.children.item(index);
    gridArea.dataset.areaIndex = index;

    gridArea.addEventListener("click", () => {
      playerInput(index);
    });
  }
})();
