export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || "SERVER_ERROR";
  const message = err.message || "Something went wrong";

  res.status(status).json({
    ok: false,
    error: { code, message },
  });
}