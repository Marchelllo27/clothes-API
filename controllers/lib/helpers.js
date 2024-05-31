async function fetchRequest(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) throw new Error("Something went wrong");

  const responseData = await response.json();
  return responseData;
}

async function fetchAllProducts() {
  const allProducts = await fetchRequest("https://fakestoreapi.com/products");

  //filter products from our fake api. We need only men's & women's clothes.
  const filteredProducts = allProducts.filter(
    product => product.category === "men's clothing" || product.category === "women's clothing"
  );

  return filteredProducts;
}

module.exports = { fetchRequest, fetchAllProducts };
