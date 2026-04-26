/**
 * Timezone Conversion Utilities
 * Bangladesh Standard Time (BST): UTC+6, No DST
 * Handles all conversions between UTC and Bangladesh time
 */

const BANGLADESH_TIMEZONE_OFFSET = 6; // UTC+6

/**
 * Get current time in Bangladesh timezone
 * @returns {Date} Current time in BD timezone
 */
export const getBangladeshTime = () => {
  const now = new Date();
  const utcTimeInMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const bdTimeInMs = utcTimeInMs + BANGLADESH_TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(bdTimeInMs);
};

/**
 * Convert UTC timestamp to Bangladesh time
 * @param {Date|string} utcDate - UTC date from database
 * @returns {Date} Date object in Bangladesh time
 */
export const convertUTCToBangladesh = (utcDate) => {
  if (!utcDate) return null;
  const date = new Date(utcDate);
  const utcTimeInMs = date.getTime();
  const bdTimeInMs = utcTimeInMs + BANGLADESH_TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(bdTimeInMs);
};

/**
 * Convert Bangladesh time to UTC for database storage
 * @param {Date|string} bdDate - Bangladesh time date
 * @returns {string} ISO 8601 UTC timestamp for database
 */
export const convertBangladeshToUTC = (bdDate) => {
  if (!bdDate) return null;
  const date = new Date(bdDate);
  const bdTimeInMs = date.getTime();
  const utcTimeInMs = bdTimeInMs - BANGLADESH_TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(utcTimeInMs).toISOString();
};

/**
 * Format HTML datetime-local value to UTC ISO string for database
 * HTML datetime-local format: "2024-03-28T14:00"
 * This comes from user in their browser's interpretation of BD time
 * 
 * @param {string} datetimeLocalValue - Value from HTML datetime-local input
 * @returns {string} UTC ISO string for database storage
 */
export const datetimeLocalToUTC = (datetimeLocalValue) => {
  if (!datetimeLocalValue) return null;
  
  // HTML datetime-local is already in the display format
  // We need to interpret it as Bangladesh time and convert to UTC
  const [datePart, timePart] = datetimeLocalValue.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  // Create a date treating the input as Bangladesh time
  // UTC+6 means we subtract 6 hours to get UTC
  const bdDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const bdTimeInMs = bdDate.getTime();
  const utcTimeInMs = bdTimeInMs - BANGLADESH_TIMEZONE_OFFSET * 60 * 60 * 1000;
  
  return new Date(utcTimeInMs).toISOString();
};

/**
 * Convert UTC ISO string to HTML datetime-local format
 * This is used when loading existing dates into the datetime-local input
 * 
 * @param {string} utcIsoString - UTC ISO string from database
 * @returns {string} Format: "YYYY-MM-DDTHH:mm" suitable for datetime-local
 */
export const utcToDatetimeLocal = (utcIsoString) => {
  if (!utcIsoString) return '';
  
  const utcDate = new Date(utcIsoString);
  const bdDate = convertUTCToBangladesh(utcDate);
  
  const year = bdDate.getFullYear();
  const month = String(bdDate.getMonth() + 1).padStart(2, '0');
  const day = String(bdDate.getDate()).padStart(2, '0');
  const hours = String(bdDate.getHours()).padStart(2, '0');
  const minutes = String(bdDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Get quiz status based on Bangladesh time
 * @param {Object} quiz - Quiz object with startDate and endDate (UTC ISO strings)
 * @param {string} quiz.status - Quiz status from DB
 * @param {string} quiz.startDate - UTC ISO string
 * @param {string} quiz.endDate - UTC ISO string
 * @returns {Object} {status, text, color}
 */
export const getQuizStatusBangladesh = (quiz) => {
  const now = getBangladeshTime();
  const start = quiz.startDate ? convertUTCToBangladesh(new Date(quiz.startDate)) : null;
  const end = quiz.endDate ? convertUTCToBangladesh(new Date(quiz.endDate)) : null;

  // Draft quiz
  if (quiz.status === 'draft') {
    return { status: 'draft', text: 'Draft', color: 'badge-warning' };
  }

  // Scheduled - not yet started
  if (quiz.status === 'scheduled' && start && start > now) {
    return { status: 'scheduled', text: 'Upcoming', color: 'badge-info' };
  }

  // Active - between start and end time
  if ((quiz.status === 'scheduled' || quiz.status === 'active') && start && end) {
    if (start <= now && end >= now) {
      return { status: 'active', text: 'Active', color: 'badge-success' };
    }
  }

  // Ended - after end time
  if (end && end < now) {
    return { status: 'ended', text: 'Ended', color: 'badge-error' };
  }

  // Default
  return { status: 'draft', text: 'Draft', color: 'badge-warning' };
};

/**
 * Compare two times in Bangladesh timezone
 * @param {Date|string} time1 - First time (UTC)
 * @param {Date|string} time2 - Second time (UTC)
 * @returns {number} Negative if time1 < time2, zero if equal, positive if time1 > time2
 */
export const compareTimesBangladesh = (time1, time2) => {
  const bd1 = convertUTCToBangladesh(new Date(time1));
  const bd2 = convertUTCToBangladesh(new Date(time2));
  return bd1.getTime() - bd2.getTime();
};

/**
 * Check if two dates are the same day in Bangladesh timezone
 * @param {Date|string} date1 - First date (UTC)
 * @param {Date|string} date2 - Second date (UTC)
 * @returns {boolean} True if same day in BD timezone
 */
export const isSameDayBangladesh = (date1, date2) => {
  const bd1 = convertUTCToBangladesh(new Date(date1));
  const bd2 = convertUTCToBangladesh(new Date(date2));
  
  return (
    bd1.getFullYear() === bd2.getFullYear() &&
    bd1.getMonth() === bd2.getMonth() &&
    bd1.getDate() === bd2.getDate()
  );
};

/**
 * Get time difference in minutes between two times (in BD timezone)
 * @param {Date|string} time1 - First time (UTC)
 * @param {Date|string} time2 - Second time (UTC)
 * @returns {number} Difference in minutes
 */
export const getMinutesDifferenceBangladesh = (time1, time2) => {
  return Math.floor(compareTimesBangladesh(time1, time2) / (1000 * 60));
};

/**
 * Get hours until quiz starts (in BD timezone)
 * @param {string} startDate - UTC ISO string
 * @returns {number} Hours remaining (negative if started)
 */
export const getHoursUntilStart = (startDate) => {
  const now = getBangladeshTime();
  const start = convertUTCToBangladesh(new Date(startDate));
  return (start.getTime() - now.getTime()) / (1000 * 60 * 60);
};

/**
 * Get seconds until quiz ends (in BD timezone)
 * @param {string} endDate - UTC ISO string
 * @returns {number} Seconds remaining (negative if ended)
 */
export const getSecondsUntilEnd = (endDate) => {
  const now = getBangladeshTime();
  const end = convertUTCToBangladesh(new Date(endDate));
  return Math.floor((end.getTime() - now.getTime()) / 1000);
};

export default {
  BANGLADESH_TIMEZONE_OFFSET,
  getBangladeshTime,
  convertUTCToBangladesh,
  convertBangladeshToUTC,
  datetimeLocalToUTC,
  utcToDatetimeLocal,
  getQuizStatusBangladesh,
  compareTimesBangladesh,
  isSameDayBangladesh,
  getMinutesDifferenceBangladesh,
  getHoursUntilStart,
  getSecondsUntilEnd,
};
