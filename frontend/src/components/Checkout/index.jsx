import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import UserDetailsForm from "../UserDetailsForm";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import "./index.css";
import Header from "../Header";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ LOAD CART
  const fetchCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setCartList(data.cart.items);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ PLACE ORDER
const handleOrderSubmit = async (details) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: cartList,
      userDetails: details,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setCurrentOrder(data);
    setOrderPlaced(true);

    await fetch(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCartList([]);
  }
};

  const renderOrderSummary = () => (
    <div className="summary-container">
      {cartList.map(item => (
        <div key={item.bookId} className="summary-item-container">
          <img className="summary-item-image" src={item.image} alt={item.title} />
          <p>{item.title}</p>
          <p>Qty: {item.quantity}</p>
          <p>₹ {(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <h3>Total: ₹ {total.toFixed(2)}</h3>
    </div>
  );

  return (
    <div className="checkout-page-container">
      <Header/>

      <div className="checkout-form">
        <div className="checkout-content-container">
          <h1 className="checkout-heading">Checkout</h1>

          <Link to="/cart" className="back-button">
            <FaArrowLeft />
          </Link>

          <div className="form-and-summary">
            <UserDetailsForm onSubmit={handleOrderSubmit} />
            {renderOrderSummary()}
          </div>
        </div>
      </div>

      <Dialog open={orderPlaced}>
        <DialogTitle style={{ textAlign: "center" }}>
          <CheckCircleIcon style={{ color: "green", fontSize: 50 }} />
          <h2>Order Placed Successfully!</h2>
        </DialogTitle>

        <DialogContent>
          {currentOrder && (
            <div style={{ textAlign: "center" }}>
              <p>{currentOrder.date}</p>
              <h3>Total: ₹ {currentOrder.total}</h3>
            </div>
          )}

          <Link to="/" style={{ textDecoration: "none" }}>
<Button
  variant="contained"
  color="success"
  style={{ display: "block", margin: "20px auto" }}
>
  Back Home
</Button>   
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;