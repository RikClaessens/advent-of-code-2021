import fs from "fs";

const getInput = () => {
  const input = fs.readFileSync("./input.txt", "utf8");
  const numbers = input.split("\n");
  return numbers;
};

const getGammaAndEpsilon = (numbers) => {
  const sums = new Array(numbers[0].toString().length).fill(0);
  numbers
    .map((n: number) => n.toString())
    .forEach((n: string) => {
      const bits = n.split("");
      bits.forEach((b: string, i: string | number) => {
        sums[i] += Number.parseInt(b);
      });
    });
  const gammaRate = sums
    .map((s) => Math.round(s / numbers.length))
    .reduce((binary, n) => `${binary}${n}`, "");
  const epsilonRate = sums
    .map((s) => 1 - Math.round(s / numbers.length))
    .reduce((binary, n) => `${binary}${n}`, "");
    return { gammaRate, epsilonRate}
}

const calculatePowerConsumption = (numbers) => {
  const { gammaRate, epsilonRate } = getGammaAndEpsilon(numbers);
  const gammaRateDecimal = Number.parseInt(gammaRate.toString(), 2);
  const epsilonRateDecimal = Number.parseInt(epsilonRate.toString(), 2);
  console.log('Part 1:', gammaRateDecimal * epsilonRateDecimal);
};

const calculateO2AndCO2Ratings = numbers => {
  let oxygenNumbers = numbers.map(n => n);
  let co2Numbers = numbers.map(n => n);
  for (var i = 0; i < numbers[0].length; i += 1) {
    const { gammaRate } = getGammaAndEpsilon(oxygenNumbers);
    const { epsilonRate } = getGammaAndEpsilon(co2Numbers);

    if (oxygenNumbers.length > 1) {
      oxygenNumbers = oxygenNumbers.filter(oxygenNumber => oxygenNumber[i] === gammaRate.toString()[i]);
    }
    if (co2Numbers.length > 1) {
      co2Numbers = co2Numbers.filter(co2Number => co2Number[i] === epsilonRate.toString()[i]);
    }

  }
  console.log('Part 2:', Number.parseInt(oxygenNumbers[0], 2) * Number.parseInt(co2Numbers[0], 2))
}

(() => {
	const input = getInput();

  calculatePowerConsumption(input);
  calculateO2AndCO2Ratings(input);
})();
