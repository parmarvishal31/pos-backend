import jwt from "jsonwebtoken";
import Shop from "../models/shop.js";
import { BOOLEAN_T } from "../constant/helper.js";

async function checkSubscription(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Split the header into 'Bearer' and the token
  const [bearer, token] = authHeader.split(' ');

  // Check if the token exists and is in the right format
  if (!token || bearer !== 'Bearer') {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verify the token and extract shop ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const shopId = decodedToken.id;

    // Fetch shop data from the database
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const currentDate = new Date();
    const { start_date, end_date, isActive } = shop;

    if (isActive === BOOLEAN_T && currentDate >= start_date && currentDate <= end_date) {
      // Subscription is active and within the valid period
      req.shop = shop;
      next();
    } else {
      return res.status(403).json({
        message: "Your subscription is over. Please renew your plan.",
      });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default checkSubscription;
