import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import workflowRouter from "./routes/workflow.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json()); // this allows your app to handle JSON data in the request body, which is common in RESTful APIs.
app.use(express.urlencoded({ extended: true })); // this allows your app to handle URL-encoded data, which is often used in form submissions.
app.use(cookieParser()); // this allows your app to parse cookies from the request headers, which is useful for handling sessions and authentication.
app.use(arcjetMiddleware); // this allows your app to use Arcjet's middleware for security and bot protection.

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);


app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.send("Welcome to the subscription tracker API");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectToDatabase();
});

export default app;
