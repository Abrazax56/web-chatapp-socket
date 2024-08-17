import mongoose from 'mongoose';
import 'dotenv/config';
const URI: string = process.env.MONGODB_URI || '';
(async () => {
    await mongoose.connect(URI);
})();
