import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="max-w-sm mt-5 rounded overflow-hidden shadow-lg p-4 mx-auto bg-white">
      <div className="font-bold text-xl mb-2">
        {product?.name || "Basic Card"}
      </div>
      <p className="text-gray-700 text-base">
        {product?.description ||
          <img src="https://images.unsplash.com/photo-1589859762194-eaae75c61f64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740" alt="demo"/>}
      </p>
    </div>
  );
};

export default ProductCard;
