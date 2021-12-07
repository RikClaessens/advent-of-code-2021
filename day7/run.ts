import fs from "fs";

const getInput = (useTestInput: boolean = false): number[] => {
  return fs.readFileSync(`./${useTestInput ? 'test': 'input'}.txt`, "utf8").split("\n")[0].split(',').map(n => Number.parseInt(n));
};

const run = (crabs: number[], fuelConsumption: (crab: number, pos: number) => number): number => {
  const min = Math.min(...crabs);
  const max = Math.max(...crabs);

  let alignPosition = -1;
  let alignFuelNeed = 0;
  for (var pos = min; pos <= max; pos += 1) {
    const fuelNeed = crabs.reduce((fuelTotal, crab) => fuelTotal + fuelConsumption(crab, pos), 0);
    if (alignPosition === -1 || fuelNeed < alignFuelNeed) {
      alignPosition = pos;
      alignFuelNeed = fuelNeed;
    }
  }
  return alignFuelNeed;
}

(() => {
  const testCrabs = getInput(true);
  const testPart1Expected = 37;
  const testPart2Expected = 168;
  const crabs = getInput();
  const fuelConsumptionPart1 = (crab: number, pos: number) => Math.abs(crab - pos);
  const fuelConsumptionPart2 = (crab: number, pos: number) => new Array(Math.abs(crab - pos)).fill(0).map((_, index) => index + 1).reduce((sum, pos) => sum + pos, 0)

  const testPart1 = run(testCrabs, fuelConsumptionPart1);
  console.log('Test Part 1:', testPart1, testPart1 === testPart1Expected ? '✅' : `❌, expected ${testPart1Expected}` );
  const testPart2 = run(testCrabs, fuelConsumptionPart2);
  console.log('Test Part 2:', testPart2, testPart2 === testPart2Expected ? '✅' : `❌, expected ${testPart2Expected}` );

  const part1 = run(crabs, fuelConsumptionPart1);
  console.log('Part 1:', part1);
  const part2 = run(crabs, fuelConsumptionPart2);
  console.log('Part 2:', part2);
})();
