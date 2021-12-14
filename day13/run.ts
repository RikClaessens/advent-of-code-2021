import fs from "fs";

interface Dot {
  x: number;
  y: number;
}
interface FoldInstruction {
  axis: "x" | "y";
  coord: number;
}

interface Instructions {
  dots: Dot[];
  foldInstructions: FoldInstruction[];
  width: number;
  height: number;
}

interface Grid {
  dots: Dot[];
  width: number;
  height: number;
}

const displayGrid = (grid: Grid) => {
  const gridOutput = new Array(grid.height)
    .fill(0)
    .map((_) => new Array(grid.width).fill("."));
  grid.dots.forEach((dot) => {
    gridOutput[dot.y][dot.x] = "#";
  });
  console.log(gridOutput.map((line) => line.join("")).join("\n") + "\n");
};

const getInput = (fileName: string): Instructions => {
  const lines = fs.readFileSync(`./${fileName}.txt`, "utf8").split("\n");
  const instructions: Instructions = {
    dots: [],
    foldInstructions: [],
    width: 0,
    height: 0,
  };
  lines.forEach((line) => {
    if (line.startsWith("fold along")) {
      const foldInstruction = line.replace("fold along ", "").split("=");
      let axis: "x" | "y" = "x";
      if (foldInstruction[0] === "y") {
        axis = "y";
      }
      instructions.foldInstructions.push({
        axis,
        coord: Number.parseInt(foldInstruction[1]),
      });
    } else if (line !== "") {
      const dot = line.split(",").map((x) => Number.parseInt(x));
      instructions.dots.push({
        x: dot[0],
        y: dot[1],
      });
      instructions.width = Math.max(instructions.width, dot[0] + 1);
      instructions.height = Math.max(instructions.height, dot[1] + 1);
    }
  });

  return instructions;
};

const fold = ({
  foldInstruction,
  dots,
  width,
  height,
}: {
  foldInstruction: FoldInstruction;
  dots: Dot[];
  width: number;
  height: number;
}): Grid => {
  if (foldInstruction.axis === "x") {
    const newWidth = Math.floor(width / 2);
    let newDots = dots
      .filter((dot) => dot.x !== foldInstruction.coord)
      .map((dot) => ({
        x:
          dot.x > foldInstruction.coord
            ? foldInstruction.coord - (dot.x - foldInstruction.coord)
            : dot.x,
        y: dot.y,
      }));
    for (var i = 0; i < newDots.length; i += 1) {
      for (var j = 0; j < newDots.length; j += 1) {
        if (
          i !== j &&
          newDots[i].x === newDots[j].x &&
          newDots[i].y === newDots[j].y
        ) {
          newDots[i].x = -1;
          newDots[i].y = -1;
        }
      }
    }
    newDots = newDots.filter((dot) => dot.x !== -1);
    return { dots: newDots, width: newWidth, height };
  } else if (foldInstruction.axis === "y") {
    const newHeight = Math.floor(height / 2);
    let newDots = dots
      .filter((dot) => dot.y !== foldInstruction.coord)
      .map((dot) => ({
        x: dot.x,
        y:
          dot.y > foldInstruction.coord
            ? foldInstruction.coord - (dot.y - foldInstruction.coord)
            : dot.y,
      }));
    for (var i = 0; i < newDots.length; i += 1) {
      for (var j = 0; j < newDots.length; j += 1) {
        if (
          i !== j &&
          newDots[i].x === newDots[j].x &&
          newDots[i].y === newDots[j].y
        ) {
          newDots[i].x = -1;
          newDots[i].y = -1;
        }
      }
    }
    newDots = newDots.filter((dot) => dot.x !== -1);
    return { dots: newDots, width, height: newHeight };
  }
  return { dots: [], width: 0, height: 0 };
};

const run = (
  instructions: Instructions,
  onlyFirstFold: boolean = false
): number => {
  const { dots, width, height } = instructions;
  // displayGrid({ dots, width, height });
  // part 1, fold once
  let foldInstructions = instructions.foldInstructions;
  if (onlyFirstFold) {
    foldInstructions = [foldInstructions[0]];
  }
  let newGrid: Grid = { dots: instructions.dots, width, height };
  foldInstructions.forEach((foldInstruction) => {
    newGrid = fold({
      foldInstruction,
      dots: newGrid.dots,
      width: newGrid.width,
      height: newGrid.height,
    });
  });
  if (!onlyFirstFold) {
    displayGrid(newGrid);
  }
  return newGrid.dots.length;
};

(() => {
  const input = getInput("input");

  const runTest = (
    fileName: string,
    title: string,
    expectedResult: number,
    onlyFirstFold: boolean
  ) => {
    const result = run(getInput(fileName), onlyFirstFold);
    console.log(
      `Test Part ${title}:`,
      result,
      result === expectedResult ? "✅" : `❌, expected ${expectedResult}`
    );
  };

  runTest("test", "1", 17, true);

  const part1 = run(input, true);
  console.log("Part 1:", part1);
  console.log("Part 2:");
  run(input);
})();
