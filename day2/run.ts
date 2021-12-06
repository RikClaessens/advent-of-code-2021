import fs from "fs";

const getInput = () => {
  const input = fs.readFileSync("./input.txt", "utf8");
  const instructions = input.split('\n').map(x => x.split(' '));
  return instructions;
};

const move = instructions => {
  let horizontal = 0;
  let depth = 0;

  instructions.forEach(instruction => {
    const delta = Number.parseInt(instruction[1]);
    switch (instruction[0]) {
      case 'forward': horizontal += delta; break;
      case 'down': depth += delta; break;
      case 'up': depth -= delta; break;
    }
  });

  return horizontal * depth;
}

const move2 = instructions => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  instructions.forEach(instruction => {
    const delta = Number.parseInt(instruction[1]);
    switch (instruction[0]) {
      case 'forward': horizontal += delta; depth += aim * delta; break;
      case 'down': aim += delta; break;
      case 'up': aim -= delta; break;
    }
  });

  return horizontal * depth;
}

(() => {
	const input = getInput();
  
  const part1 = move(input);
  console.log('Part 1: ', part1);
  
  const part2 = move2(input);
  console.log('Part 2: ', part2);
})();
