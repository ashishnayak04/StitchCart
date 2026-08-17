const LoyaltyPoint = require("../../models/LoyaltyPoint");

const POINTS_PER_INR = 1; // 1 point per rupee spent

const getLoyaltyPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    let loyalty = await LoyaltyPoint.findOne({ userId });
    if (!loyalty) {
      loyalty = new LoyaltyPoint({ userId, points: 0, history: [] });
      await loyalty.save();
    }
    res.status(200).json({ success: true, data: loyalty });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const earnPoints = async (userId, amount, orderId, description) => {
  try {
    const points = Math.floor(amount * POINTS_PER_INR);
    if (points <= 0) return;

    let loyalty = await LoyaltyPoint.findOne({ userId });
    if (!loyalty) {
      loyalty = new LoyaltyPoint({ userId, points: 0, history: [] });
    }

    loyalty.points += points;
    loyalty.history.push({
      type: "earned",
      amount: points,
      description: description || "Purchase reward",
      orderId,
    });
    await loyalty.save();
    return points;
  } catch (e) {
    console.log("Loyalty earn error:", e);
    return 0;
  }
};

const redeemPoints = async (req, res) => {
  try {
    const { userId, points, orderId } = req.body;
    const loyalty = await LoyaltyPoint.findOne({ userId });
    if (!loyalty || loyalty.points < points) {
      return res.status(400).json({ success: false, message: "Insufficient points" });
    }

    loyalty.points -= points;
    loyalty.history.push({
      type: "redeemed",
      amount: points,
      description: "Points redemption",
      orderId,
    });
    await loyalty.save();
    res.status(200).json({ success: true, data: loyalty });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { getLoyaltyPoints, earnPoints, redeemPoints };
