const express = require("express");
const { getPolicy, getAllPolicies } = require("../../controllers/shop/policy-controller");

const router = express.Router();

router.get("/", getAllPolicies);
router.get("/:slug", getPolicy);

module.exports = router;
