import fs from "fs";

interface Display {
  signals: string[];
  output: string[];
}

const getInput = (useTestInput: boolean = false): Display[] => {
  return fs
    .readFileSync(`./${useTestInput ? "test" : "input"}.txt`, "utf8")
    .split("\n")
    .map((line) => line.split(" | "))
    .map((line) => ({
      signals: line[0].split(" "),
      output: line[1].split(" "),
    }));
};

const run = (displays: Display[]): number => {
  const countOf1478s = displays
    .map(
      (display) =>
        display.output.filter(
          (outputDigit) => [2, 3, 4, 7].indexOf(outputDigit.length) >= 0
        ).length
    )
    .reduce((sum, count) => sum + count, 0);
  return countOf1478s;
};

/*
0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

const run2 = (displays: Display[]): number => {
  const finalOutputs: string[] = [];
  displays.forEach((display) => {
    const segments = new Array(7).fill(0).map((_) => ({
      a: true,
      b: true,
      c: true,
      d: true,
      e: true,
      f: true,
      g: true,
    }));

    const sortedSignals = [...display.signals, ...display.output].sort(
      (a, b) => a.length - b.length
    );
    // inspect unique length signals
    const allSegments = ["a", "b", "c", "d", "e", "f", "g"];
    sortedSignals.forEach((sortedSignal) => {
      switch (sortedSignal.length) {
        case 2:
          [0, 1, 3, 4, 6].forEach((segment) =>
            sortedSignal
              .split("")
              .forEach((signal) => (segments[segment][signal] = false))
          );
          [2, 5].forEach((segment) =>
            allSegments
              .filter((s) => !sortedSignal.split("").includes(s))
              .forEach((signal) => (segments[segment][signal] = false))
          );
          break;
        case 3:
          [1, 3, 4, 6].forEach((segment) =>
            sortedSignal
              .split("")
              .forEach((signal) => (segments[segment][signal] = false))
          );
          [0, 2, 5].forEach((segment) =>
            allSegments
              .filter((s) => !sortedSignal.split("").includes(s))
              .forEach((signal) => (segments[segment][signal] = false))
          );
          break;
        case 4:
          [0, 4, 6].forEach((segment) =>
            sortedSignal
              .split("")
              .forEach((signal) => (segments[segment][signal] = false))
          );
          [1, 2, 3, 5].forEach((segment) =>
            allSegments
              .filter((s) => !sortedSignal.split("").includes(s))
              .forEach((signal) => (segments[segment][signal] = false))
          );
          break;
      }
    });

    // inspect signal lengths 5 and 6
    const segmentOptions = segments.map((segment, index) =>
      Object.keys(segment).filter((key) => segment[key])
    );
    const finalSegmentOptions = segmentOptions.map(so => so.map(o => o));

    sortedSignals.forEach((sortedSignal) => {
      const signalLetters = sortedSignal.split("");
      const group13 = signalLetters.filter((x) =>
        segmentOptions[1].includes(x)
      );
      const group25 = signalLetters.filter((x) =>
        segmentOptions[2].includes(x)
      );
      const group46 = signalLetters.filter((x) =>
        segmentOptions[4].includes(x)
      );

      if (sortedSignal.length === 5) {
        // 2
        if (group13.length === 1 && group25.length === 1 && group46.length === 2) {
          finalSegmentOptions[3] = group13.map((x) => x);
          finalSegmentOptions[1] = segmentOptions[1].filter(
            (so) => so.indexOf(group13[0]) === -1
          );

          finalSegmentOptions[2] = group25.map((x) => x);
          finalSegmentOptions[5] = segmentOptions[5].filter(
            (so) => so.indexOf(group25[0]) === -1
          );
        }
        // 3
        if (group13.length === 1 && group46.length === 1 && group25.length === 2) {
          finalSegmentOptions[3] = group13.map((x) => x);
          finalSegmentOptions[1] = segmentOptions[1].filter(
            (so) => so.indexOf(group13[0]) === -1
          );

          finalSegmentOptions[6] = group46.map((x) => x);
          finalSegmentOptions[4] = segmentOptions[4].filter(
            (so) => so.indexOf(group46[0]) === -1
          );
        }
        // 5
        if (group25.length === 1 && group46.length === 1 && group13.length === 2) {
          finalSegmentOptions[5] = group25.map((x) => x);
          finalSegmentOptions[2] = segmentOptions[2].filter(
            (so) => so.indexOf(group25[0]) === -1
          );

          finalSegmentOptions[6] = group46.map((x) => x);
          finalSegmentOptions[4] = segmentOptions[4].filter(
            (so) => so.indexOf(group46[0]) === -1
          );
        }
      } else if (sortedSignal.length === 6) {
        // 0
        if (group13.length === 1 && group25.length === 2 && group46.length === 2) {
          finalSegmentOptions[1] = group13.map((x) => x);
          finalSegmentOptions[3] = segmentOptions[3].filter(
            (so) => so.indexOf(group13[0]) === -1
          );
        }
        // 6
        if (group13.length === 2 && group25.length === 1 && group46.length === 2) {
          finalSegmentOptions[5] = group25.map((x) => x);
          finalSegmentOptions[2] = segmentOptions[2].filter(
            (so) => so.indexOf(group25[0]) === -1
          );
        }
        // 9
        if (group13.length === 2 && group25.length === 2 && group46.length === 1) {
          finalSegmentOptions[6] = group46.map((x) => x);
          finalSegmentOptions[4] = segmentOptions[4].filter(
            (so) => so.indexOf(group46[0]) === -1
          );
        }
      }
    });

    let finalOutput = '';
    
    display.output.forEach(outputSignal => {
      const enabledSegments = finalSegmentOptions.map(fso => outputSignal.indexOf(fso[0]) >= 0).map(x => x ? '1': '0').join('');
      switch(enabledSegments) {
        case ('1110111'): finalOutput += '0'; break;
        case ('0010010'): finalOutput += '1'; break;
        case ('1011101'): finalOutput += '2'; break;
        case ('1011011'): finalOutput += '3'; break;
        case ('0111010'): finalOutput += '4'; break;
        case ('1101011'): finalOutput += '5'; break;
        case ('1101111'): finalOutput += '6'; break;
        case ('1010010'): finalOutput += '7'; break;
        case ('1111111'): finalOutput += '8'; break;
        case ('1111011'): finalOutput += '9'; break;
      }
      
    })
    finalOutputs.push(finalOutput);
  });
  return finalOutputs.map(output => Number.parseInt(output)).reduce((sum, value) => sum + value, 0);
};

(() => {
  const testInput = getInput(true);
  const testPart1Expected = 26;
  const testPart2Expected = 61229;
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
  console.log('Part 2:', part2);
})();
