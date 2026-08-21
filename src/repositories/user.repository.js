const User = require('../models/user.model');

/**
 * Repository de Users. Único lugar que conoce Mongoose para esta entidad.
 */
class UserRepository {
  async getAll() {
    return User.find().select('-__v').lean();
  }

  async getById(id) {
    return User.findById(id).select('-__v').lean();
  }

  async getByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email });
    if (withPassword) {
      query.select('+password');
    }
    return query;
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async update(id, updates) {
    return User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v');
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
