import jwt from "jsonwebtoken";
import Shop from "./models/Shop";

async function checkSubscription(req, res, next) {
  const token = req.headers.authorization;
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

    if (isActive && currentDate >= start_date && currentDate <= end_date) {
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
