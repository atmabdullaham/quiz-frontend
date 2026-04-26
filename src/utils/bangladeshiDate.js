/**
 * Bangladeshi Date & Time Formatting Utilities
 * Bangladesh Standard Time (BST): UTC+6, No DST
 */

// Bangla month names
const banglaMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

// English month names (for mixed format)
const englishMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Bangla day names
const banglaDays = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

// Bangla numerals
const banglaNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert English number to Bangla numerals
 * @param {number|string} num - English number
 * @returns {string} Bangla numerals
 */
export const toBanglaNumber = (num) => {
  return String(num)
    .split('')
    .map((digit) => banglaNumerals[parseInt(digit)])
    .join('');
};

/**
 * Format date in Bangladeshi format: DD/MM/YYYY
 * @param {Date|string} date - JavaScript Date object or date string
 * @returns {string} Formatted date (DD/MM/YYYY)
 */
export const formatBangladeshiDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format time in Bangladeshi 24-hour format: HH:MM:SS
 * @param {Date|string} date - JavaScript Date object or date string
 * @param {boolean} seconds - Include seconds
 * @returns {string} Formatted time (HH:MM or HH:MM:SS)
 */
export const formatBangladeshiTime = (date, seconds = false) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (seconds) {
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  }
  return `${hours}:${minutes}`;
};

/**
 * Format date and time together
 * @param {Date|string} date - JavaScript Date object or date string
 * @returns {string} Formatted as "DD/MM/YYYY HH:MM:SS"
 */
export const formatBangladeshiDateTime = (date) => {
  return `${formatBangladeshiDate(date)} ${formatBangladeshiTime(date, true)}`;
};

/**
 * Format date with Bangla month name and day name
 * @param {Date|string} date - JavaScript Date object or date string
 * @param {boolean} useBangla - Use Bangla day and month names
 * @returns {string} Formatted as "DD জানুয়ারি, YYYY বুধবার"
 */
export const formatBangladeshiDateLong = (date, useBangla = true) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const dayOfWeek = d.getDay();

  if (useBangla) {
    return `${day} ${banglaMonths[month]}, ${year} (${banglaDays[dayOfWeek]})`;
  } else {
    return `${day} ${englishMonths[month]}, ${year} (${banglaDays[dayOfWeek]})`;
  }
};

/**
 * Format time taken in seconds to readable format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted as "M মিনিট S সেকেন্ড" or "M minutes S seconds"
 * @param {boolean} useBangla - Use Bangla labels
 */
export const formatTimeTaken = (seconds, useBangla = true) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (useBangla) {
    const minLabel = mins === 1 ? 'মিনিট' : 'মিনিট';
    const secLabel = secs === 1 ? 'সেকেন্ড' : 'সেকেন্ড';
    return `${mins} ${minLabel} ${secs} ${secLabel}`;
  } else {
    const minLabel = mins === 1 ? 'minute' : 'minutes';
    const secLabel = secs === 1 ? 'second' : 'seconds';
    return `${mins} ${minLabel} ${secs} ${secLabel}`;
  }
};

/**
 * Format time as MM:SS for timer display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted as "MM:SS"
 */
export const formatTimerDisplay = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Format time as MM:SS with Bangla numerals
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted as "MM:SS" in Bangla numerals
 */
export const formatTimerDisplayBangla = (seconds) => {
  const display = formatTimerDisplay(seconds);
  return display
    .split('')
    .map((char) => (char === ':' ? ':' : banglaNumerals[parseInt(char)] || char))
    .join('');
};

/**
 * Get current time in Bangladesh (UTC+6)
 * @returns {Date} Current time in Bangladesh timezone
 */
export const getBangladeshiTime = () => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const bangladeshTime = new Date(utcTime + 6 * 60 * 60 * 1000);
  return bangladeshTime;
};

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

/**
 * Get relative time (e.g., "2 hours ago", "আগামীকাল")
 * @param {Date} date
 * @param {boolean} useBangla
 * @returns {string}
 */
export const getRelativeTime = (date, useBangla = true) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (useBangla) {
    if (diffMins < 1) return 'এখনই';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    if (diffDays === 1) return 'গতকাল';
    if (diffDays < 30) return `${diffDays} দিন আগে`;
    return formatBangladeshiDate(date);
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatBangladeshiDate(date);
  }
};

/**
 * Bangla labels for UI elements
 */
export const banglaLabels = {
  // Days
  days: banglaDays,
  
  // Months
  months: banglaMonths,
  
  // Common terms
  today: 'আজ',
  tomorrow: 'আগামীকাল',
  yesterday: 'গতকাল',
  
  // Time related
  submitted: 'জমা দেওয়া হয়েছে',
  created: 'তৈরি করা হয়েছে',
  active: 'সক্রিয়',
  ended: 'শেষ',
  scheduled: 'নির্ধারিত',
  draft: 'খসড়া',
  
  // Quiz related
  score: 'স্কোর',
  correctAnswers: 'সঠিক উত্তর',
  incorrectAnswers: 'ভুল উত্তর',
  timeTaken: 'সময় লাগা',
  quizTitle: 'কুইজের শিরোনাম',
  studentName: 'শিক্ষার্থীর নাম',
  schoolName: 'স্কুলের নাম',
  className: 'ক্লাস',
  rollNumber: 'রোল নম্বর',
  submitted: 'জমা দিয়েছেন',
  
  // Actions
  viewLeaderboard: 'লিডারবোর্ড দেখুন',
  takeQuiz: 'কুইজ নিন',
  submitQuiz: 'কুইজ জমা দিন',
  startQuiz: 'কুইজ শুরু করুন',
};

/**
 * English labels for UI elements (for reference)
 */
export const englishLabels = {
  // Days
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  
  // Months
  months: englishMonths,
  
  // Common terms
  today: 'Today',
  tomorrow: 'Tomorrow',
  yesterday: 'Yesterday',
  
  // Time related
  submitted: 'Submitted',
  created: 'Created',
  active: 'Active',
  ended: 'Ended',
  scheduled: 'Scheduled',
  draft: 'Draft',
  
  // Quiz related
  score: 'Score',
  correctAnswers: 'Correct Answers',
  incorrectAnswers: 'Incorrect Answers',
  timeTaken: 'Time Taken',
  quizTitle: 'Quiz Title',
  studentName: 'Student Name',
  schoolName: 'School Name',
  className: 'Class',
  rollNumber: 'Roll Number',
  
  // Actions
  viewLeaderboard: 'View Leaderboard',
  takeQuiz: 'Take Quiz',
  submitQuiz: 'Submit Quiz',
  startQuiz: 'Start Quiz',
};

export default {
  formatBangladeshiDate,
  formatBangladeshiTime,
  formatBangladeshiDateTime,
  formatBangladeshiDateLong,
  formatTimeTaken,
  formatTimerDisplay,
  formatTimerDisplayBangla,
  toBanglaNumber,
  getBangladeshiTime,
  isSameDay,
  getRelativeTime,
  banglaLabels,
  englishLabels,
};
