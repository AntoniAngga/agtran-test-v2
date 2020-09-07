require('dotenv').config();
const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const saltRounds = process.env.PASSWORD_SALT;
const redis = require('../utils/redis');

exports.findAll = async (_req, res, next) => {
  try {
    const userCache = await redis.client.get('userCache');
    if (userCache != null) {
      res.status(200).json({
        messages: 'Complete Get Users',
        result: JSON.parse(userCache),
      });
    } else {
      const users = await User.findAll({});
      await redis.client.set(
        'userCache',
        JSON.stringify(users),
        'EX',
        60 * 60 * 6
      );
      res.status(200).json({
        messages: 'Complete Get Users',
        result: users,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const hash = bcrypt.hashSync(data.password, parseInt(saltRounds));

    const users = await User.create({ ...data, password: hash });
    res.status(200).json({
      messages: 'Complete Created User',
      result: `Complete Created User with User Id ${users.id}`,
    });
  } catch (err) {
    res.status(500).json({
      messages: 'Error: Create Users',
      result: err,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user) {
      res.status(200).json({
        messages: 'Complete Get User',
        result: user,
      });
    } else {
      res.status(404).json({
        messages: 'Error: Get User',
        result: 'User Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      messages: 'Error: Get User',
      result: err,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.update(data, {
      where: {
        id: req.params.userId,
      },
      returning: true,
    });
    if (user[0] != 0) {
      res.status(200).json({
        messages: 'User Updated',
        result: user[1][0],
      });
    } else {
      res.status(404).json({
        messages: 'Error: Update User',
        result: 'User Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      messages: 'Error: Update User',
      result: err,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await User.destroy({
      where: {
        id: req.params.userId,
      },
    });
    if (user != 0) {
      res.status(200).json({
        messages: 'User Deleted',
        result: user,
      });
    } else {
      res.status(404).json({
        messages: 'User Not Found',
        result: user,
      });
    }
  } catch (err) {
    res.status(500).json({
      messages: 'Error: Deleted User',
      result: err,
    });
  }
};
