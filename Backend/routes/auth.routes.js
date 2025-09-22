import express from "express";
import { logIn, logOut, singUp } from "../controllers/auth.controller.js";
import userRouter from "./user.routes.js";

const authRouter = express.Router();

authRouter.post("/signup", singUp);
authRouter.post("/signin", logIn);
authRouter.get("/logout", logOut);

export default authRouter;
