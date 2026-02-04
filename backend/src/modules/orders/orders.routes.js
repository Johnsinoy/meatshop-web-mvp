const router = require("express").Router();
const { postOrder, getTrack } = require("./orders.controller");

router.post("/", postOrder);
router.get("/:orderNumber", getTrack);

module.exports = router;
