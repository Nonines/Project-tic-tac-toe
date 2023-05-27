function Gameboard() {
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
}

function Player(name, id) {
  const playerName = name;
  const playerID = id;

  return { playerName, playerID };
}

function GameController() {
  const gameboard = Gameboard();
  const playerOne = Player("Player 1", 1);
  const playerTwo = Player("Player 2", 2);

  let currentPlayer = playerOne;

  const getCurrentPlayer = () => {
    return currentPlayer;
  };
  // console.log(`Next player: ${getCurrentPlayer().playerName}`);

  const switchPlayer = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
    }
  };

  const playRound = (row, column) => {
    if (gameboard.markCell(getCurrentPlayer().playerID, row, column)) {
      switchPlayer();
    }
    console.log(gameboard.getBoard());
    // console.log(`Next player: ${getCurrentPlayer().playerName}`);
  };

  return { playRound };
}
