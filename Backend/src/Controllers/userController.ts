import { Request, Response } from "express";
import User from "../Models/userModel";
import jwt from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcrypt';

export const verifyToken = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_USER as string);
        if(!isVerified) return res.sendStatus(401);

        res.sendStatus(200);

    }catch(err){
        console.log(err);
    }
}

export const refreshToken = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const refreshToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!refreshToken) return res.sendStatus(401);

        const isVerified = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET_USER as string);
        if(!isVerified) return res.sendStatus(401);

        const payload = { user_id : (isVerified as any).user_id };
        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_USER as string, { expiresIn : '30s' });

        res.json({ newAccessToken });

    }catch(err){
        console.log(err);
    }
}

export const registerUser = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const { name, email, password, image } = req.body;

        const existingEmail = await User.findOne({ email });
        if(existingEmail) return res.status(401).json({ message : 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            name,
            email,
            password : hashedPassword,
            imageUrl : image
        });
        await user.save();
        res.status(200).json({ message : ' Account created successfully' });

    }catch(err){
        console.log(err);
    }
}

export const verifyLogin = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const { email, password } = req.body;

        const user = await User.findOne({email : email});
        if(!user) return res.status(401).json({ message : 'Incorrect email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ message : 'Incorrect password' });
        
        const payload = { user_id : user._id };
        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET_USER as string, { expiresIn : '30s' });
        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_USER as string, { expiresIn : '7d' });

        res.json({ accessToken, refreshToken });

    }catch(err){
        console.log(err);
    }
}

export const getUsers = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_USER as string);
        if(!isVerified) return res.sendStatus(401);

        const userId = (isVerified as any).user_id;
        const user = await User.findOne({ _id : userId });
        if(!user) return res.sendStatus(404);

        res.status(200).json({ user });

    }catch(err){
        console.log(err);
    }
}

export const editUser = async ( req : Request, res : Response ) : Promise<any> => {
    try{

        const accessToken = req.headers['authorization']?.split(' ')[1] as string;
        if(!accessToken) return res.sendStatus(401);

        const isVerified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_USER as string);
        if(!isVerified) return res.sendStatus(401);

        const { name, email, image } = req.body;

        const userId = (isVerified as any).user_id;
        const existingEmail = await User.findOne({ _id : { $ne : userId }, email });
        if(existingEmail) return res.status(409).json({ message : 'Email already exists' });

        const user = await User.findByIdAndUpdate(userId, {
            $set : {
                name,
                email,
                imageUrl : image
            }
        }, { new : true });
        if(!user) return res.sendStatus(404);

        res.status(200).json({ updatedUser : user, message : 'User updated successfully' });
        
    }catch(err){
        console.log(err);
    }
}