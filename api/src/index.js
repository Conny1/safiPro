const { default: mongoose } = require("mongoose");
const app = require("./app");
const port = process.env.PORT;

const connecttoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to DB");
  } catch (error) {
    console.log("error connecting to mongo db", error);
  }
};

app.listen(port, async () => {
  console.log("Server runing on port ", port);
  await connecttoDB();
});
