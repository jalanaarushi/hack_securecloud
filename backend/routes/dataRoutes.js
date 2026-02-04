const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/', dataController.addData);
router.get('/:id', dataController.getData);

module.exports = router;
