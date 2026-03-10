const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all transaction routes

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.addTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
