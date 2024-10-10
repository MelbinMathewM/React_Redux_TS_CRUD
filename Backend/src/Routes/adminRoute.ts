import express from 'express';
const a_route = express();

import { verifyLogin, verifyToken, refreshToken, getAdmin, getUsers, addUser, editUser, deleteUser } from '../Controllers/adminController';

a_route.post('/login',verifyLogin);

a_route.get('/dashboard',getAdmin);
a_route.get('/users',getUsers);
a_route.post('/insert',addUser);
a_route.put('/update',editUser);
a_route.delete('/remove',deleteUser);

a_route.post('/verify_token',verifyToken);
a_route.post('/refresh_token',refreshToken);

export default a_route;