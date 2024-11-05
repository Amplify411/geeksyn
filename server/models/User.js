import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email:String,
        password:String,
        profession: String,
        contact: String,
        },
        { timestamps: true }
);

const User= mongoose.model('User', UserSchema);

export default User;