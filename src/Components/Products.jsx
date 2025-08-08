import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Products = ({ data, baseName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const productsPerPage = 8;
  const navigate = useNavigate();

  
  const categories = useMemo(() => {
    const all = data.map((item) => item.category);
    return ["All", ...new Set(all)];
  }, [data]);

  
  const filteredData =
    selectedCategory === "All"
      ? data
      : data.filter((item) => item.category === selectedCategory);

  const totalPages = Math.ceil(filteredData.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredData.slice(startIndex, startIndex + productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleClick = (id) => {
    navigate(`/product/${baseName}/${id}`);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">
        Inventories at <span className="text-blue-600">{baseName}</span>
      </h2>

      {}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-3 py-2 w-full sm:w-64"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-gray-500">No products available in this category.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="cursor-pointer border rounded-md shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="w-full flex flex-col items-center p-4">
                  <div className="w-full h-64 overflow-hidden rounded-md shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <h2 className="mt-2 text-center font-bold text-xl">{item.name}</h2>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ◀️
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ▶️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
