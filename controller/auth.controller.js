require('dotenv').config();
const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const saltRounds = process.env.PASSWORD_SALT;
const secretJwt = process.env.SECRET_TOKEN;
const jwt = require('jsonwebtoken');

// Change Password Step
exports.change_password = async (req, res) => {
  const input = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const match = await bcrypt.compare(input.old_password, user.password);
      if (match) {
        const salt = bcrypt.genSaltSync(Number(saltRounds));
        const hash = bcrypt.hashSync(input.new_password, salt);
        const data = await User.update(
          {
            password: hash,
          },
          {
            where: {
              id: user.id,
            },
            returning: true,
          }
        );
        res.status(200).json({
          messages: 'Change password Done',
          result: data[1][0],
        });
      } else {
        res.status(403).json({
          messages: 'Error: Change Password',
          result: 'The Password is not Match',
        });
      }
    } else {
      res.status(404).json({
        messages: 'Error: Change Password Users',
        result: 'User not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      messages: 'Error: Change Password',
      result: err,
    });
  }
};

exports.login = async (req, res) => {
  const input = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: input.email,
      },
    });
    if (user) {
      const match = await bcrypt.compareSync(input.password, user.password);
      if (match) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            gender: user.gender,
          },
          secretJwt,
          { expiresIn: '4h' }
        );

        res.status(200).json({
          messages: 'Login Completed',
          result: token,
        });
      } else {
        res.status(401).json({
          messages: 'Error: Login sessions',
          result: 'Unauthorized, or Password is not match',
        });
      }
    } else {
      res.status(404).json({
        messages: 'Error: Login Sessions',
        result: 'User not found, or Email Not Registered',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messages: 'Error: Login Sessions',
      result: err,
    });
  }
};

exports.logout = (req, res) => {};
