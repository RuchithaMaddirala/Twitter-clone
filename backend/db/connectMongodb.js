import mongoose from "mongoose";

const connectmongodb= async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoose connected: ${conn.connection.host}`)
    } catch (error) {
        console.error("error: connection failed",`${error.message}`);
        process.exit(1);
    }
}
export default connectmongodb;