const express = require('express');
const router = express.Router();
const edgeController = require('../controllers/edgeController');

router.get('/', edgeController.getEdges);
router.post('/', edgeController.createEdge);
router.delete('/:from/:to', edgeController.deleteEdge);

module.exports = router;
