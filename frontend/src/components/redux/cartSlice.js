import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = `${process.env.REACT_APP_API_URL}/api/cart`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// 🔥 Safe extractor (VERY IMPORTANT)
const extractItems = (action) => {
  return (
    action.payload?.cart?.items ||
    action.payload?.items ||
    action.payload ||
    []
  );
};

// GET CART
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await fetch(API, { headers: getHeaders() });
  return res.json();
});

// ADD TO CART
export const addToCart = createAsyncThunk("cart/add", async (item) => {
  const res = await fetch(API, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(item),
  });
  return res.json();
});

// UPDATE QTY
export const updateQty = createAsyncThunk(
  "cart/update",
  async ({ bookId, action }) => {
    const res = await fetch(`${API}/${bookId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ action }),
    });
    return res.json();
  }
);

// DELETE ITEM
export const deleteItem = createAsyncThunk("cart/delete", async (bookId) => {
  const res = await fetch(`${API}/${bookId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
});

// CLEAR CART
export const clearCart = createAsyncThunk("cart/clear", async () => {
  const res = await fetch(`${API}/clear`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartList: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ✅ GET CART
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartList = extractItems(action);
      })

      // 🚀 ADD TO CART (SAFE + instant fallback)
      .addCase(addToCart.fulfilled, (state, action) => {
        const items = extractItems(action);

        if (Array.isArray(items) && items.length > 0) {
          state.cartList = items;
        }
      })

      // 🔥 UPDATE QTY
      .addCase(updateQty.fulfilled, (state, action) => {
        const items = extractItems(action);

        if (Array.isArray(items) && items.length > 0) {
          state.cartList = items;
        }
      })

      // 🗑 DELETE ITEM
      .addCase(deleteItem.fulfilled, (state, action) => {
        const items = extractItems(action);

        if (Array.isArray(items)) {
          state.cartList = items;
        }
      })

      // 🧹 CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.cartList = [];
      });
  },
});

export default cartSlice.reducer;