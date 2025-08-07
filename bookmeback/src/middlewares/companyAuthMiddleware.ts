import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const companyAuthMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ") || !authHeader) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("company_token:", token);

  try {
    const { companyId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      companyId: string;
    };
    console.log("middleware-companysueirhisuhyusrt", companyId);

    (req as any).companyId = companyId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};
