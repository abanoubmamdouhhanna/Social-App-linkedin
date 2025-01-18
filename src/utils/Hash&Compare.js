import bcrypt from "bcryptjs";

export const Hash = ({
  plainText = "",
  saltRound = process.env.SALT_ROUND,
} = {}) => {
  const hashResult = bcrypt.hashSync(plainText, parseInt(saltRound));
  return hashResult;
};

export const compare = ({ plainText = "", hashValue } = {}) => {
  const match = bcrypt.compareSync(plainText, hashValue);
  return match;
};
