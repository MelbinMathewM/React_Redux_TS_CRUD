import React, { useContext, useEffect, useState } from "react";
import { userAuth } from "../../../auth/userAuth";
import { UserContext } from "../../../context/userContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../../../redux/store";
import Cookies from "js-cookie";
import './Edit.css';

interface Datas {
    _id: string,
    name: string,
    email: string,
}

interface Inputs {
    _id: string,
    name: string,
    email: string,
}

type SetInputsFunction = (input: Inputs) => void;

const EditModal = ({ item, onClose, setInputs }: { item: Datas, onClose: () => void, setInputs: SetInputsFunction }) => {
    const userContext = useContext(UserContext);
    const userToken = useSelector((state: any) => state.userToken);
    const dispatch = useDispatch();
    const { _id, name: initialName, email: initialEmail } = item;
    const [input, setInput] = useState({
        _id: _id,
        name: initialName,
        email: initialEmail,
    });

    const updateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const updateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const obj = {
            id: _id,
            name: input.name,
            email: input.email
        };
        const newAccessToken = await userAuth(userToken);
        if (newAccessToken) {
            dispatch(setUserToken(newAccessToken));
            Cookies.set('adminAccessToken', newAccessToken);

            const response = await fetch('http://localhost:3000/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newAccessToken}`
                },
                body: JSON.stringify(obj)
            });
            if (response.status === 401) {
                alert('Error when fetching');
            } else {
                const result = await response.json();
                setInputs({
                    _id: obj.id,
                    name: obj.name,
                    email: obj.email
                });
                console.log(result.message);
                onClose();
            }
        } else {
            userContext?.logout();
        }
    }

    useEffect(() => {
        setInput({
            _id: item._id,
            name: item.name,
            email: item.email,
        });
    }, [item]);

    return (
        <>
            <div className="modale-overlay" onClick={onClose}></div>
            <div className="modale">
                <h1>Edit User</h1>
                <form onSubmit={updateSubmit}>
                    <input type="hidden" name="id" value={input._id} />
                    <input
                        type="text"
                        name="name"
                        onChange={updateInput}
                        value={input.name}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={updateInput}
                        value={input.email}
                        placeholder="Email"
                    />
                    <button type="submit">Submit</button>
                </form>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
}

export default EditModal;
