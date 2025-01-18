import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signature = process.env.SIGNATURE,
} = {}) => {
  const authorization = jwt.sign(payload, signature);
  return authorization;
};

export const verifyToken = ({
  payload,
  signature = process.env.SIGNATURE,
} = {}) => {
  const decoded = jwt.verify(payload, signature);
  return decoded;
};
