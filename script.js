function GameGrid() {
  const board = [];
  const rows = 3;
  const columns = 3;

  // creates the 2d array matching to the gameboard's grid
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  // gets the game grid
  const getGrid = () => {
    return board;
  };

  // allows a player to place a marker on a grid cell
  const markCell = (player, row, column) => {
    const currentGrid = board;
    if (currentGrid[row][column] === 0) {
      currentGrid[row][column] = player;
    }
  };

  return { getGrid, markCell };
}
