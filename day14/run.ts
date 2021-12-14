import fs from "fs";

interface Formula {
  template: string;
  pairInsertionRules: Map<string, string>;
}

const getInput = (fileName: string): Formula => {
  const lines = fs.readFileSync(`./${fileName}.txt`, "utf8").split("\n");
  const pairInsertionRules = new Map<string, string>();
  lines
    .slice(2)
    .map((line) => line.split(" -> "))
    .forEach((split) => (pairInsertionRules[split[0]] = split[1]));
  const formula: Formula = {
    template: lines[0],
    pairInsertionRules,
  };

  return formula;
};

const run = (formula: Formula, numberOfSteps: number = 10): number => {
  let template = formula.template;
  const uniqueElements = [
    ...new Set([
      ...formula.template.split(""),
      ...Object.keys(formula.pairInsertionRules).map((pair) => formula.pairInsertionRules[pair]),
    ]),
  ];
  let counts = new Map<string, number>();
  uniqueElements
    .flatMap((v, i) => uniqueElements.map((w) => `${v}${w}`))
    .forEach((combination) => (counts[combination] = 0));

  for (var i = 1; i < template.length; i += 1) {
    counts[`${template[i - 1]}${template[i]}`] += 1;
  }

  new Array(numberOfSteps).fill(0).forEach((_, step) => {
    const newCounts = Object.assign({}, counts);
    Object.keys(newCounts).forEach(key => newCounts[key] = 0);
    Object.keys(counts).forEach((countKey) => {
      newCounts[`${countKey[0]}${formula.pairInsertionRules[countKey]}`] += counts[countKey];
      newCounts[`${formula.pairInsertionRules[countKey]}${countKey[1]}`] += counts[countKey];
    });
    counts = Object.assign({}, newCounts);
  });

  const uniqueElementCounts = new Map<string, number>();
  uniqueElements.forEach(uniqueElement => uniqueElementCounts[uniqueElement] = 0);

  Object.keys(counts).forEach((countKey) => {
    uniqueElementCounts[countKey[0]] += counts[countKey] / 2;
    uniqueElementCounts[countKey[1]] += counts[countKey] / 2;
  });
  uniqueElementCounts[formula.template[0]] += 0.5;
  uniqueElementCounts[formula.template[formula.template.length - 1]] += 0.5;

  let leastCommonElementOcc = Infinity;
  let mostCommonElementOcc = -Infinity;
  uniqueElements.forEach((uniqueElement) => {
    const count = uniqueElementCounts[uniqueElement];
    leastCommonElementOcc = Math.min(leastCommonElementOcc, count);
    mostCommonElementOcc = Math.max(mostCommonElementOcc, count);
  });

  return mostCommonElementOcc - leastCommonElementOcc;
};

(() => {
  const input = getInput("input");

  const runTest = (fileName: string, title: string, expectedResult: number, numberOfSteps: number = 10) => {
    const result = run(getInput(fileName), numberOfSteps);
    console.log(
      `Test Part ${title}:`,
      result,
      result === expectedResult ? "✅" : `❌, expected ${expectedResult}`
    );
  };

  runTest("test", "1", 1588);
  runTest("test", "2", 2188189693529, 40);

  const part1 = run(input);
  console.log("Part 1:", part1);
  const part2 = run(input, 40);
  console.log("Part 2:", part2);
})();
