import fs from "fs";

const getInput = (fileName: string): number[][] => {
  const lines = fs.readFileSync(`./${fileName}.txt`, "utf8").split("\n");
  return lines.map((line) => line.split("").map((x) => Number.parseInt(x)));
};

interface Position {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  children: Node[];
}

const heuristic = (map: number[][], x: number, y: number) =>
  map.length - 1 - x + map[0].length - 1 - y;

const deltas: Position[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

const aStar = (map: number[][]): number => {
  const openList: Node[] = [];
  const closedList: Node[] = [];

  openList.push({
    x: 0,
    y: 0,
    f: 0,
    g: 0,
    h: heuristic(map, 0, 0),
    children: [],
  });

  while (openList.length > 0) {
    let currentNode: Node = {
      x: 0,
      y: 0,
      f: Infinity,
      g: 0,
      h: 0,
      children: [],
    };
    let nodeIndexToRemove = -1;
    openList.forEach((node, nodeIndex) => {
      if (node.f < currentNode.f) {
        currentNode = node;
        nodeIndexToRemove = nodeIndex;
      }
    });
    openList.splice(nodeIndexToRemove, 1);
    closedList.push(currentNode);
    if (currentNode.x === map.length - 1 && currentNode.y === map[0].length - 1) {
      return currentNode.f;
    }
    deltas.forEach((delta) => {
      const newX = currentNode.x + delta.x;
      const newY = currentNode.y + delta.y;
      if (newX < map.length && newY < map[0].length && newX >= 0 && newY >= 0) {
        currentNode.children.push({
          x: newX,
          y: newY,
          f: 0,
          g: 0,
          h: 0,
          children: [],
        });
      }
    });

    currentNode.children.forEach(child => {
      const isInClosedList = !!closedList.find(closedChild => closedChild.x === child.x && closedChild.y === child.y);
      if (!isInClosedList) {
        child.g = currentNode.g + map[child.x][child.y];
        child.h = heuristic(map, child.x, child.y);
        child.f = child.g + child.h;
        const openListNode = openList.find(openChild => openChild.x === child.x && openChild.y === child.y);
        if (!openListNode || child.g < openListNode.g) {
          openList.push(child);
        }
      }
    });

  }
  return 0;
};

const wrapNumber = (original: number, wrap: number): number => {
  let newNumber = original;
  [...Array(wrap)].forEach(_ => {
    newNumber += 1;
    if (newNumber > 9) {
      newNumber = 1;
    }
  })
  return newNumber;
}

const extendMap = (map: number[][]): number[][] => {

  const bigMap = new Array(map.length * 5).fill(0).map(() => new Array(map[0].length * 5).fill(0));
  for (var i = 0; i <= 4; i += 1) {
    for (var j = 0; j <= 4; j += 1) {
      for (var x = 0; x < map.length; x += 1) {
        for (var y = 0; y < map[0].length; y += 1) {
          bigMap[x + (i * map.length)][y + (j * map[0].length)] = wrapNumber(map[x][y], i + j);
        }
      }
    }
  }
  return bigMap;
}

(() => {
  const input = getInput("input");

  const runTest = (fileName: string, title: string, expectedResult: number, shouldExtendMap: boolean = false) => {
    const map = getInput(fileName);
    const result = aStar(shouldExtendMap ? extendMap(map) : map);
    console.log(
      `Test Part ${title}:`,
      result,
      result === expectedResult ? "✅" : `❌, expected ${expectedResult}`
    );
  };

  runTest("test", "1", 40);
  runTest("test", "2", 315, true);

  const part1 = aStar(input);
  console.log("Part 1:", part1);
  const part2 = aStar(extendMap(input));
  console.log("Part 2:", part2);
})();
