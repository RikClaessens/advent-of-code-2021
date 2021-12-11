import fs from "fs";

const getInput = (useTestInput: boolean = false): string[] => {
  return fs
    .readFileSync(`./${useTestInput ? "test" : "input"}.txt`, "utf8")
    .split("\n");
};

interface LineResult {
  score: number;
  chunks: string[];
}

const checkCorrupt = (line: string): LineResult => {
  const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let chunks: string[] = [];
  const openChunks = ["(", "[", "{", "<"];
  const closeChunks = [")", "]", "}", ">"];
  let score = 0;
  line.split("").some((char) => {
    if (openChunks.indexOf(char) >= 0) {
      chunks.push(closeChunks[openChunks.indexOf(char)]);
    } else {
      if (char === chunks[chunks.length - 1]) {
        chunks.splice(chunks.length - 1, 1);
      } else {
        score += points[char];
        return true;
      }
    }
  });
  return { score, chunks };
};

const run = (lines: string[]): number =>
  lines.reduce((totalScore, line) => totalScore + checkCorrupt(line).score, 0);

const run2 = (lines: string[]): number => {
  const points = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  }
  const scores: number[] = lines
    .map((line) => checkCorrupt(line))
    .filter((lineResult) => lineResult.score === 0)
    .map(lineResult => lineResult.chunks)
    .map(chunks => {
      let score = 0;
      for (var i = chunks.length - 1; i >= 0; i -= 1) {
        score = (score * 5) + points[chunks[i]];
      }
      return score
    });

  return scores.sort((a, b) => a - b)[Math.round((scores.length - 1) / 2)];
};

(() => {
  const testInput = getInput(true);
  const testPart1Expected = 26397;
  const testPart2Expected = 288957;
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
