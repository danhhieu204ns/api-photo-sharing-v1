const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

/**
 * Get list of users for sidebar navigation
 * Returns only the essential info needed for the sidebar (_id, first_name, last_name)
 * GET /api/user/list
 */
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}).select("_id first_name last_name");
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ 
      message: "Error fetching users list", 
      error: error.message 
    });
  }
});

/**
 * Get detailed information of a specific user by ID
 * Returns detailed user information (_id, first_name, last_name, location, description, occupation)
 * GET /api/user/:id
 */
router.get("/:id", async (request, response) => {
  try {
    // Check if the provided ID is valid MongoDB ID
    if (!request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ 
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(request.params.id)
      .select("_id first_name last_name location description occupation");
    
    if (!user) {
      return response.status(400).json({ 
        message: "User not found" 
      });
    }
    
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ 
      message: "Error fetching user details", 
      error: error.message 
    });
  }
});

/**
 * Default route to get all users (for testing purposes)
 * GET /api/user/
 */
router.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ 
      message: "Error fetching all users", 
      error: error.message 
    });
  }
});

module.exports = router;