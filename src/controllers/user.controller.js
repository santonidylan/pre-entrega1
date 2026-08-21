const userService = require('../services/user.service');

class UserController {
  async list(req, res, next) {
    try {
      const users = await userService.listUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getUser(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
