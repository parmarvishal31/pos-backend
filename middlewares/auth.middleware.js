import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthenticated, please login again" });
  }

  try {
    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    } else {
      // Handle other errors if needed
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export { isLoggedIn };
