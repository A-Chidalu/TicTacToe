
const isGameOver = (board: string[][]): boolean => {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
        return true; // Game is over (a player has won)
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
        return true; // Game is over (a player has won)
      }
    }
  
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
      return true; // Game is over (a player has won)
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
      return true; // Game is over (a player has won)
    }
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          return false; // Game is not over, there are empty cells
        }
      }
    }
  
    return true; // It's a draw
};
  
const getGameWinner = (board: string[][]): string => {
    if (!isGameOver(board)) {
        throw new Error(`Game is not over. Cannot determine the winner. Board: ${JSON.stringify(board)}`);
    }

    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
        return board[i][0]; // Return the winner ('X' or 'O')
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
        return board[0][i]; // Return the winner ('X' or 'O')
      }
    }
  
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
      return board[0][0]; // Return the winner ('X' or 'O')
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
      return board[0][2]; // Return the winner ('X' or 'O')
    }
  
    return 'Draw'; // It's a draw
};


export const GameCheckUtil = {
    isGameOver, 
    getGameWinner
}
  