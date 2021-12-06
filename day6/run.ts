import fs from "fs";

const getInput = (): number[] => {
  return fs.readFileSync("./input.txt", "utf8").split("\n")[0].split(',').map(n => Number.parseInt(n));
};

const evolve = (fishes: number[], daysToEvolve: number) => {
  let currentFishes = fishes.map(f => f);
  for (var day = 0; day < daysToEvolve; day += 1) {
    let fishesToAdd: number[] = [];
    currentFishes.forEach((fish, fishIndex) => {
      if (fish === 0) {
        currentFishes[fishIndex] = 6;
        fishesToAdd.push(8);
      } else {
        currentFishes[fishIndex] -= 1;
      }
    })
    currentFishes = [...currentFishes, ...fishesToAdd];
  }
  console.log('Part 1:', currentFishes.length);
}

const evolveEfficient = (fishes: number[], daysToEvolve: number) => {
  const fishCounts = new Array(9).fill(0);
  fishes.forEach(fish => { 
    fishCounts[fish] += 1;
  });
  for (var day = 0; day < daysToEvolve; day += 1) {
    let fishesToAdd: 0;
    fishesToAdd = fishCounts[0];
    for (var i = 1; i < fishCounts.length; i += 1) {
      fishCounts[i - 1] = fishCounts[i];
    }
    fishCounts[8] = fishesToAdd;
    fishCounts[6] += fishesToAdd;
    // console.log(`Day ${day + 1}:`, fishCounts.join(', '));
  }
  return fishCounts.reduce((sum, fishCount) => sum + fishCount, 0);
}

(() => {
  const fishes = getInput();
  // evolve(fishes, 80);
  const part1 = evolveEfficient(fishes, 80);
  console.log('Part 1:', part1);
  const part2 = evolveEfficient(fishes, 256);
  console.log('Part 2:', part2);
})();
