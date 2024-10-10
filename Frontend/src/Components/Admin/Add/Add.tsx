import { useContext, useState } from "react";
import { AdminContext } from "../../../context/adminContext";
import { useSelector } from "react-redux";
import { adminAuth } from "../../../auth/adminAuth";
import { useNavigate } from "react-router-dom";
import './Add.css'


const AddComponent = () => {
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();
    const accessToken = useSelector((state : any) => state.adminToken);
    const [input, setInput] = useState({
        name : '',
        email : '',
        password : ''
    });
    const [message, setMessage] = useState('');
    const [msgType,setMsgType] = useState('green')

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name] : value
        }))
    }

    const handleSubmit = async(event : React.FormEvent) => {
        event.preventDefault();
        const obj = {
            name : input.name,
            email : input.email,
            password : input.password
        }
        const newAccessToken = await adminAuth(accessToken);
        if(newAccessToken){
            const response = await fetch('http://localhost:3000/admin/insert',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${newAccessToken}`
                },
                body : JSON.stringify(obj)
            })
            if(response.status === 401){
                setMessage('error adding user');
                setMsgType('red');
            }else{
                const result = await response.json();
                setMessage(result.message);
                setMsgType('green')
                setTimeout(() => {
                    navigate('/admin/users')
                },1000)
            }
        }
    }

    return (
        <div className="add-comp">
            <h1>Add User</h1>
            <p style={{ color : msgType === 'red' ? 'red' :'green'}}>{message}</p>
            <form id="addadminform" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                    placeholder="Enter name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleInput}
                    placeholder="Enter email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleInput}
                    placeholder="Enter password"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddComponent;