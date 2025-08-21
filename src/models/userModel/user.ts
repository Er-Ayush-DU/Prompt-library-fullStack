import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  bio: { type: String, maxlength: 200 }
}, { timestamps: true });

UserSchema.pre("save", async function (next){
  if (this.isModified("password")) {
    // Hash the password here if needed
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
