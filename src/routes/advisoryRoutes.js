const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', advisoryController.getAdvisory);
router.get('/settings', advisoryController.getSettings);
router.put('/settings', advisoryController.updateSettings);

module.exports = router;
