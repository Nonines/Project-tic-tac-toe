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

  // gets the game board
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

    /*
    The various winning conditions for tictactoe. This works by first checking if at least five turns have been played, the minimum required to produce a winner. If that is true, it then checks for the inputted value in each of the 5 different sections of the 3X3 grid from where a win is possible, and then confirming if the remaining two corresponding sections have the exact same value, ending the function at any point where this is true.
    */
    if (turns > 4) {
      if (board[0][0] === id) {
        if (board[0][1] === id && board[0][2] == id) {
          return true;
        } else if (board[1][0] === id && board[2][0] == id) {
          return true;
        } else if (board[1][1] === id && board[2][2] == id) {
          return true;
        }
      } else if (board[0][2] === id) {
        if (board[1][1] === id && board[2][0] == id) {
          return true;
        } else if (board[1][2] === id && board[2][2] == id) {
          return true;
        }
      } else if (board[0][1] === id) {
        if (board[1][1] === id && board[2][1] == id) {
          return true;
        }
      } else if (board[1][0] === id) {
        if (board[1][1] === id && board[1][2] == id) {
          return true;
        }
      } else if (board[2][0] === id) {
        if (board[2][1] === id && board[2][2] == id) {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  const gameWon = () => {
    // stuff to do after getting a winner
  };

  const playRound = (row, column) => {
    console.log(`Current player: ${getCurrentPlayer().playerName}`);

    // If a legal move is played, insert the player id in the board
    if (gameboard.markCell(getCurrentPlayer().playerID, row, column)) {
      turns++;

      // if any of the win conditions are satisfied, end the game
      if (win(turns, getCurrentPlayer().playerID)) {
        console.log(`${getCurrentPlayer().playerName} wins!!`);
        gameWon();
        return true;

        // if there's no winner yet, switch players
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

  return { playRound, getCurrentPlayer };
})();

const displayController = (() => {
  const boardContainer = document.querySelector("#board-container");

  const updateInput = (gridAreaIndex, playerId) => {
    const area = document.querySelector(
      `#board-container [data-area-index=${CSS.escape(gridAreaIndex)}]`
    );

    if (playerId === 1) {
      area.textContent = "X";
    } else if (playerId === 2) {
      area.textContent = "O";
    }
  };

  const playerInput = (index) => {
    const activePlayer = GameController.getCurrentPlayer();

    switch (index) {
      case 0:
        if (GameController.playRound(0, 0)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 1:
        if (GameController.playRound(0, 1)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 2:
        if (GameController.playRound(0, 2)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 3:
        if (GameController.playRound(1, 0)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 4:
        if (GameController.playRound(1, 1)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 5:
        if (GameController.playRound(1, 2)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 6:
        if (GameController.playRound(2, 0)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 7:
        if (GameController.playRound(2, 1)) {
          updateInput(index, activePlayer.playerID);
        }
        break;
      case 8:
        if (GameController.playRound(2, 2)) {
          updateInput(index, activePlayer.playerID);
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
