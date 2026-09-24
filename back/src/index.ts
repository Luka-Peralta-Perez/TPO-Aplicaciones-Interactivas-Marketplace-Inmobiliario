import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Fuente de datos inicializada");
    app.listen(port, () => {
      console.log(`API ejecutándose en http://localhost:${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Error al inicializar la fuente de datos", error);
    process.exit(1);
  });

export { app };
