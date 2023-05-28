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
      // increment the turn counter
      turns++;

      // if any of the win conditions are satisfied, end the game
      if (win(turns, getCurrentPlayer().playerID)) {
        console.log(`${getCurrentPlayer().playerName} wins!!`);
        gameWon();
        return;

        // if there's no winner yet, switch players
      } else {
        switchPlayer();
      }

      // if the move is illegal provide an error msg
    } else {
      console.log("Invalid move");
    }

    console.log(gameboard.getBoard());
    console.log(`Next player: ${getCurrentPlayer().playerName}`);
  };

  return { playRound };
})();
