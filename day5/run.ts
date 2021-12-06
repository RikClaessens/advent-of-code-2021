import fs from "fs";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const getInput = (): Line[] => {
  const input = fs.readFileSync("./input.txt", "utf8").split("\n");
  const lines = input
    .map((line) => line.split(" -> "))
    .map((line) => {
      const coords1 = line[0].split(",").map((n) => Number.parseInt(n));
      const coords2 = line[1].split(",").map((n) => Number.parseInt(n));
      return {
        x1: coords1[0],
        y1: coords1[1],
        x2: coords2[0],
        y2: coords2[1],
      };
    });
  return lines;
};

const displayGrid = (grid: number[][]) => {
  grid.forEach((row) =>
    console.log(
      row.reduce(
        (rowOutput, point) => `${rowOutput}${point === 0 ? "." : point}`,
        ""
      )
    )
  );
  console.log();
};

const overlap = (lines: Line[], shouldFilter: boolean) => {
  const linesToUse = shouldFilter ? lines.filter(
    (line) => line.x1 === line.x2 || line.y1 === line.y2
  ) : lines.map(l => l);
  const maxX = Math.max(
    ...linesToUse.reduce(
      (allXs: number[], line: Line) => [...allXs, line.x1, line.x2],
      []
    )
  );
  const maxY = Math.max(
    ...linesToUse.reduce(
      (allYs: number[], line: Line) => [...allYs, line.y1, line.y2],
      []
    )
  );

  const grid: number[][] = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));

  linesToUse.forEach(line => {
    const dx = line.x2 > line.x1 ? 1 : line.x2 < line.x1 ? -1 : 0;
    const dy = line.y2 > line.y1 ? 1 : line.y2 < line.y1 ? -1 : 0;

    let markX = line.x1;
    let markY = line.y1;

    // console.log(line.y1, line.x1);
    // console.log(grid[line.y1][line.x1]);

    grid[line.y1][line.x1] += 1;

    while (markX !== line.x2 || markY !== line.y2) {
      markX += dx;
      markY += dy;
      grid[markY][markX] += 1;
    }

  });

  let numberOfDoubleOverlaps = 0;
  grid.forEach(row => row.forEach(point => {
    if (point >= 2) {
      numberOfDoubleOverlaps += 1;
    }
  }));

  console.log('Number of double overlaps: ', numberOfDoubleOverlaps);
};

(() => {
  const lines = getInput();

  overlap(lines, true);
  overlap(lines, false);
})();
