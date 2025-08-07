declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

import express from "express";
import userRouter from "./routes/userRouter";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors())
app.use("/api/v1/user", userRouter);

app.listen(3001);