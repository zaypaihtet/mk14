// Generate numbers 000 - 999 within a 100-range (0–9 => 000–099 ... 900–999)
export const generateNumbersForRange = (hundredRange) => {
  const numbers = [];
  const start = hundredRange * 100;
  const end = start + 99;
  for (let i = start; i <= end; i++) {
    numbers.push(i.toString().padStart(3, "0"));
  }
  return numbers;
};

// Toggle a number in a selection list
export const toggleNumber = (selectedNumbers, number) => {
  return selectedNumbers.includes(number)
    ? selectedNumbers.filter((n) => n !== number)
    : [...selectedNumbers, number];
};

// Clean manual input to 3 digits
export const cleanManualInput = (value) => value.replace(/[^0-9]/g, "").slice(0, 3);

// Try to add a manual number; returns { error, numbers }
export const addManualNumber = (manualNumber, selectedNumbers) => {
  if (manualNumber.length !== 3) {
    return { error: "နံပါတ် 3 လုံးစာ ရိုက်ထည့်ပါ", numbers: selectedNumbers };
  }
  const formatted = manualNumber.padStart(3, "0");
  if (selectedNumbers.includes(formatted)) {
    return { error: "ဤနံပါတ်ကို ရွေးချယ်ပြီးသားဖြစ်သည်", numbers: selectedNumbers };
  }
  return { error: null, numbers: [...selectedNumbers, formatted] };
};

// Make all unique permutations for a 3-digit string
export const generatePermutations = (digits) => {
  if (digits.length !== 3) return [];
  const chars = digits.split("");
  const perms = new Set();
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      for (let k = 0; k < chars.length; k++) {
        perms.add(chars[i] + chars[j] + chars[k]);
      }
    }
  }
  return Array.from(perms).sort();
};

// Round (R): expand all selected numbers into their permutations
export const roundNumbers = (selectedNumbers) => {
  if (selectedNumbers.length === 0) return [];
  const all = new Set();
  selectedNumbers.forEach((n) => generatePermutations(n).forEach((p) => all.add(p)));
  return Array.from(all);
};

// Utility to clear quickly
export const clearNumbers = () => [];

// Produce a summary string for bet confirmation (reuse for both buttons)
export const formatBetSummary = (numbers, amount) =>
  `ရွေးချယ်ထားသောနံပါတ်များ: ${numbers.join(", ")}\nလောင်းကြေး: ${amount} ကျပ်`;

// Hundred range options (UI data)
export const HUNDRED_RANGE_OPTIONS = [
  { value: 0, label: "000 မှစ၍" },
  { value: 1, label: "100 မှစ၍" },
  { value: 2, label: "200 မှစ၍" },
  { value: 3, label: "300 မှစ၍" },
  { value: 4, label: "400 မှစ၍" },
  { value: 5, label: "500 မှစ၍" },
  { value: 6, label: "600 မှစ၍" },
  { value: 7, label: "700 မှစ၍" },
  { value: 8, label: "800 မှစ၍" },
  { value: 9, label: "900 မှစ၍" },
];
