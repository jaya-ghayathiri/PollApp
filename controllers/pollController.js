const Poll = require('../models/pollModel');

const createPoll = async (req, res) => {
  const { question, options,createdBy } = req.body;

  if (!question || !options || options.length < 2 || options.length > 4) {
    return res.status(400).json({ msg: "Provide a question and 2-4 options" });
  }

  try {
    const poll = await Poll.create({
      question,
      options,
      createdBy
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('createdBy', 'email');
    res.json(polls);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getPollById = async (req, res) => {
  console.log("Incoming poll ID:", req.params.id).populate('createdBy', 'email');
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });
    res.json({ msg: 'Poll deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
// PATCH /polls/:id   – update question and / or options
const updatePoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    // --- basic validation --------------------------------------------
    if (!question || !question.trim())
      return res.status(400).json({ msg: 'Question is required' });

    if (!Array.isArray(options) || options.length < 2 || options.length > 4)
      return res
        .status(400)
        .json({ msg: 'Provide between 2 and 4 options' });

    // normalise option objects
    const formattedOpts = options.map((o) => ({
      // keep the existing _id if one is provided – votes stay intact
      _id: o._id,
      text: o.text.trim(),
      votes: o.votes ?? 0,
    }));

    const updated = await Poll.findByIdAndUpdate(
      req.params.id,
      { question: question.trim(), options: formattedOpts },
      { new: true, runValidators: true },
    ).populate('createdBy', 'email');

    if (!updated) return res.status(404).json({ msg: 'Poll not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;

    const poll = await Poll.findOneAndUpdate(
      { _id: req.params.id, 'options._id': optionId },
      { $inc: { 'options.$.votes': 1 } },
      { new: true }
    ).populate('createdBy', 'email');

    if (!poll) return res.status(404).json({ msg: 'Poll or option not found' });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  deletePoll,
  updatePoll,
  votePoll
};
