import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  eth:{
    type : String,
    default : "1000"
  },
  btc:{
    type : String,
    default : "1000"
  },
  refreshToken: {
    type: String,
  },
});

//#region Password handling

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {

  return await bcrypt.compare(password, this.password);
};

//#endregion

//#region Token Generation

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }
  );
};

//#endregion

const User = model("User", userSchema);

export default User;
