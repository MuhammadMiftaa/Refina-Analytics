// Import env first to validate all environment variables at startup
import env from "./env";
import express, { Request, Response } from "express";
import logger from "./logger";
import middleware from "./middleware";
import route from "./route";
import { connect } from "mongoose";

connect(env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.requestLogger);

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use("/analytics", route);

app.use(middleware.notFoundHandler);
app.use(middleware.errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server started on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Log level: ${env.LOG_LEVEL}`);
});

export default app;
