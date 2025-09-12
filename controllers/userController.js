const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const db= require('../db');

//Register user

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length > 0) return res.status(409).json({ message: 'Email already exists' });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hash], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
};


// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!match) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email },
              "mySuperSecretKey123",
                { expiresIn: '7d' }
            );

            res.json({ message: 'Login successful', token });
        });
    });
};


// Get logged-in user's profile
exports.getProfile = (req, res) => {
    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};

// Get all users
exports.getAllUsers = (req, res) => {
    const query = 'SELECT id, name, email FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};