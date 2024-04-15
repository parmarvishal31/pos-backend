import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URL);
        console.log('database connected..');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDb