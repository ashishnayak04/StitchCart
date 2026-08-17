const Policy = require("../../models/Policy");

const getPolicy = async (req, res) => {
  try {
    const { slug } = req.params;
    const policy = await Policy.findOne({ slug });
    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy not found" });
    }
    res.status(200).json({ success: true, data: policy });
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

module.exports = { getPolicy, getAllPolicies };
