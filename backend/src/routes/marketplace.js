const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

router.get('/items', marketplaceController.listItems);
router.post('/items', marketplaceController.createItem);
router.post('/items/:id/claim', marketplaceController.claimItem);
router.get('/notifications', marketplaceController.getNotifications);

module.exports = router;
