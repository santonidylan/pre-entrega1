const userRepository = require('../repositories/user.repository');
const { ROLES } = require('../constants');
const { UserNotFoundError, EmailAlreadyInUseError, InvalidRoleError } = require('../errors');

class UserService {
  async listUsers() {
    return userRepository.getAll();
  }

  async getUser(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new UserNotFoundError({ id });
    }
    return user;
  }

  async createUser(data) {
    const existing = await userRepository.getByEmail(data.email);
    if (existing) {
      throw new EmailAlreadyInUseError({ email: data.email });
    }

    // Validación de permisos / valores de dominio: acá, no en el Repository.
    const role = Object.values(ROLES).includes(data.role) ? data.role : ROLES.USER;

    return userRepository.create({ ...data, role });
  }

  async updateUser(id, updates) {
    // No permitimos que cualquiera se autoasigne un rol inexistente.
    if (updates.role && !Object.values(ROLES).includes(updates.role)) {
      throw new InvalidRoleError({ role: updates.role });
    }

    const user = await userRepository.update(id, updates);
    if (!user) {
      throw new UserNotFoundError({ id });
    }
    return user;
  }

  async deleteUser(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new UserNotFoundError({ id });
    }
    return deleted;
  }
}

module.exports = new UserService();