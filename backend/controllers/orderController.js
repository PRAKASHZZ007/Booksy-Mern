import Order from "../models/Order.js";

// CREATE
export const createOrder = async (req, res) => {
  try {
    const { items, userDetails } = req.body;

    // ✅ calculate total in backend
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      userDetails,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (SECURE)
export const deleteOrder = async (req, res) => {
  try {
    await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};