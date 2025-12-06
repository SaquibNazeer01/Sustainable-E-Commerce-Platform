const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'Username already exists.' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    req.session.userId = user.id;
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out.' });
  });
};
