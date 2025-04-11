const List = require('../models/listModel');
const User = require('../models/userModel');
const Movie = require('../models/movieModel');

// Create a custom list
exports.createList = async (req, res) => {
  try {
    const { name, description, movies } = req.body;

    // Ensure movies exist
    const existingMovies = await Movie.find({ _id: { $in: movies } });
    if (existingMovies.length !== movies.length) {
      return res.status(404).json({ message: 'Some movies not found' });
    }

    const newList = new List({
      name,
      description,
      user: req.user.id,
      movies,
    });

    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ message: 'Error creating list', error: error.message });
  }
};

// Share a list with another user
exports.shareList = async (req, res) => {
  try {
    const { listId, userId } = req.body;
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if the current user is the owner of the list
    if (list.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to share this list' });
    }

    if (!list.sharedWith.includes(userId)) {
      list.sharedWith.push(userId);
      await list.save();
    }

    res.status(200).json({ message: 'List shared successfully', list });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing list', error: error.message });
  }
};

// Follow a custom list
exports.followList = async (req, res) => {
  try {
    const { listId } = req.body;
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if the user is already following the list
    if (!list.followers.includes(req.user.id)) {
      list.followers.push(req.user.id);
      await list.save();
    }

    res.status(200).json({ message: 'List followed successfully', list });
  } catch (error) {
    res.status(500).json({ message: 'Error following list', error: error.message });
  }
};

// Get a list by ID
exports.getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate('movies').populate('user', 'name').populate('sharedWith', 'name').populate('followers', 'name');

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching list', error: error.message });
  }
};

// Get lists followed by the user
exports.getFollowedLists = async (req, res) => {
  try {
    const lists = await List.find({ followers: req.user.id }).populate('user', 'name').populate('movies');

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followed lists', error: error.message });
  }
};
// Delete a list
exports.deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Check if the current user is the owner of the list
    if (list.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this list' });
    }

    // Delete the list using deleteOne or findByIdAndDelete
    await List.findByIdAndDelete(req.params.id); // Or use `await list.deleteOne();`

    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting list', error: error.message });
  }
};
