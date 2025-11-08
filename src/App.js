import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  deleteProduct,
  clearProducts,
} from "../src/components/slice/productSlice";
import { Trie } from "../src/components/Trie";
import initialProducts from "../src/components/products.json";

const ProductCard = lazy(() => import("../src/components/card/ProductCard"));

function App() {
  const [productName, setProductName] = useState("");
  const [searchProductByName, setSearchProductByName] = useState("");
  const [charMatches, setCharMatches] = useState([]);
  const [exactMatch, setExactMatch] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [foundProduct, setFoundProduct] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const products = useSelector((state) => state.products.list);
  const dispatch = useDispatch();
  const trieRef = useRef(new Trie());

  // ✅ Load initial products once
  useEffect(() => {
    if (products.length === 0) {
      initialProducts.forEach((p) => dispatch(addProduct(p)));
    }
  }, [dispatch, products.length]);

  // ✅ Build Trie whenever products change
  useEffect(() => {
    const newTrie = new Trie();
    products.forEach((p) => newTrie._insert(p.name.toLowerCase()));
    trieRef.current = newTrie;
  }, [products]);

  // ✅ Add new product
  const handleAdd = () => {
    if (productName.trim() !== "") {
      const newProduct = { name: productName };
      dispatch(addProduct(newProduct));
      setProductName("");
    }
  };

  // ✅ Search logic (Trie)
  const filterProducts = (value) => {
    setSearchProductByName(value);
    if (value.trim() === "") {
      setCharMatches([]);
      setExactMatch(null);
      setSuggestions([]);
      setFoundProduct(null);
      return;
    }

    const lower = value.toLowerCase();
    const matches = trieRef.current._searchCharByChar(lower);
    const fullMatch = trieRef.current._searchWord(lower);
    const autoSuggestions = trieRef.current._getWordsWithPrefix(lower);

    setCharMatches(matches);
    setExactMatch(fullMatch);
    setSuggestions(autoSuggestions.slice(0, 5));

    if (fullMatch) {
      const found = products.find(
        (p) => p.name.toLowerCase() === lower
      );
      setFoundProduct(found || null);
    } else {
      setFoundProduct(null);
    }
  };

  // ✅ Suggestion click
  const handleSuggestionClick = (word) => {
    setSearchProductByName(word);
    setSuggestions([]);
    const lower = word.toLowerCase();
    const matches = trieRef.current._searchCharByChar(lower);
    const fullMatch = trieRef.current._searchWord(lower);
    setCharMatches(matches);
    setExactMatch(fullMatch);

    if (fullMatch) {
      const found = products.find(
        (p) => p.name.toLowerCase() === lower
      );
      setFoundProduct(found || null);
    } else {
      setFoundProduct(null);
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-6">
        🛒 Redux Product Manager (Trie Search + Pagination)
      </h1>

      {/* Add Product Section */}
      <div className="flex justify-center gap-2 mb-4">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          className="border border-gray-400 p-2 rounded w-64"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={() => dispatch(clearProducts())}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-80 mx-auto mb-6">
        <input
          type="text"
          value={searchProductByName}
          onChange={(e) => filterProducts(e.target.value)}
          placeholder="🔍 Search products..."
          className="border border-gray-400 p-2 rounded w-full shadow-sm focus:ring focus:ring-blue-200"
        />
        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg text-left z-10">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                🔎 {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Character Matches */}
      {charMatches.length > 0 && (
        <div className="w-64 mx-auto bg-white rounded shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Character Matches:</h2>
          <div className="flex justify-center flex-wrap gap-2">
            {charMatches.map((c, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded ${
                  c.exists
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {c.char}
              </span>
            ))}
          </div>
          <div className="mt-4 text-center font-semibold">
            {exactMatch === true && (
              <span className="text-green-600">
                ✅ "{searchProductByName}" found!
              </span>
            )}
            {exactMatch === false && (
              <span className="text-red-600">
                ❌ "{searchProductByName}" not found.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Found Product */}
      {foundProduct ? (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 text-left mb-10 transition transform hover:scale-[1.01]">
          <h2 className="text-gray-700 text-sm uppercase mb-2">Top Result</h2>
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {foundProduct.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {foundProduct.description ||
              "This product was found using Trie search with an exact match."}
          </p>
        </div>
      ) : (
        searchProductByName.trim() === "" && (
          <>
            <div className="flex flex-wrap justify-center gap-4">
              {paginatedProducts.map((p, index) => (
                <div key={index} className="relative">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProductCard product={p} />
                  </Suspense>
                  <button
                    onClick={() => dispatch(deleteProduct(p))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="mt-10 flex justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default App;
