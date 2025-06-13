import mongoose from 'mongoose';

type MongooseConnection = {
    isConnected?: boolean;
}

const connection: MongooseConnection = {
}


export const connectDb = async () => {
    if (connection.isConnected) {
        console.log('Using existing connection');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0]?.readyState === 1 ? true : false;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}
