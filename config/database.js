const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { MongooseFindByReference } = require("mongoose-find-by-reference");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  });

mongoose.plugin(slug);
mongoose.plugin(MongooseFindByReference);

module.exports = mongoose;
