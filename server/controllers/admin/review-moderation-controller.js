const ProductReview = require("../../models/Review");

const getAllReviews = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ProductReview.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductReview.countDocuments({}),
    ]);

    res.status(200).json({ success: true, data: reviews, total, totalPages: Math.ceil(total / limit), page, limit });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ProductReview.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const review = await ProductReview.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.status(200).json({ success: true, data: review });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getAllReviews, deleteReview, updateReviewStatus };
