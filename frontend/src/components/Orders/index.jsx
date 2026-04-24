import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../Header";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import "./index.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ FETCH ORDERS (FIXED)
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 backend returns array directly
        setOrders(Array.isArray(data) ? data : []);
      } else {
        toast.error(data.message || "Failed to load orders");
        setOrders([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // ✅ OPEN DIALOG
  const handleOpenDialog = (id) => {
    setSelectedOrderId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  // ✅ CANCEL ORDER
  const handleConfirmCancel = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${selectedOrderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Order cancelled successfully ✅");
        fetchOrders();
      } else {
        toast.error(data.message || "Cancel failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Cancel failed");
    }

    handleCloseDialog();
  };

  return (
    <div className="orders-page">

      {/* HEADER */}
      <Header/>

      {/* CONTENT */}
      <div className="checkout-form">
        <div className="checkout-content-container">

          <h1 className="checkout-heading">Your Orders</h1>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 10,
                textAlign: "center"
              }}
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 80, color: "#bbb" }} />

              <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                No Orders Yet
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, color: "gray" }}>
                You haven’t placed any orders yet.
              </Typography>

              <Link to="/books" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "#ffe619",
                    color: "#000",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f7ca00"
                    }
                  }}
                >
                  Browse Books
                </Button>
              </Link>
            </Box>
          ) : (
            orders.map((order, index) => (
              <div key={order._id} className="summary-container">

                <h3 className="order-number">
                  Order #{index + 1}
                </h3>

                <div className="summary-item-container total-row">
                  <p>ID: {order._id}</p>
                  <p>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>

                {/* ITEMS */}
                {Array.isArray(order.items) &&
                  order.items.map((item, i) => {
                    const qty = item.quantity || 1;
                    const total = (item.price || 0) * qty;

                    return (
                      <div key={i} className="summary-item-container">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="summary-item-image"
                        />
                        <p className="summary-item-title">
                          {item.title}
                        </p>
                        <p className="summary-item-qty">
                          Qty: {qty}
                        </p>
                        <p className="summary-item-price">
                          ₹ {total.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}

                {/* TOTAL */}
                <div className="summary-item-container total-row">
                  <p>Total</p>
                  <p>₹ {(order.total || 0).toFixed(2)}</p>
                </div>

                {/* CANCEL */}
                <div className="cancel-container">
                  <button
                    className="cancel-btn"
                    onClick={() => handleOpenDialog(order._id)}
                  >
                    Cancel Order
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Order</DialogTitle>

        <DialogContent>
          Are you sure you want to cancel this order?
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Orders;