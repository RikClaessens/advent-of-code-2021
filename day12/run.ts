import fs from "fs";

const getInput = (fileName: string): string[][] => {
  return fs
    .readFileSync(`./${fileName}.txt`, "utf8")
    .split("\n")
    .map((line) => line.split("-"));
};

const findRoutes = (routeSoFar: string[], map: Map<string, string>, visitOneSmallCaveTwice: boolean): void => {
  const node = routeSoFar[routeSoFar.length - 1];

  map[node].forEach((nextNode) => {
    if (nextNode === nextNode.toLowerCase() && routeSoFar.indexOf(nextNode) >= 0) {
      // part1 do nothing, already visited this lowercase cave
      const numberOfTimesVisitedThisNode = routeSoFar.filter(node => node === nextNode).length;
      // part 2
      if (visitOneSmallCaveTwice && numberOfTimesVisitedThisNode <= 1) {
        findRoutes([...routeSoFar, nextNode], map, false);
      }
    } else if (nextNode === 'end') {
      part1Routes.push([...routeSoFar, 'end']);
    } else {
      findRoutes([...routeSoFar, nextNode], map, visitOneSmallCaveTwice);
    }
  });
};

let part1Routes: string[][] = [];
const run = (input: string[][], visitOneSmallCaveTwice: boolean): number => {
  const map = new Map<string, string>();
  input.forEach((path) => {
    if (!map[path[0]]) {
      map[path[0]] = [] as string[];
    }
    if (!map[path[1]]) {
      map[path[1]] = [] as string[];
    }
    if (path[1] === 'start' || path[0] === 'end') {
      map[path[1]].push(path[0]);
    } else if (path[0] === 'start' || path[1] === 'end') {
      map[path[0]].push(path[1]);
    } else {
      map[path[0]].push(path[1]);
      map[path[1]].push(path[0]);
    }
  });
  findRoutes(["start"], map, visitOneSmallCaveTwice);
  const numberOfRoutes = part1Routes.length;
  part1Routes = [];

  return numberOfRoutes;
};

(() => {
  const input = getInput('input');

  const runTest = (fileName: string, title: string, expectedResult: number, visitOneSmallCaveTwice: boolean = false) => {
    const result = run(getInput(fileName), visitOneSmallCaveTwice);
    console.log(
      `Test Part ${title}:`,
      result,
      result === expectedResult ? "✅" : `❌, expected ${expectedResult}`
    );
  }

  runTest('test', '1a', 10);
  runTest('test2', '1b', 19);
  runTest('test3', '1c', 226);

  runTest('test', '2a', 36, true);
  runTest('test2', '2b', 103, true);
  runTest('test3', '2c', 3509, true);

  const part1 = run(input, false);
  console.log("Part 1:", part1);
  const part2 = run(input, true);
  console.log("Part 2:", part2);
})();
