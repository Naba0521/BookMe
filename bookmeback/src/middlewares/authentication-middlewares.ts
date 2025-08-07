import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    console.log(process.env.JWT_SECRET);
    console.log("hi1");

    const { userId } = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    console.log("hi2");

    (req as any).userId = userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};
