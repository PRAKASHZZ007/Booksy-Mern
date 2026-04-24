// ===== Header.jsx =====
import { useState, useEffect } from "react";
import { FaBook, FaShoppingBag, FaUser, FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../AuthModal";
import "./index.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // check login status
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth();

    window.addEventListener("login", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("login", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  // close dropdown on outside click
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
    window.dispatchEvent(new Event("login"));
    navigate("/");
  };

  return (
    <>
      <nav className="header-container">
        <div className="header-content-container">

          {/* LOGO */}
          <Link to="/" className="nav-link">
            <div className="logo-container">
              <div className="logo">B</div>
              BOOKSY
            </div>
          </Link>

          <ul className="nav-items-container">

            {/* BOOKS */}
            <Link to="/books" className="nav-link">
              <li className="icon-container">
                <FaBook className="icon" />
                <span className="icon-name">Book List</span>
              </li>
            </Link>

            {/* CART */}
            <Link to="/cart" className="nav-link">
              <li className="icon-container">
                <FaShoppingBag className="icon" />
                <span className="icon-name">Cart</span>
              </li>
            </Link>

            {/* USER DROPDOWN */}
            <li className="icon-container" onClick={toggleDropdown}>
              <FaUser className="icon" />
              <span className="icon-name">
                {isLoggedIn ? "Account" : "Login"}
              </span>

              {showDropdown && (
                <div className="dropdown">

                  <div
                    className="dropdown-row"
                    onClick={() => {
                      setShowDropdown(false);

                      if (!isLoggedIn) {
                        setModalType("login");
                      } else {
                        navigate("/profile");
                      }
                    }}
                  >
                    <FaUser className="dropdown-icon" />
                    <span>Your Account</span>
                  </div>

                  <div
                    className="dropdown-row"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/orders");
                    }}
                  >
                    <FaBoxOpen className="dropdown-icon" />
                    <span>Your Orders</span>
                  </div>

                  <hr />

                  {!isLoggedIn ? (
                    <>
                      <p className="new-user-text">
                        If you are a new user
                      </p>

                      <button
                        className="register-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalType("signup");
                          setShowDropdown(false);
                        }}
                      >
                        Register
                      </button>

                      <button
                        className="login-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalType("login");
                          setShowDropdown(false);
                        }}
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <button
                      className="login-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  )}

                </div>
              )}
            </li>

          </ul>
        </div>
      </nav>

      {/* AUTH MODAL */}
      {modalType && (
        <AuthModal
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default Header;