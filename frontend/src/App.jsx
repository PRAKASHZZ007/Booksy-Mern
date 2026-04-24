import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./components/Home";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./components/Orders";



import "./App.css";

const App = () => {
  return (
    <>
         <Toaster
        position="top-right"
        toastOptions={{
          style: {
            marginTop: "90px",
            marginRight: "20px"
          },
        }}
      />
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/books" element={<BookList />} />
  <Route path="/books/:id" element={<BookDetails />} />

  {/* 🔐 Protected */}
  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  {/* ✅ ADD THIS */}
  <Route
    path="/orders"
    element={
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    }
  />

  <Route path="/not-found" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/not-found" />} />
</Routes>
    </>
  );
};

export default App;