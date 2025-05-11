const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const router = express.Router();

/**
 * Get photos of a specific user by user ID
 * Returns all photos of the user including comments
 * GET /api/photo/:id
 */
router.get("/:id", async (request, response) => {
  try {
    // Check if the provided ID is valid MongoDB ID
    if (!request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ 
        message: "Invalid user ID format" 
      });
    }

    // First check if user exists
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(400).json({ 
        message: "User not found" 
      });
    }

    // Find all photos for this user
    let photos = await Photo.find({ user_id: request.params.id })
      .sort({ date_time: 1 });

    // Process each photo to include user information in comments
    let processedPhotos = await Promise.all(photos.map(async (photo) => {
      // Convert Mongoose document to plain object for manipulation
      const photoObj = photo.toObject();
      
      // Process each comment to include minimal user info
      if (photoObj.comments && photoObj.comments.length > 0) {
        // Get all unique user IDs from comments
        const userIds = [...new Set(photoObj.comments.map(comment => 
          comment.user_id.toString()))];
        
        // Fetch all users in one query
        const users = await User.find({
          '_id': { $in: userIds }
        }).select('_id first_name last_name');
        
        // Create a map for quick user lookup
        const userMap = {};
        users.forEach(user => {
          userMap[user._id.toString()] = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name
          };
        });

        // Modify each comment to include user info
        photoObj.comments = photoObj.comments.map(comment => {
          const user = userMap[comment.user_id.toString()];
          return {
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: user || { _id: comment.user_id, first_name: 'Unknown', last_name: 'User' }
          };
        });
      }
      
      return photoObj;
    }));

    response.status(200).json(processedPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    response.status(500).json({ 
      message: "Error fetching user photos", 
      error: error.message 
    });
  }
});

/**
 * Default route to get all photos (for testing purposes)
 * GET /api/photo/
 */
router.get("/", async (request, response) => {
  try {
    const photos = await Photo.find({});
    response.status(200).json(photos);
  } catch (error) {
    response.status(500).json({ 
      message: "Error fetching all photos", 
      error: error.message 
    });
  }
});

module.exports = router;
