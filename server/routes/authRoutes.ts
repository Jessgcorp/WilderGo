import { Router, type Request, type Response } from "express";
import authService from "../services/auth";

const authRoutes = Router();

async function handleEmailPasswordSignIn(req: Request, res: Response) {
  const route = req.path;
  console.log(`[ROUTE ${route}] === Request received ===`);
  console.log(
    `[ROUTE ${route}] Body:`,
    JSON.stringify({ email: req.body?.email, password: "***" }),
  );
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log(`[ROUTE ${route}] REJECTED: Missing email or password`);
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const result = await authService.signIn(email, password);
    console.log(`[ROUTE ${route}] Result:`, JSON.stringify(result));
    return res.json(result);
  } catch (error: any) {
    console.error(`[ROUTE ${route}] UNCAUGHT ERROR:`, error?.message, error?.stack);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
}

authRoutes.post("/login", handleEmailPasswordSignIn);
authRoutes.post("/signin", handleEmailPasswordSignIn);

authRoutes.post("/signup", async (req: Request, res: Response) => {
  console.log(`[ROUTE /api/auth/signup] === Request received ===`);
  console.log(
    `[ROUTE /api/auth/signup] Body:`,
    JSON.stringify({ email: req.body?.email, password: "***" }),
  );
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log(`[ROUTE /api/auth/signup] REJECTED: Missing email or password`);
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const result = await authService.signUp(email, password);
    console.log(`[ROUTE /api/auth/signup] Result:`, JSON.stringify(result));
    return res.json(result);
  } catch (error: any) {
    console.error(
      `[ROUTE /api/auth/signup] UNCAUGHT ERROR:`,
      error?.message,
      error?.stack,
    );
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
});

export default authRoutes;
