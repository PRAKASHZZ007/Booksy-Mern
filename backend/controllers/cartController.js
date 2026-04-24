import Cart from "../models/Cart.js";

// GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
  { user: req.user.id },
  { $setOnInsert: { items: [] } },
  { returnDocument: "after", upsert: true }
);

    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD
export const addToCart = async (req, res) => {
  try {
    const { bookId, title, subtitle, price, image } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Invalid bookId" });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    const itemIndex = cart.items.findIndex(
      (item) => item.bookId === bookId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        bookId,
        title,
        subtitle,
        price,
        image,
        quantity: 1,
      });
    }

    await cart.save();

    res.json({ message: "Item added", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateQty = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { action } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find((i) => i.bookId === bookId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (action === "inc") item.quantity += 1;

    if (action === "dec") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items = cart.items.filter(i => i.bookId !== bookId);
      }
    }

    await cart.save();

    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteItem = async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter((i) => i.bookId !== bookId);

    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLEAR
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );

    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};