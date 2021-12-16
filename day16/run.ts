import fs from "fs";

const hexToBin: { [key: string]: string } = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

const getInput = (fileName: string): string => {
  const lines: string[] = fs
    .readFileSync(`./${fileName}.txt`, "utf8")
    .split("\n");
  return lines[0]
    .split("")
    .map((c) => hexToBin[c])
    .join("");
};

let versionSum = 0;

interface Packet {
  value: number;
  length: number;
}

const operation = (packetTypeId: number, packets: Packet[]): number => {
  switch (packetTypeId) {
    case 0: return packets.reduce((sum, p) => sum + p.value, 0);
    case 1: return packets.reduce((product, p) => product * p.value, 1);
    case 2: return Math.min(...packets.map(p => p.value));
    case 3: return Math.max(...packets.map(p => p.value));
    case 5: return packets[0].value > packets[1].value ? 1 : 0;
    case 6: return packets[0].value < packets[1].value ? 1 : 0;
    case 7: return packets[0].value === packets[1].value ? 1 : 0;
  }
  return 0;
}

const decodePacket = (
  packet: string
): Packet => {
  const packetVersion = parseInt(packet.substring(0, 3), 2);
  const packetTypeId = parseInt(packet.substring(3, 6), 2);
  versionSum += packetVersion;

  if (packetTypeId === 4) {
    let position = 6;
    let binaryNumber = "";
    while (packet[position] === '1') {
      binaryNumber += packet.substring(position + 1, (position + 5));
      position += 5;
    }
    binaryNumber += packet.substring(position + 1, (position + 5));
    return { value: parseInt(binaryNumber, 2), length: position + 5 };
  }
  // all other packet type ids

  const lengthTypeId = packet.substring(6, 7);
  let reachedLength: number = 0;
  const subPackets: Packet[] = [];

  if (lengthTypeId === '0') {
    const totalLengthSubPacketsInBits = parseInt(packet.substring(7, 22), 2);
    while (reachedLength < totalLengthSubPacketsInBits) {
      const decodedPacket = decodePacket(packet.substring(22 + reachedLength));
      reachedLength += decodedPacket.length;
      subPackets.push(decodedPacket);
    }
    return { value: operation(packetTypeId, subPackets), length: 22 + reachedLength };
  } else {
    const numberOfSubPackets = parseInt(packet.substring(7, 18), 2);
    while (subPackets.length < numberOfSubPackets) {
      const decodedPacket = decodePacket(packet.substring(18 + reachedLength));
      reachedLength += decodedPacket.length;
      subPackets.push(decodedPacket);
    }
    return { value: operation(packetTypeId, subPackets), length: 18 + reachedLength };
  }
};

(() => {
  const input = getInput("input");

  const runTest = (fileName: string, title: string, expectedResult: number) => {
    const { value } = decodePacket(getInput(fileName));
    console.log(
      `Test Part ${title}:`,
      versionSum,
      versionSum === expectedResult ? "✅" : `❌, expected ${expectedResult}`
    );
  };

  // part 1 904
  // part 2 200476472872
  // runTest("test", "1", 40);
  // runTest("test", "2", 315);

  console.log("Result: part 2 =", decodePacket(input).value, "part 1 =", versionSum);
  // const part2 = run(input);
  // console.log("Part 2:", part2);
})();
