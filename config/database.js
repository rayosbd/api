const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  });

mongoose.plugin(slug);

module.exports = mongoose;
