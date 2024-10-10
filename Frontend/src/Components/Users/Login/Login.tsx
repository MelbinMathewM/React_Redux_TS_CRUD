import React, { useContext, useState } from "react"
import './Login.css';
import { useDispatch } from "react-redux";
import { UserContext } from "../../../context/userContext";
import Cookies from "js-cookie";
import { setUserToken, updateUser } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

interface Obj {
    name : string,
    email : string,
    password : string,
}


const LoginContainer = () => {

    const dispatch = useDispatch();
    const userContext = useContext(UserContext);
    const [login,setLogin] = useState<boolean>(true);
    const [input, setInput] = useState<Obj>({
        name : '',
        email : '',
        password : ''
    });
    const navigate = useNavigate();
    const [error,setError] = useState<string>('')
    const [message,setMessage] = useState<string>('')

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name] : value
        }))
    }

    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault();
        if(login){
            const obj = {
                email : input.email,
                password : input.password
            }
            try{
                fetch('http://localhost:3000/login',{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(obj)
                })
                .then(async(res) => {
                    return await res.json()
                })
                .then((data) => {
                    console.log(data,'hh')
                    if(data.accessToken && data.refreshToken){
                        setInput({
                            name : '',
                            email : '',
                            password : ''
                        })
                        Cookies.set('accessToken',data.accessToken);
                        Cookies.set('refreshToken',data.refreshToken);
                        dispatch(setUserToken(data.accessToken));
                        userContext?.setIsAuth(true);
                        navigate('/home')
                    }else{
                        setError(data.message)
                    }
                })
            }catch(err){
                console.log(err)
            }

        }else{
            const obj = {
                name : input.name,
                email : input.email,
                password : input.password
            }
            try{
                fetch('http://localhost:3000/register',{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(obj)
                })
                .then(async(res) => {
                    return await res.json();
                })
                .then((data) => {
                    setMessage(data.message)
                    navigate('/login');
                    setLogin(!login)
                })
            }catch(err){
                console.log(err)
            }
        }
    } 

    return (
        <div className="login-container">
            <h2>{login ? 'Login' : 'Register'}</h2>
            <p style={{color : 'red'}}>{error}</p>
            <form onSubmit={handleSubmit}>
                { !login && 
                <input type="text" name="name" value={input.name} onChange={handleInput} placeholder="Enter name"/> }
                <input type="email" name="email" value={input.email} onChange={handleInput} placeholder="Enter email" />
                <input type="password" name="password" value={input.password} onChange={handleInput} placeholder="Enter password" />
                <button type="submit" >Submit</button>
                <span onClick={() => setLogin(!login)}>{login ? 'Don\'t have an account? Sign Up' : 'Already have an Account? Log In'}</span>
            </form>
        </div>
    )
}

export default LoginContainer;