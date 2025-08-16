import User from '../models/User.js';

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
};

export const updateMe = async (req, res) => {
  const { name, email, phone } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true, runValidators: true }
  ).select('-passwordHash');
  res.json(updated);
};
