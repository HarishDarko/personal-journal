const Journal = require('../models/Journal');

// @desc    Get all journal entries for a user with search and filtering
// @route   GET /api/journal
// @access  Private
exports.getJournalEntries = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.id;

    // Build query
    const query = { userId };

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Filter by mood
    if (req.query.mood && req.query.mood !== 'all') {
      query.mood = req.query.mood;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};

      // Log the raw date strings from the request for debugging
      console.log('Raw date strings from request:', {
        startDate: req.query.startDate || 'not provided',
        endDate: req.query.endDate || 'not provided'
      });

      // Handle start date
      if (req.query.startDate) {
        try {
          // Create a date object at the beginning of the day (00:00:00) in local time
          const startDate = new Date(req.query.startDate);
          startDate.setHours(0, 0, 0, 0);
          query.createdAt.$gte = startDate;
          console.log(`Start date parsed: ${startDate.toISOString()}`);
        } catch (error) {
          console.error('Error parsing start date:', error);
        }
      }

      // Handle end date
      if (req.query.endDate) {
        try {
          // Create a date object at the end of the day (23:59:59.999) in local time
          const endDate = new Date(req.query.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endDate;
          console.log(`End date parsed: ${endDate.toISOString()}`);
        } catch (error) {
          console.error('Error parsing end date:', error);
        }
      }

      console.log('Date range query:', {
        startDate: query.createdAt.$gte ? query.createdAt.$gte.toISOString() : 'not set',
        endDate: query.createdAt.$lte ? query.createdAt.$lte.toISOString() : 'not set'
      });
    }

    // Filter by tags
    if (req.query.tags) {
      const tagsArray = req.query.tags.split(',');
      query.tags = { $in: tagsArray };
    }

    // Execute query with sorting
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    console.log('Final query:', JSON.stringify(query, null, 2));
    console.log('Sort:', JSON.stringify(sort, null, 2));

    // Log the raw date strings from the request for debugging
    if (req.query.startDate || req.query.endDate) {
      console.log('Raw date strings from request:', {
        startDate: req.query.startDate || 'not provided',
        endDate: req.query.endDate || 'not provided'
      });
    }

    const entries = await Journal.find(query).sort(sort);

    console.log(`Found ${entries.length} entries`);
    if (entries.length > 0) {
      console.log('Sample entry dates:', entries.slice(0, 3).map(e => new Date(e.createdAt).toISOString()));
    } else {
      console.log('No entries found matching the query criteria');
    }

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
exports.getJournalEntry = async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Check if the entry belongs to the authenticated user
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this journal entry'
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
exports.createJournalEntry = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.userId = req.user.id;

    const entry = await Journal.create(req.body);

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
exports.updateJournalEntry = async (req, res) => {
  try {
    let entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Check if the entry belongs to the authenticated user
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this journal entry'
      });
    }

    // Prevent user from changing the userId
    if (req.body.userId && req.body.userId !== req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot change the owner of a journal entry'
      });
    }

    entry = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
exports.deleteJournalEntry = async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Check if the entry belongs to the authenticated user
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this journal entry'
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
