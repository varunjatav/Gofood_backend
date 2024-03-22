const mongoose = require("mongoose");
// mongodb+srv://gofood:<password>@cluster0.hvjkllb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoURI =
  "mongodb+srv://gofood:gofoodpass@cluster0.hvjkllb.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
    const fetched_data = await mongoose.connection.db.collection("food_items");
    const data = await fetched_data.find({}).toArray();
    global.food_items = data;
    const foodCategory =  await mongoose.connection.db.collection("foodCategories");
    CatData = await foodCategory.find({}).toArray();
    global.foodCategory = CatData;
    // console.log(global.foodCategory);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
module.exports = mongoDB;
