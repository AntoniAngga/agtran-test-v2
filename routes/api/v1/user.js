const express = require('express');
const router = express.Router();

const users = require('../../../controller/user.controller.js');
const auth = require('../../../middleware/check_auth.js');

//create User
router.post('/', users.create);

// get All User
router.get('/', auth.check_token, users.findAll);

// get UserById
router.get('/:userId', auth.check_token, users.findOne);

// Update User with userId
router.put('/:userId', auth.check_token, users.update);

// delete User with userId
router.delete('/:userId', auth.check_token, users.delete);

module.exports = router;
