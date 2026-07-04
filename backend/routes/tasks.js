const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const Task = require('../models/Task');

// Helper to check user access to the board
async function checkBoardAccess(boardId, userId) {
  const board = await Board.findById(boardId);
  if (!board) return null;
  const isOwner = board.owner.toString() === userId;
  const isMember = board.members.some(member => member.toString() === userId);
  return isOwner || isMember ? board : null;
}

// @route   GET api/tasks/board/:boardId
// @desc    Get all tasks for a board
// @access  Private
router.get('/board/:boardId', auth, async (req, res) => {
  try {
    const access = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!access) {
      return res.status(401).json({ msg: 'Not authorized or board not found' });
    }

    const tasks = await Task.find({ boardId: req.params.boardId })
      .populate('assignedTo', 'name email')
      .sort({ order: 1, createdAt: 1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, status, boardId, assignedTo, priority, dueDate } = req.body;

  try {
    if (!title || !boardId) {
      return res.status(400).json({ msg: 'Title and Board ID are required' });
    }

    const access = await checkBoardAccess(boardId, req.user.id);
    if (!access) {
      return res.status(401).json({ msg: 'Not authorized or board not found' });
    }

    // Get order for new task (max order + 1 in that column)
    const count = await Task.countDocuments({ boardId, status: status || 'To-Do' });

    const newTask = new Task({
      title,
      description: description || '',
      status: status || 'To-Do',
      boardId,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      order: count,
    });

    const task = await newTask.save();
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task (supports detail updates & drag and drop movement)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, status, assignedTo, priority, dueDate, order } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check board access
    const access = await checkBoardAccess(task.boardId, req.user.id);
    if (!access) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (status !== undefined) updatedFields.status = status;
    if (assignedTo !== undefined) updatedFields.assignedTo = assignedTo;
    if (priority !== undefined) updatedFields.priority = priority;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate;
    if (order !== undefined) updatedFields.order = order;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const access = await checkBoardAccess(task.boardId, req.user.id);
    if (!access) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
