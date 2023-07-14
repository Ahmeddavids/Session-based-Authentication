const express = require('express');

const router = express.Router();
const recordController = require('../controllers/recordController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/records', authMiddleware.isLoggedIn, recordController.createRecord);
router.get('/all-records', recordController.readAllRecords);
router.get('/user-records', authMiddleware.isLoggedIn, recordController.allRecordsOfSpecificUser);
router.get('/user-records/:id', authMiddleware.isLoggedIn, recordController.readOneRecord);
router.patch('/user-records/:id', authMiddleware.isLoggedIn, recordController.updateRecord);
router.delete('/user-records/:id', authMiddleware.isLoggedIn, recordController.deleteRecord);





module.exports = router