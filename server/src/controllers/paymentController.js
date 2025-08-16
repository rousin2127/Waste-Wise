import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => {
  try {
    const { method, phone, amount } = req.body;
    if (!method || !phone || !amount) return res.status(400).json({ message: 'Missing fields' });

    // TODO: integrate real bKash / Nagad APIs here:
    // 1) Create payment intent
    // 2) Redirect/execute
    // For now we simulate success:
    const payment = await Payment.create({
      user: req.user.id, method, phone, amount, status: 'success'
    });

    res.status(201).json({ message: 'Payment successful', payment });
  } catch (e) {
    res.status(500).json({ message: 'Payment failed', error: e.message });
  }
};
