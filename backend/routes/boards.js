const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const Task = require('../models/Task');

// @route   GET api/boards
// @desc    Get all boards for user (owned or member)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/boards/:id
// @desc    Get board by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Check if user is owner or member
    const isOwner = board.owner._id.toString() === req.user.id;
    const isMember = board.members.some(member => member._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'User not authorized to view this board' });
    }

    res.json(board);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/boards
// @desc    Create a board
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, columns } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }

    const newBoard = new Board({
      title,
      owner: req.user.id,
      columns: columns || ['To-Do', 'Doing', 'Done'],
    });

    const board = await newBoard.save();
    const populatedBoard = await Board.findById(board._id).populate('owner', 'name email');
    res.json(populatedBoard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/boards/:id
// @desc    Update a board (title, columns, members)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, columns, members } = req.body;

  try {
    let board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Only owner can update board settings
    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this board' });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (columns) updatedFields.columns = columns;
    if (members) updatedFields.members = members;

    board = await Board.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    )
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/boards/:id
// @desc    Delete a board and all its tasks
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Only owner can delete board
    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this board' });
    }

    // Delete all tasks associated with this board
    await Task.deleteMany({ boardId: req.params.id });

    // Delete the board itself
    await Board.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Board and all associated tasks deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
