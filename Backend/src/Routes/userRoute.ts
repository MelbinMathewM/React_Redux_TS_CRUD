import { Router } from 'express';
const u_route = Router();

import { verifyToken, refreshToken, registerUser, verifyLogin, getUsers, editUser } from '../Controllers/userController';

u_route.post('/register',registerUser);
u_route.post('/login',verifyLogin);

u_route.get('/home',getUsers);
u_route.put('/update',editUser);

u_route.post('/verify_token',verifyToken);
u_route.post('/refresh_token',refreshToken);

export default u_route;
