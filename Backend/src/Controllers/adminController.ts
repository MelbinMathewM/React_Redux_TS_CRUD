import { Request, Response } from "express";
import Admin from '../Models/adminModel';
import User from "../Models/userModel";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const verifyLogin = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const { email, password } = req.body;

        const admin = await Admin.findOne({email : email});
        if(!admin) return res.status(401).json({ message : 'Incorrect email'});

        const vPassword = await bcrypt.compare(password,admin.password);
        if(!vPassword) return res.status(401).json({ message : 'Incorrect password'});

        const payload = { admin_id : admin._id}
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_ADMIN as string, { expiresIn : '5m'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_ADMIN as string, { expiresIn : '7d'});

        res.status(200).json({ accessToken : accessToken, refreshToken : refreshToken })

    }catch(err){
        console.log(err);
    }
}

export const verifyToken = async ( req : Request, res : Response ) : Promise<any> => {
    try{
        const token = req.headers['authorization']?.split(' ')[1] as string;
        if(!token) return res.sendStatus(401);

        const isVerified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        res.sendStatus(200);

    }catch(err){
        console.log(err);
    }
}

export const refreshToken = async(req : Request, res : Response) : Promise<any> => {
    try{

        const refreshToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!refreshToken) return res.sendStatus(401);

        const isVerified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        const payload = { admin_id : (isVerified as any).admin_id };
        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_ADMIN as string, { expiresIn : '5m'});

        res.json({ accessToken : newAccessToken });

    }catch(err){
        console.log(err);
    }
}

export const getAdmin = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        let adminId = (isVerified as any).admin_id;
        const admin = await Admin.findOne({ _id : adminId });

        res.status(200).json({ admin : admin});

    }catch(err){
        console.log(err);
    }
}

export const getUsers = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        const users = await User.find();
        res.json({ users });

    }catch(err){
        console.log(err);
    }
}

export const addUser = async ( req :Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        const { name, email, password, image } = req.body;

        const existingEmail = await User.findOne({ email : email});
        if(existingEmail) return res.status(409).json({ message : 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({ email, name, password : hashedPassword, imageUrl : image });
        await newUser.save();

        res.status(200).json({ newUser, message : 'User added successfully' });

    }catch(err){
        console.log(err);
    }
}

export const editUser = async (req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        const { id, name, email, image } = req.body;
        
        const emailInUse = await User.findOne({ _id : { $ne : id }, email : email });
        if(emailInUse) return res.status(409).json({ message : 'Email already exists' });

        await User.updateOne({ _id : id }, { $set : { name : name, email : email, imageUrl : image }});
        res.status(200).json({ message : 'Updated successfully' });

    }catch(err){
        console.log(err);
    }
}

export const deleteUser = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_ADMIN as string);
        if(!isVerified) return res.sendStatus(401);

        const { userId } = req.query;
        await User.deleteOne({ _id : userId });
        res.json({ message : 'Deleted Successfully'});

    }catch(err){
        console.log(err);
    }
}