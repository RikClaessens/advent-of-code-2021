import fs from "fs";

const getInput = () => {
  const input = fs.readFileSync("./input.txt", "utf8").split("\n");
  const bingoNumbers = input[0].split(",");
  let boards: string[][][] = [];
  for (var i = 6; i < input.length; i += 6) {
    boards.push([
      input[i - 4].split(" ").filter((x) => x),
      input[i - 3].split(" ").filter((x) => x),
      input[i - 2].split(" ").filter((x) => x),
      input[i - 1].split(" ").filter((x) => x),
      input[i].split(" ").filter((x) => x),
    ]);
  }
  return { bingoNumbers, boards };
};

const getSumOfUnmarkedNumbers = (board: string[][]) =>
  board.reduce(
    (sum, row) =>
      sum +
      row.reduce(
        (rowSum, number) =>
          rowSum + (number === "X" ? 0 : Number.parseInt(number)),
        0
      ),
    0
  );

const playBingo = (bingoNumbers: string[], boards: string[][][]) => {
  const currentBoards = boards.map(b => b.map(r => r.map(c => c)));
  let winner = false;
  bingoNumbers.some((bingoNumber) => {
    // mark bingoNumber

    currentBoards.forEach((board, boardIndex) => {
      const crosses: number[][] = [
        new Array(board.length).fill(0),
        new Array(board[0].length).fill(0),
      ];
      board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          if (board[rowIndex][colIndex] === bingoNumber) {
            board[rowIndex][colIndex] = "X";
          }

          if (board[rowIndex][colIndex] === "X") {
            crosses[0][rowIndex] += 1;
            crosses[1][colIndex] += 1;
            if (
              crosses[0][rowIndex] === board.length ||
              crosses[1][colIndex] === board[0].length
            ) {
              const sumOfUnmarkedNumbers = getSumOfUnmarkedNumbers(board);
              console.log(
                "Part 1: ",
                sumOfUnmarkedNumbers * Number.parseInt(bingoNumber)
              );
              winner = true;
            }
          }
        });
      });
    });
    return winner;
  });
};

const lastBingoWinner = (bingoNumbers: string[], boards: string[][][]) => {
  const currentBoards = boards.map(b => b.map(r => r.map(c => c)));
  let winner = false;
  const wonBoards = new Array(boards.length).fill(false);
  bingoNumbers.some((bingoNumber) => {
    // mark bingoNumber

    currentBoards.forEach((board, boardIndex) => {
      if (wonBoards[boardIndex]) return;
      const crosses: number[][] = [
        new Array(board.length).fill(0),
        new Array(board[0].length).fill(0),
      ];
      board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
          if (board[rowIndex][colIndex] === bingoNumber) {
            board[rowIndex][colIndex] = "X";
          }

          if (board[rowIndex][colIndex] === "X") {
            crosses[0][rowIndex] += 1;
            crosses[1][colIndex] += 1;
            if (
              crosses[0][rowIndex] === board.length ||
              crosses[1][colIndex] === board[0].length
            ) {
              const numberOfWonBoards = wonBoards.filter((wb) => wb).length;
              if (numberOfWonBoards === boards.length - 1) {
                const lastBoardToWinIndex = wonBoards.findIndex(
                  (wb) => wb === false
                );
                const sumOfUnmarkedNumbers = getSumOfUnmarkedNumbers(currentBoards[lastBoardToWinIndex]);
                console.log(
                  "Part 2: ",
                  sumOfUnmarkedNumbers * Number.parseInt(bingoNumber)
                );
                winner = true;
              }
              wonBoards[boardIndex] = true;
            }
          }
        });
      });
    });
    return winner;
  });
};

(() => {
  const { bingoNumbers, boards } = getInput();
  playBingo(bingoNumbers, boards);
  lastBingoWinner(bingoNumbers, boards);
})();
