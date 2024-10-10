import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface AdminModel {
    name : string;
    email : string;
    password : string;
}

const AdminSchema = new Schema<AdminModel>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;