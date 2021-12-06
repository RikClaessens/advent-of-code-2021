import fs from "fs";

const getInput = () => {
  const input = fs.readFileSync("./input.txt", "utf8");
  const numbers = input.split('\n').map(x => Number.parseInt(x));
  return numbers;
};

const countDeltas = numbers => {
  let increase = 0;
  let decrease = 0;

  for (var i = 1; i < numbers.length; i += 1) {
    if (numbers[i] > numbers[i - 1]) {
      increase += 1;
    } else if (numbers[i] < numbers[i - 1]) {
      decrease += 1;
    } 
  }
  return increase;
}

const createSlidingWindows = numbers => {
  let slidingWindows = [] as number[];

  for (var i = 2; i < numbers.length; i += 1) {
    slidingWindows.push(numbers[i-2] + numbers[i-1] + numbers[i]);
  }
  return slidingWindows;
}

(() => {
	const input = getInput();
  const part1 = countDeltas(input);
  console.log('Part 1: ', part1);

  const slidingWindows = createSlidingWindows(input);
  const part2 = countDeltas(slidingWindows);
  console.log('Part 2: ', part2);
})();