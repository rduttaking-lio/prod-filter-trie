import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: { list: [] },
  reducers: {
    addProduct: (state, action) => {
      const exists = state.list.some((p) => p.name === action.payload.name);
      if (!exists) state.list.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter((p) => p.name !== action.payload.name);
    },
    clearProducts: (state) => {
      state.list = [];
    },
  },
});

export const { addProduct, deleteProduct, clearProducts } =
  productSlice.actions;

export default productSlice.reducer;
