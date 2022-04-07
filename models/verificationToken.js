const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const verificationSchema = mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600000,
    default: Date.now(),
  },
  for: {
    type: String,
    default: ""
  }
});

verificationSchema.pre("save", async function(next) {
  if (this.isModified("token")) {
    let hash = await bcrypt.hash(this.token, 8); 
    this.token = hash;
  }

  next();
});

verificationSchema.methods.compareToken = async (token) => {
  let result = await bcrypt.compareSync(token, this.token)
  return result;
};

module.exports  = mongoose.model("verificationToken", verificationSchema);
