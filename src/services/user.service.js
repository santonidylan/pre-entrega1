const userRepository = require('../repositories/user.repository');
const { ROLES } = require('../constants');

class UserService {
  async listUsers() {
    return userRepository.getAll();
  }

  async getUser(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(data) {
    const existing = await userRepository.getByEmail(data.email);
    if (existing) {
      const error = new Error('Ya existe un usuario con ese email');
      error.statusCode = 409;
      throw error;
    }

    // Validación de permisos / valores de dominio: acá, no en el Repository.
    const role = Object.values(ROLES).includes(data.role) ? data.role : ROLES.USER;

    return userRepository.create({ ...data, role });
  }

  async updateUser(id, updates) {
    // No permitimos que cualquiera se autoasigne ADMIN desde este endpoint.
    if (updates.role && !Object.values(ROLES).includes(updates.role)) {
      const error = new Error('Rol inválido');
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.update(id, updates);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async deleteUser(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new UserService();
