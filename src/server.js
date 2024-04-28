require("express-async-errors");
const express = require("express");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const migrationsRum = require("./database/sqlite/migrations");
const uploadConfig = require("./configs/upload");
const cors = require("cors");

migrationsRum();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    // Se for um erro conhecido (AppError), retorne uma resposta com o status e mensagem adequados
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  } else {
    // Se for um erro interno não tratado, retorne uma resposta com o status 500 e uma mensagem genérica
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
