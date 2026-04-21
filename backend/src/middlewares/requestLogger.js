const logRequest = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const log = {
      user: req.user?.id || "guest",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      time: `${Date.now() - start}ms`,
    };

    console.log("📊 Activity:", log);
  });

  next();
};

module.exports = logRequest;