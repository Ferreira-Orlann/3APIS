import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const connect = async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	if (mongoose.connection.readyState) {
		await mongoose.connection.close();
	}

	await mongoose.connect(uri);
};

export const closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoServer.stop();
};