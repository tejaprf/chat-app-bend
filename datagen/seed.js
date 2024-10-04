import mongoose from 'mongoose';
import { User } from './models/user.model.js'; // Adjust the import based on your structure
import { Message } from './models/message.model.js'; // Assuming you have a message model
import { Conversation } from './models/conversation.model.js'; // Assuming you have a conversation model

const userIds = [
    "66f28bd7e427f39944ca76d4", // User 1
    "66f28bd7e427f39944ca76d9", // User 2
    "66f28bd7e427f39944ca76de", // User 3
    "66f28bd7e427f39944ca76e3", // User 4
    "66f28bd7e427f39944ca76e8", // User 5
    "66f28bd7e427f39944ca76ed", // User 6
    "66f28bd7e427f39944ca76f2", // User 7
    "66f28bd8e427f39944ca76f7", // User 8
    "66f28bd8e427f39944ca76fc", // User 9
    "66f28bd8e427f39944ca7701", // User 10
    "66f28bd8e427f39944ca7706", // User 11
    "66f28bd8e427f39944ca770b", // User 12
    "66f28bd8e427f39944ca7710", // User 13
    "66f28bd8e427f39944ca7715", // User 14
    "66f28bd8e427f39944ca771a", // User 15
    "66f28bd9e427f39944ca771f", // User 16
    "66f28bd9e427f39944ca7724", // User 17
    "66f28bd9e427f39944ca7729", // User 18
    "66f28bd9e427f39944ca772e", // User 19
    "66f28bd9e427f39944ca7733", // User 20
];

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_db_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const createFriendships = async () => {
    const users = await User.find({ _id: { $in: userIds } });

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            // Randomly create friendships
            if (Math.random() > 0.5) {
                users[i].friends.push(users[j]._id);
                users[j].friends.push(users[i]._id);
            }
        }
    }

    await Promise.all(users.map(user => user.save()));
};

const createMessagesAndConversations = async () => {
    for (let i = 0; i < userIds.length; i++) {
        for (let j = i + 1; j < userIds.length; j++) {
            if (Math.random() > 0.5) {
                const messageCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 messages
                const conversationId = new mongoose.Types.ObjectId(); // Create a new conversation ID
                
                for (let k = 0; k < messageCount; k++) {
                    const message = new Message({
                        sender: userIds[i],
                        receiver: userIds[j],
                        content: `Message ${k + 1} from ${userIds[i]}`,
                        conversationId: conversationId,
                        createdAt: new Date(),
                    });
                    await message.save();
                }

                // Create conversation entry
                const conversation = new Conversation({
                    participants: [userIds[i], userIds[j]],
                    messages: [conversationId],
                });
                await conversation.save();
            }
        }
    }
};

const seedDatabase = async () => {
    await connectDB();
    await createFriendships();
    await createMessagesAndConversations();
    console.log("Database seeded successfully.");
    mongoose.connection.close();
};

seedDatabase();
