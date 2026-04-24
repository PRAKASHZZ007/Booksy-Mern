import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Header from "../Header";
import CartItem from "../CartItem";

import {
  fetchCart,
  clearCart as clearCartAction,
} from "../redux/cartSlice";

import "./index.css";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ GET FROM REDUX (NOT LOCAL STATE)
  const cartList = useSelector((state) => state.cart.cartList);

  // FETCH CART ON LOAD
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const isCartEmpty = cartList.length === 0;

  const total = cartList.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // ✅ CLEAR CART (FIXED)
  const handleClearCart = async () => {
    await dispatch(clearCartAction());
    dispatch(fetchCart()); // refresh UI
  };

  return (
    <>
      <Header />

      <div className="cart-page-container">

        {isCartEmpty ? (
          <div className="empty-cart">
            <ShoppingCartOutlinedIcon className="empty-icon" />
            <h2>Your cart is empty</h2>

            <button
              className="checkout-button"
              onClick={() => navigate("/books")}
            >
              Browse Books
            </button>
          </div>
        ) : (
          <>
            <div className="cart-content-container">
              <h1 className="cart-heading">Your Cart</h1>

              <div className="cart-container">
                {cartList.map((item) => (
                  <CartItem
                    key={item.bookId}
                    cartItemDetails={item}
                    refreshCart={() => dispatch(fetchCart())}
                  />
                ))}

                <button
                  className="checkout-button remove-button"
                  onClick={handleClearCart}
                >
                  Remove all
                </button>
              </div>
            </div>

            <div className="order-content-container">
              <h1 className="order-title">Order Summary</h1>

              <div className="order-summary-container">
                <div className="order-amount-container">
                  <p className="order-amount">Amount Payable:</p>
                  <h1 className="cart-price">₹ {total.toFixed(2)}</h1>
                </div>

                <p className="order-text">(inclusive of all taxes)</p>

                <button
                  className="checkout-button"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default Cart;