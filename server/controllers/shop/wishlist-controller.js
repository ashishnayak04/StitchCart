const Wishlist = require("../../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId required" });
    }

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already in wishlist" });
    }

    const item = new Wishlist({ userId, productId });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const item = await Wishlist.findOneAndDelete({ userId, productId });
    if (!item) {
      return res.status(404).json({ success: false, message: "Not in wishlist" });
    }
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Wishlist.find({ userId }).populate("productId");
    const validItems = items.filter((i) => i.productId);
    res.status(200).json({ success: true, data: validItems });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const checkWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const item = await Wishlist.findOne({ userId, productId });
    res.status(200).json({ success: true, data: { isWishlisted: !!item } });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist, checkWishlist };
