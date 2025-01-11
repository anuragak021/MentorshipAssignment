const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv config
dotenv.config();

const uri = "mongodb+srv://anuragak021:12345@mentorship.lxcuu.mongodb.net/mentorship?retryWrites=true&w=majority";

mongoose.set('useCreateIndex', true);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
//     socketTimeoutMS: 45000, // Increase socket timeout
//   });
