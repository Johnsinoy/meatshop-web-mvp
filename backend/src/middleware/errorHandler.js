const { AppError } = require("../shared/errors");

function errorHandler(err, _req, res, _next) {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = status === 500 ? "Server error" : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
