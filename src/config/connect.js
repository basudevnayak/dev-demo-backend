import mongoose from 'mongoose';

export const connect = (url) => {
  return mongoose.connect(url);
};

// import mongoose from 'mongoose';

// export const connect = async (url) => {
//   try {
//     mongoose.set('strictQuery', true); // optional but helps with warnings
//     await mongoose.connect(url); // clean and simple now
//     console.log('✅ MongoDB connected successfully');
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     throw error;
//   }
// };
