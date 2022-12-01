import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 5,
  },
  customerId: {
    type: String
  },
  connectedAccount: {
    type: String
  },
  orders: {
    type: Array
  },
  holidayMode: {
    type: Boolean,
    default: false
  }
  
  
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

