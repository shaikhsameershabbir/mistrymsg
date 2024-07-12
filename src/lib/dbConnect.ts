
import { connect } from "http2";
import mongoose from "mongoose";

// TS check for database connection variable 
type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

export default async function dbConnect(): Promise<void> {
    // check if connection is ready then use this connection 
    if (connection.isConnected) {
        console.log('Already connected to Database ');
        return
    }
    // if  previous connection was ended then create new connection 
    try {
        // Connecting to mongo 
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        // Storing the connection output to know database connection is in ready State   or not   
        connection.isConnected = db.connections[0].readyState
        console.log('Database connection successful ');

    } catch (error) {
        console.log('Database connection failed ');
        // Exiting the process 
    }
}