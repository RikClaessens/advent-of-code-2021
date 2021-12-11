import fs from "fs";

const getInput = (useTestInput: boolean = false): number[][] => {
  return fs
    .readFileSync(`./${useTestInput ? "test" : "input"}.txt`, "utf8")
    .split("\n")
    .map((line) => line.split("").map((x) => Number.parseInt(x)));
};

const display2dNumberGrid = (grid: number[][]) =>
  console.log(grid.map((line) => line.join(" ")).join("\n") + "\n");

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

const run = (input: number[][], numberOfSteps: number = 100): number => {
  let octopuses = input.map((line) => line.map((x) => x));

  let numberOfFlashes = 0;

  for (var step = 0; step < numberOfSteps; step += 1) {
    // increase energy
    octopuses = octopuses.map((line) => line.map((octopus) => octopus + 1));
    // all 9's flash
    let hasFlashed = false;
    do {
      hasFlashed = false;
      for (var i = 0; i < octopuses.length; i += 1) {
        for (var j = 0; j < octopuses.length; j += 1) {
          if (octopuses[i][j] > 9) {
            octopuses[i][j] = 0;
            numberOfFlashes += 1;
            hasFlashed = true;

            deltas.forEach((delta) => {
              if (
                i + delta[0] >= 0 &&
                i + delta[0] < octopuses.length &&
                j + delta[1] >= 0 &&
                j + delta[1] < octopuses[i].length &&
                octopuses[i + delta[0]][j + delta[1]] !== 0
              ) {
                octopuses[i + delta[0]][j + delta[1]] += 1;
              }
            });
          }
        }
      }
    } while (hasFlashed);
  }

  return numberOfFlashes;
};

const run2 = (input: number[][]): number => {
  let octopuses = input.map((line) => line.map((x) => x));

  let numberOfSteps = 0;
  let allOctopusFlashed = false;
  while (!allOctopusFlashed) {
    numberOfSteps += 1;
    // increase energy
    octopuses = octopuses.map((line) => line.map((octopus) => octopus + 1));
    // all 9's flash
    let hasFlashed = false;
    do {
      hasFlashed = false;
      for (var i = 0; i < octopuses.length; i += 1) {
        for (var j = 0; j < octopuses.length; j += 1) {
          if (octopuses[i][j] > 9) {
            octopuses[i][j] = 0;
            hasFlashed = true;

            deltas.forEach((delta) => {
              if (
                i + delta[0] >= 0 &&
                i + delta[0] < octopuses.length &&
                j + delta[1] >= 0 &&
                j + delta[1] < octopuses[i].length &&
                octopuses[i + delta[0]][j + delta[1]] !== 0
              ) {
                octopuses[i + delta[0]][j + delta[1]] += 1;
              }
            });
          }
        }
      }
    } while (hasFlashed);
    allOctopusFlashed = octopuses.every(line => line.every(octopus => octopus === 0));
  }

  return numberOfSteps;
};

(() => {
  const testInput = getInput(true);
  const testPart1Expected = 1656;
  const testPart2Expected = 195;
  const input = getInput();

  const testPart1 = run(testInput);
  console.log(
    "Test Part 1:",
    testPart1,
    testPart1 === testPart1Expected ? "✅" : `❌, expected ${testPart1Expected}`
  );
  const testPart2 = run2(testInput);
  console.log(
    "Test Part 2:",
    testPart2,
    testPart2 === testPart2Expected ? "✅" : `❌, expected ${testPart2Expected}`
  );

  const part1 = run(input);
  console.log("Part 1:", part1);
  const part2 = run2(input);
  console.log("Part 2:", part2);
})();
