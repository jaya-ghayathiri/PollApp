const express = require('express');
const router = express.Router();
const {
  createPoll,
  getAllPolls,
  getPollById,
  deletePoll,
  updatePoll
} = require('../controllers/pollController');

router.post('/polls', createPoll);        // Create poll
router.get('/polls', getAllPolls);        // Get all polls
router.get('/polls/:id', getPollById);    // Get poll by ID
router.delete('/polls/:id', deletePoll);  // Delete poll by ID
// router.patch('/:id/vote', ctrl.votePoll);   // already present
// router.patch('/:id',       ctrl.updatePoll); // <- add this below the /vote line

module.exports = router;
