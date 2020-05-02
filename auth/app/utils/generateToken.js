import jwt from "jsonwebtoken";

export default async (payload) =>
  await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2 days" });
