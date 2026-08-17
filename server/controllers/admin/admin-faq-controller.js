const FAQ = require("../../models/FAQ");

const addFAQ = async (req, res) => {
  try {
    const { question, answer, category, sortOrder } = req.body;
    const faq = new FAQ({ question, answer, category, sortOrder });
    await faq.save();
    res.status(201).json({ success: true, data: faq });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, data: faq });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({}).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addFAQ, updateFAQ, deleteFAQ, getAllFAQs };
