import { useContext, useState } from "react";
import './LoginContainer.css';
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAdminToken } from "../../../redux/store";
import { AdminContext } from "../../../context/adminContext";
import { useNavigate } from "react-router-dom";

const LoginContainer = () => {
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const [isLogin,setIsLogin] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        if(name){
            setInput({
                ...input,
                [name] : value
            })
        }
    }

    const dispatch = useDispatch();

    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault();
        
        const obj = {
            email : input.email,
            password : input.password
        }
        setIsLogin(true);
        fetch('http://localhost:3000/admin/login',{
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
            if(data.accessToken && data.refreshToken){
                setInput({
                    email : '',
                    password : ''
                })
                Cookies.set('adminAccessToken',data.accessToken);
                Cookies.set('adminRefreshToken',data.refreshToken);
                dispatch(setAdminToken(data.accessToken));
                adminContext?.setIsAuth(true);
                navigate('/admin/dashboard');
            }else{
                setIsLogin(false);
                setError(data.message)
            }
        })
        .catch((err) => {
            setIsLogin(false);
            console.log(err);
        })
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <p style={{color:'red'}}>{error}</p>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={input.email} onChange={handleInput} placeholder="Enter Email" />
                <input type="password" name="password" value={input.password} onChange={handleInput} placeholder="Enter Password" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default LoginContainer;