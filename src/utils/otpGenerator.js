import otpGenerator from "otp-generator";
export const otp = () => {
  return otpGenerator.generate(process.env.OTP_LENGTH, {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: false,
  });
};
