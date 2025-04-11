const Discussion = require('../models/discussionModel');

// Create a new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, category, relatedId } = req.body;
    const userId = req.user.id;

    const newDiscussion = new Discussion({
      title,
      content,
      category,
      relatedId,
      user: userId
    });

    const savedDiscussion = await newDiscussion.save();
    res.status(201).json(savedDiscussion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating discussion', error: error.message });
  }
};

// Get all discussions
exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('user', 'name').populate('comments.user', 'name');
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions', error: error.message });
  }
};

// Add a comment to a discussion
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const discussionId = req.params.id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = {
      user: req.user.id,
      content
    };

    discussion.comments.push(comment);
    await discussion.save();

    res.status(201).json({ message: 'Comment added', discussion });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};
