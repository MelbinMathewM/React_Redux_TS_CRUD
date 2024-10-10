import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface UserModel {
    name : string;
    email : string;
    imageUrl : string;
    password : string;
}

const UserSchema = new Schema<UserModel>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
    },
    password : {
        type : String,
        required : true
    }
})

const User = mongoose.model('User', UserSchema);
export default User;