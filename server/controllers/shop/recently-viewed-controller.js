const RecentlyViewed = require("../../models/RecentlyViewed");

const addRecentlyViewed = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId required" });
    }

    await RecentlyViewed.findOneAndDelete({ userId, productId });
    const item = new RecentlyViewed({ userId, productId });
    await item.save();

    const count = await RecentlyViewed.countDocuments({ userId });
    if (count > 20) {
      const oldest = await RecentlyViewed.find({ userId }).sort({ createdAt: 1 }).limit(count - 20);
      const ids = oldest.map((d) => d._id);
      await RecentlyViewed.deleteMany({ _id: { $in: ids } });
    }

    res.status(201).json({ success: true, data: item });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await RecentlyViewed.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 })
      .limit(20);
    const validItems = items.filter((i) => i.productId);
    res.status(200).json({ success: true, data: validItems });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addRecentlyViewed, getRecentlyViewed };
