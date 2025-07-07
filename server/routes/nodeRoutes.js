const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

router.get('/', nodeController.getNodes);
router.post('/', nodeController.createNode);
router.delete('/:name', nodeController.deleteNode);

module.exports = router;
