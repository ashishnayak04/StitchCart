const FAQ = require("../../models/FAQ");

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getFAQs };
