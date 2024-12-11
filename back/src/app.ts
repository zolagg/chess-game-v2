import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from 'cors';

import { RegisterRoutes } from "./routes/index"; // tsoa va générer ce fichier
import errorHandler from "./middlewares/errorHandler";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(cors({
  origin: 'http://localhost:5173', // Your Vue.js dev server
  credentials: true
}));

RegisterRoutes(app);

app.use(errorHandler);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    details: err.details || 'No additional details'
  });

  // Send appropriate error response
  res.status(err.status || 500).json({
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
