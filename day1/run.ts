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
  console.log({ increase, decrease })
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
  countDeltas(input);

  const slidingWindows = createSlidingWindows(input);
  countDeltas(slidingWindows);
})();