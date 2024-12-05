const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create and save user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    // Handle specific errors
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ error: `The ${field} is already taken.` });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.changepw = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check for required fields
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Generated hashed password:", hashedPassword); // Log the hashed password

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    // Confirm that the password is updated in the database
    const updatedUser = await User.findOne({ email });
    console.log("Updated user password:", updatedUser.password); // Log the saved password in the DB

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({
      error:
        "An error occurred while updating the password. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email Anda belum terdaftar" });
    }

    // Compare the password
    const pwIsMatch = await bcrypt.compare(password, user.password);

    // Log the comparison result for debugging
    console.log("Password comparison result:", pwIsMatch);

    if (!pwIsMatch) {
      return res.status(400).json({ error: "Kata sandi Anda salah" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(400).json({
      error: "An error occurred while logging in. Please try again later.",
    });
  }
};

const bcryptTest = async () => {
  const plainPassword = "123456"; // Plain password for comparison
  const hashedPassword =
    "$2b$10$q..T99wVpsJCrrE2DFKcoe6hnWupo1RHRHkUfPY5zt5M7Kg7FtyZS"; // Hash from DB

  // Manually hash the password and compare with the stored hash
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Manual password comparison result:", match); // Should log 'true' if everything works
};

bcryptTest();
