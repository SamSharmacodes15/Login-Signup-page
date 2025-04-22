// server.js
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const User = require('../mongodb'); // Import the User model

const app = express();
const PORT = 3000;

// Paths
const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // To handle form submissions
app.use(express.static(publicPath)); // To serve static files (CSS, JS, images)

// View Engine Setup
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Routes
app.get('/', (req, res) => {
  res.render('login'); // Renders login.hbs
});

app.get('/signup', (req, res) => {
  res.render('signup'); // Renders signup.hbs
});

app.get('/home', (req, res) => {
  res.render('home'); // Renders home.hbs after successful login
});

// POST Routes for Signup
app.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('Email already registered.');
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    // Redirect to login page after successful signup
    res.redirect('/');
  } catch (err) {
    res.send('Error during signup: ' + err.message);
  }
});

// POST Routes for Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.send('User not found.');
    }

    if (user.password !== password) {
      return res.send('Incorrect password.');
    }

    // If login is successful, redirect to home page
    res.redirect('/home');
  } catch (err) {
    res.send('Error during login: ' + err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
