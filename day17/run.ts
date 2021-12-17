interface TargetArea {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

const testTargetArea: TargetArea = {
  xMin: 20,
  xMax: 30,
  yMin: -10,
  yMax: -5,
};

const realTargetArea: TargetArea = {
  xMin: 124,
  xMax: 174,
  yMin: -123,
  yMax: -86,
};

interface Coord {
  x: number;
  y: number;
}

interface Result {
  maxHeight: number;
  numberOfHits: number;
}

const run = (targetArea: TargetArea): Result => {
  let maxHeight = -Infinity;
  let numberOfHits = 0;

  for (var x = 0; x <= targetArea.xMax; x += 1) {
    for (var y = -targetArea.xMax; y <= targetArea.xMax; y += 1) {
      let currentPos: Coord = { x: 0, y: 0 };
      let velocity: Coord = { x, y };
      let maxHeightTrajectory = 0;
      let trajectoryHitTarget = false;
      while (currentPos.y >= targetArea.yMin && !trajectoryHitTarget) {
        currentPos.x += velocity.x;
        currentPos.y += velocity.y;
        maxHeightTrajectory = Math.max(maxHeightTrajectory, currentPos.y);
        if (
          currentPos.x >= targetArea.xMin &&
          currentPos.x <= targetArea.xMax &&
          currentPos.y >= targetArea.yMin &&
          currentPos.y <= targetArea.yMax
        ) {
          trajectoryHitTarget = true;
        }
        if (velocity.x > 0) {
          velocity.x -= 1;
        } else if (velocity.x < 0) {
          velocity.x += 1;
        }
        velocity.y -= 1;
      }
      if (trajectoryHitTarget) {
        numberOfHits += 1;
        maxHeight = Math.max(maxHeightTrajectory, maxHeight);
      }
    }
  }

  return { maxHeight, numberOfHits };
};

(() => {
  const runTest = (title: string, expectedResult: Result) => {
    const result = run(testTargetArea);
    console.log(
      `Test Part ${title}:`,
      result,
      result.maxHeight === expectedResult.maxHeight && result.numberOfHits === expectedResult.numberOfHits
        ? "✅"
        : `❌, expected maxHeight = ${expectedResult.maxHeight}, numberOfHits: ${expectedResult.numberOfHits}`
    );
  };

  runTest("1 & 2", { maxHeight: 45, numberOfHits: 112 });

  const result = run(realTargetArea);
  console.log("Result:", result);
})();
