import { Router } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "../middleware/middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";

const userRouter: Router = Router();

userRouter.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  try {
    if (!data.success) {
      console.log(data.error);
      return res.status(400).json({ message: "Incorrect Input" });
    }
    const { name, email, password } = data.data;

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 3);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPwd,
      },
    });

    return res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Server Error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  try {
    if (!data.success) {
      return res.status(400).json({ message: "Incorrect Input" });
    }
    const { email, password } = req.body;
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      res.json({ message: "Invalid User" });
      return;
    }

    const pwdCheck = await bcrypt.compare(password, existingUser.password);
    if (!pwdCheck) return res.status(401).json({ message: "Invalid password" });
    const userId = existingUser.id;

    const token = jwt.sign({ userId }, JWT_SECRET as string);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Server Error",
    });
  }
});

userRouter.post("/room", middleware, async (req, res) => {
  const userId = req.userId;
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect Input" });
  }
  try {
    const newRoom = prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: String(userId),
      },
    });
    const roomId = (await newRoom).id;

    res.json({
      roomId: roomId,
    });
  } catch (error) {
    res.status(411).json({
      message: "Room already exits with this name",
    });
  }
});

userRouter.get("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const userId = String(req.userId);

  try {
    const chats = await prismaClient.element.findMany({
      where: {
        roomId: roomId,
        userId: userId,
      },
      orderBy: {
        id: "desc",
      },
    });
    // take: 50,
    res.json({
      chats,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Server Error",
    });
  }
});

userRouter.get("/room/:slug", middleware, async (req, res) => {
  const slug = req.params.slug;

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        slug: slug,
      },
    });

    res.json({
      room,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Server Error",
    });
  }
});

export default userRouter;
