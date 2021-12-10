import fs from "fs";

const getInput = (useTestInput: boolean = false): number[][] => {
  return fs
    .readFileSync(`./${useTestInput ? "test" : "input"}.txt`, "utf8")
    .split("\n")
    .map((line) => line.split(""))
    .map((line) => line.map((n) => Number.parseInt(n)));
};

const run = (heightMap: number[][]): number => {
  const deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let sumOfRiskLevels = 0;

  heightMap.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      let isLowPoint = true;
      deltas.forEach((delta) => {
        if (
          rowIndex + delta[0] >= 0 &&
          rowIndex + delta[0] < heightMap.length &&
          colIndex + delta[1] >= 0 &&
          colIndex + delta[1] < row.length
        ) {
          if (heightMap[rowIndex + delta[0]][colIndex + delta[1]] <= col) {
            isLowPoint = false;
          }
        }
      });
      if (isLowPoint) {
        sumOfRiskLevels += col + 1;
      }
    });
  });

  return sumOfRiskLevels;
};

const findTop3Basins = (heightMap: number[][]): number => {
  const deltas = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ];
  const basins: number[] = [];
  const markedHeightMap = heightMap.map((row) => row.map((col) => col));
  heightMap.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (
        markedHeightMap[rowIndex][colIndex] !== 9 &&
        markedHeightMap[rowIndex][colIndex] !== -1
      ) {
        let size = 1;
        markedHeightMap[rowIndex][colIndex] = -1;
        let pointsToInvestigate = [[rowIndex, colIndex]];
        do {
          let newPointsToInvestigate: any[] = [];
          pointsToInvestigate.forEach((point) => {
            deltas.forEach((delta) => {
              const r = point[0] + delta[0];
              const c = point[1] + delta[1];

              if (r >= 0 && r < heightMap.length && c >= 0 && c < row.length) {
                if (markedHeightMap[r][c] < 9 && markedHeightMap[r][c] !== -1) {
                  newPointsToInvestigate.push([r, c]);
                  markedHeightMap[r][c] = -1;
                  size += 1;
                }
              }
            });
          });
          pointsToInvestigate = newPointsToInvestigate.map((point) =>
            point.map((c) => c)
          );
        } while (pointsToInvestigate.length > 0);
        basins.push(size);
      }
    });
  });
  return basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((product, basin) => product * basin, 1);
};

(() => {
  const testInput = getInput(true);
  const testPart1Expected = 15;
  const testPart2Expected = 1134;
  const input = getInput();

  const testPart1 = run(testInput);
  console.log(
    "Test Part 1:",
    testPart1,
    testPart1 === testPart1Expected ? "✅" : `❌, expected ${testPart1Expected}`
  );
  const testPart2 = findTop3Basins(testInput);
  console.log(
    "Test Part 2:",
    testPart2,
    testPart2 === testPart2Expected ? "✅" : `❌, expected ${testPart2Expected}`
  );

  const part1 = run(input);
  console.log("Part 1:", part1);
  const part2 = findTop3Basins(input);
  console.log("Part 2:", part2);
})();
