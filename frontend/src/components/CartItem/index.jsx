import { FaTrash } from "react-icons/fa";

import "./index.css";

const CartItem = ({ cartItemDetails, refreshCart }) => {
  const {
    title,
    subtitle,
    image,
    price,
    quantity,
    bookId,
  } = cartItemDetails;

  const token = localStorage.getItem("token");

const increase = async () => {
  await fetch("http://localhost:5000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookId,
      title,
      subtitle,
      price,
      image,
    }),
  });

  refreshCart();
};

const decrease = async () => {
  await fetch(`http://localhost:5000/api/cart/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "dec" }),
  });

  refreshCart();
};

  const remove = async () => {
    await fetch(`http://localhost:5000/api/cart/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    refreshCart();
  };

  return (
    <div className="cart-item-container">
      <img
        src={image || "https://via.placeholder.com/150"}
        alt={title}
        className="book-image"
      />

      <div className="product-info-container">
        <h1 className="book-title">{title}</h1>
        <p className="book-subtitle">{subtitle}</p>
        <h1 className="book-price">₹ {price}</h1>
      </div>

      <div className="product-actions-container">
        <button className="quantity-btn" onClick={decrease}>-</button>
        <p className="quantity-text">{quantity}</p>
        <button className="quantity-btn" onClick={increase}>+</button>

        <button className="delete-button" onClick={remove}>
          <FaTrash />
        </button>
      </div>

      <div className="amount-container">
        <h1 className="book-price">₹ {price * quantity}</h1>
      </div>
    </div>
  );
};

export default CartItem;