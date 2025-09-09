import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryLayout from '../Components/CategoryLayout';
import getCategories from '../Components/productsCategory';
import { FaSearch } from 'react-icons/fa';
import productList from '../data/productList';

const Products = ({ setCartList, cartList }) => {
  const { category } = useParams();
  const categoriesArr = getCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    // Filter products based on category, search term, and price range
    let filtered = [...productList];
    
    // Filter by category if specified
    if (category) {
      filtered = filtered.filter(product => 
        product.category === decodeURIComponent(category)
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => product.price <= priceRange);
    
    // Sort products
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    
    setFilteredProducts(filtered);
  }, [category, searchTerm, priceRange, sortBy, productList]);

  return (
    <div className="products-page">
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="price-filter">
            <label>Max Price: ₹{priceRange}</label>
            <input
              type="range"
              min="10"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
          
          <div className="sort-filter">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="category-filters">
        <Link 
          to="/products"
          className={`category-filter ${!category ? 'active' : ''}`}
        >
          ALL
        </Link>
        {categoriesArr.map((cat, index) => (
          <Link 
            key={index}
            to={`/products/${encodeURIComponent(cat)}`}
            className={`category-filter ${cat === decodeURIComponent(category) ? 'active' : ''}`}
          >
            {cat.toUpperCase()}
          </Link>
        ))}
      </div>

      {searchTerm && filteredProducts.length === 0 ? (
        <div className="no-results">
          <h2>No products found matching "{searchTerm}"</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="filtered-products">
          <div className="product-list">
            {filteredProducts.map((product) => (
              <CategoryLayout
                key={product.id}
                category={product.category}
                setCartList={setCartList}
                cartList={cartList}
                filteredProducts={[product]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;