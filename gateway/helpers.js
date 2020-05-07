import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getUser = (token) => jwt.verify(token, process.env.JWT_SECRET);
export { getUser };
