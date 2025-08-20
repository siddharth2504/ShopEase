let productList = [];

(async function() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    
    productList.push(...data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
})();

export default productList;