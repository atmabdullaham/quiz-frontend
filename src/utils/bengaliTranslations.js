// Bengali translations for common fields

export const classToBengali = (className) => {
  const classMap = {
    "4": "চতুর্থ শ্রেণি",
    "5": "পঞ্চম শ্রেণি",
    "6": "ষষ্ঠ শ্রেণি",
    "7": "সপ্তম শ্রেণি",
    "8": "অষ্টম শ্রেণি",
    "9": "নবম শ্রেণি",
    "10": "দশম শ্রেণি",
    "11": "একাদশ শ্রেণি",
    "12": "দ্বাদশ শ্রেণি",
  };
  return classMap[String(className)] || className;
};

// Convert English numerals to Bengali numerals
export const englishToBengaliNumerals = (str) => {
  if (!str) return "—";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(str).replace(/\d/g, (digit) => bengaliDigits[digit]);
};
