const service = require("./orders.service");

async function postOrder(req, res, next) {
  try {
    const out = await service.createPickupOrder(req.body);
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
}

async function getTrack(req, res, next) {
  try {
    const out = await service.trackOrder(req.params.orderNumber);
    res.json(out);
  } catch (e) {
    next(e);
  }
}

module.exports = { postOrder, getTrack };
