/*
    index - GET para listar usuarios registrados.
    show - GET para exibir um registro especifico.
    create - POST para criar um registro.
    update - PUT para atualizar um registro.
    delete - DELETE para remover um registro.
 */
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdateEmail = await database.get(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, user_id]
    );
    if (userWithUpdateEmail) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Precisa informar a senha antiga para redefinir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga está incorreta");
      }
      user.password = await hash(password, 8);
    }

    await database.run(
      `
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?
            `,
      [user.name, user.email, user.password, user_id]
    );

    return res.json();
  }
}

module.exports = UsersController;
