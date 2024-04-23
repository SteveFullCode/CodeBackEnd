/*
    index - GET para listar usuarios registrados.
    show - GET para exibir um registro especifico.
    create - POST para criar um registro.
    update - PUT para atualizar um registro.
    delete - DELETE para remover um registro.
 */
const AppError = require("../utils/AppError");

class UsersController {
  create(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError("Preencha todos os campos");
    }
    res.status(201).json({ name, email, password });
  }
}

module.exports = UsersController;
