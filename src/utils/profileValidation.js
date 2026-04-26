/**
 * Shared validation functions for student profile forms
 * Used in PreQuizForm and StudentDashboard
 */

// Bangladeshi phone format: 01XXXXXXXXX (11 digits)
export const validateBangladeshiPhone = (phone) => {
  const banglaPhoneRegex = /^01[3-9]\d{8}$/;
  return banglaPhoneRegex.test(phone.replace(/\s+/g, ""));
};

// Student name: 2-100 characters
export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// School name: 2-150 characters
export const validateSchool = (school) => {
  return school.trim().length >= 2 && school.trim().length <= 150;
};

// Roll number: numeric only, at least 1 digit
export const validateRollNumber = (roll) => {
  return /^\d+$/.test(roll.trim()) && roll.trim().length > 0;
};

// Address: 10-300 characters
export const validateAddress = (address) => {
  return address.trim().length >= 10 && address.trim().length <= 300;
};

// Validate specific field based on field name
export const validateField = (name, value) => {
  let error = "";

  switch (name) {
    case "studentName":
      if (!value.trim()) {
        error = "নাম আবশ্যক";
      } else if (!validateName(value)) {
        error = "নাম ২-১০০ অক্ষরের মধ্যে হতে হবে";
      }
      break;

    case "mobileNumber":
      if (!value.trim()) {
        error = "মোবাইল নম্বর আবশ্যক";
      } else if (!validateBangladeshiPhone(value)) {
        error = "বৈধ বাংলাদেশি নম্বর নয় (01XXXXXXXXX)";
      }
      break;

    case "schoolName":
      if (!value.trim()) {
        error = "শিক্ষা প্রতিষ্ঠান আবশ্যক";
      } else if (!validateSchool(value)) {
        error = "শিক্ষা প্রতিষ্ঠান ২-১৫০ অক্ষরের মধ্যে হতে হবে";
      }
      break;

    case "className":
      if (!value.trim()) {
        error = "ক্লাস নির্বাচন করুন";
      }
      break;

    case "rollNumber":
      if (!value.trim()) {
        error = "রোল নম্বর আবশ্যক";
      } else if (!validateRollNumber(value)) {
        error = "রোল নম্বর শুধুমাত্র সংখ্যা হবে";
      }
      break;

    case "address":
      if (!value.trim()) {
        error = "ঠিকানা আবশ্যক";
      } else if (!validateAddress(value)) {
        error = "ঠিকানা ১০-৩০০ অক্ষরের মধ্যে হতে হবে";
      }
      break;

    default:
      break;
  }

  return error;
};

// Validate all profile fields at once
export const validateAllProfileFields = (formData) => {
  const newErrors = {};

  newErrors.studentName = validateField("studentName", formData.studentName);
  newErrors.mobileNumber = validateField("mobileNumber", formData.mobileNumber);
  newErrors.schoolName = validateField("schoolName", formData.schoolName);
  newErrors.className = validateField("className", formData.className);
  newErrors.rollNumber = validateField("rollNumber", formData.rollNumber);
  newErrors.address = validateField("address", formData.address);

  return newErrors;
};
