const { fetchAllProducts } = require("./lib/helpers");

async function getAllProductsController(req, res) {
  try {
    const allProducts = await fetchAllProducts();

    res.json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

module.exports = { getAllProductsController };
