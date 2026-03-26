export const digitRange = Array.from({ length: 10 }, (_, i) => i);
export const generateEvenEvenNumbers = () =>
  digitRange
    .filter((d) => d % 2 === 0)
    .flatMap((first) =>
      digitRange.filter((d) => d % 2 === 0).map((second) => `${first}${second}`)
    );

export const generateOddOddNumbers = () =>
  digitRange
    .filter((d) => d % 2 !== 0)
    .flatMap((first) =>
      digitRange.filter((d) => d % 2 !== 0).map((second) => `${first}${second}`)
    );

export const generateEvenOddNumbers = () =>
  digitRange
    .filter((d) => d % 2 === 0)
    .flatMap((first) =>
      digitRange.filter((d) => d % 2 !== 0).map((second) => `${first}${second}`)
    );

export const generateOddEvenNumbers = () =>
  digitRange
    .filter((d) => d % 2 !== 0)
    .flatMap((first) =>
      digitRange.filter((d) => d % 2 === 0).map((second) => `${first}${second}`)
    );

export const generatePowerNumbers = () =>
  Array.from({ length: 9 }, (_, i) => (5 + i * 11).toString().padStart(2, "0"));

export const generateDoubleNumbers = () => digitRange.map((d) => `${d}${d}`);

export const generateConsecutiveNumbers = () => {
  const numbers = [];
  for (let i = 0; i <= 8; i++) numbers.push(`${i}${i + 1}`);
  numbers.push("90");
  for (let i = 1; i <= 9; i++) numbers.push(`${i}${i - 1}`);
  numbers.push("09");
  return numbers.sort();
};

export const generateNekhatNumbers = () => ["18", "24", "35", "69", "70"];

export const generateNumbersContainingDigit = (digit) =>
  Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, "0")).filter(
    (n) => n.includes(digit.toString())
  );

export const generateNumbersWithFirstDigit = (digit) =>
  digitRange.map((d) => `${digit}${d}`);

export const generateNumbersWithSecondDigit = (digit) =>
  digitRange.map((d) => `${d}${digit}`);

export const generateNumbersWithDigitSum = (sum) =>
  digitRange.flatMap((a) =>
    digitRange.filter((b) => a + b === sum).map((b) => `${a}${b}`)
  );

/** ---------- Config Arrays ---------- **/
export const patternGroups = [
  {
    title: "ရိုးရိုး",
    options: [
      { label: "စုံစုံ", fn: generateEvenEvenNumbers },
      { label: "မမ", fn: generateOddOddNumbers },
      { label: "စုံမ", fn: generateEvenOddNumbers },
      { label: "မစုံ", fn: generateOddEvenNumbers },
    ],
  },
  {
    title: "နက္ခတ်၊ ပါဝါ",
    options: [
      { label: "နက္ခတ်", fn: generateNekhatNumbers },
      { label: "ပါဝါ", fn: generatePowerNumbers },
      { label: "အပူး", fn: generateDoubleNumbers },
      { label: "ညီအကို", fn: generateConsecutiveNumbers },
    ],
  },
];

export const digitGroups = [
  { title: "ပါတ်", fn: generateNumbersContainingDigit },
  { title: "ထိပ်", fn: generateNumbersWithFirstDigit },
  { title: "နောက်", fn: generateNumbersWithSecondDigit },
  { title: "ဘရိတ်", fn: generateNumbersWithDigitSum },
];
