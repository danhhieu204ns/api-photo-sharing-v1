const express = require("express");
const User = require("../db/userModel");
const isAuthenticated = require("../middleware/authentication");
const router = express.Router();


router.get("/list", isAuthenticated, async (request, response) => {
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


router.get("/:id", isAuthenticated, async (request, response) => {
  try {
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

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  if (!username) {
    return response.status(400).json({ 
      message: "Username is required" 
    });
  }

  if (!password) {
    return response.status(400).json({
      message: "Password is required" 
    });
  }

  try {
    const user = await User.findOne({ username: username })

    if (!user) {
      return response.status(400).json({ 
        message: "User not found" 
      });
    }

    if (user.password !== password) {
      return response.status(400).json({
        message: "Invalid credentials" 
      });
    }

    request.session.user = {
      _id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name
    };

    response.status(200).json(user);
  }

  catch (error) {
    response.status(500).json({ 
      message: "Error logging in", 
      error: error.message 
    });
  }
})

router.post("/logout", (request, response) => {
  if (!request.session.user) {
    response.status(400).json({ 
      message: "No user is logged in" 
    });
  }
  
  request.session.user = null;
  response.status(200).json({ 
    message: "User logged out successfully" 
  });
})

router.post("/register", async (request, response) => {
  const { first_name, last_name, location, description, occupation, username, password } = request.body;

  if (!username) {
    return response.status(400).json({ 
      message: "Username is required" 
    });
  }
  if (!password) {
    return response.status(400).json({ 
      message: "Password is required" 
    });
  }
  if (!first_name) {
    return response.status(400).json({ 
      message: "First name is required" 
    });
  }
  if (!last_name) {
    return response.status(400).json({ 
      message: "Last name is required" 
    });
  }
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return response.status(400).json({ 
        message: "Username already exists" 
      });
    }
    const newUser = new User({
      _id: new Date().getTime().toString(),
      first_name,
      last_name,
      location,
      description,
      occupation,
      username,
      password
    });
    await newUser.save();
    request.session.user = {
      _id: newUser._id,
      username: newUser.username,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    };
    response.status(201).json(newUser);
  } catch (error) {
    response.status(500).json({ 
      message: "Error registering user", 
      error: error.message 
    });
  }
});

module.exports = router;