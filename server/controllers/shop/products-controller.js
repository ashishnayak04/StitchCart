const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      brand = [],
      sortBy = "price-lowtohigh",
      ids,
      page = 1,
      limit = 12,
    } = req.query;

    let filters = {};

    if (ids) {
      filters._id = { $in: ids.split(",") };
    }

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (currentPage - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(filters).sort(sort).skip(skip).limit(pageSize),
      Product.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: currentPage,
      limit: pageSize,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
