const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // how we associate each account with a user
    ref: "users"
  },
  accessToken: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  institutionId: {
    type: String,
    required: true
  },
  institutionName: {
    type: String
  },
  accountName: {
    type: String
  },
  accountType: {
    type: String
  },
  accountSubtype: {
    type: String
  }
});

module.exports = Account = mongoose.model("account", AccountSchema);
