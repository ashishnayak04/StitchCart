const Policy = require("../../models/Policy");

const addPolicy = async (req, res) => {
  try {
    const { slug, title, content } = req.body;
    const policy = new Policy({ slug, title, content });
    await policy.save();
    res.status(201).json({ success: true, data: policy });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndUpdate(id, req.body, { new: true });
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });
    res.status(200).json({ success: true, data: policy });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    await Policy.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Policy deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({}).sort({ title: 1 });
    res.status(200).json({ success: true, data: policies });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addPolicy, updatePolicy, deletePolicy, getAllPolicies };
