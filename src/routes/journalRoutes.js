const express = require('express');
const router = express.Router();
const {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

// All journal routes are protected
router.use(protect);

// Routes for /api/journal
router
  .route('/')
  .get(getJournalEntries)
  .post(createJournalEntry);

// Routes for /api/journal/:id
router
  .route('/:id')
  .get(getJournalEntry)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

module.exports = router;
