const { MarketplaceItem, User, Notification } = require('../models');

exports.listItems = async (req, res) => {
  const items = await MarketplaceItem.findAll({
    include: [
      { model: User, as: 'owner', attributes: ['id', 'username'] },
      { model: User, as: 'claimedBy', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(items);
};

exports.createItem = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required.' });
  const { type, title, description, item_condition } = req.body;
  if (!type || !title || !description || !item_condition) return res.status(400).json({ error: 'All fields required.' });
  try {
    const item = await MarketplaceItem.create({
      type, title, description, item_condition, ownerId: req.session.userId, status: 'available',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list item.' });
  }
};

exports.claimItem = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required.' });
  const { id } = req.params;
  const { contact } = req.body;
  if (!contact) return res.status(400).json({ error: 'Contact required.' });
  try {
    const item = await MarketplaceItem.findByPk(id);
    if (!item || item.status !== 'available') return res.status(404).json({ error: 'Item not available.' });
    item.status = 'claimed';
    item.claimedById = req.session.userId;
    item.claimedContact = contact;
    await item.save();
    // Notify owner
    await Notification.create({
      userId: item.ownerId,
      message: `Your item "${item.title}" was claimed. Contact: ${contact}`,
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to claim item.' });
  }
};

exports.getNotifications = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Login required.' });
  const notes = await Notification.findAll({
    where: { userId: req.session.userId },
    order: [['createdAt', 'DESC']],
  });
  res.json(notes);
};
