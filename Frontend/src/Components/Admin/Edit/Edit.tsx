import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { adminAuth } from "../../../auth/adminAuth";
import { AdminContext } from "../../../context/adminContext";
import { useDispatch, useSelector } from "react-redux";
import { setAdminToken } from "../../../redux/store";
import Cookies from "js-cookie";
import './Edit.css'

interface Datas {
    _id: string,
    name: string,
    email: string,
}

interface EditModalProps {
    item: Datas;
    onClose: () => void;
    onUserUpdate: (updatedUser: Datas) => void;
}

const EditModal = ({ item, onClose, onUserUpdate }: EditModalProps) => {
    const adminContext = useContext(AdminContext);
    const adminToken = useSelector((state: any) => state.adminToken);
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
    };

    const updateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const obj = {
            id: _id,
            name: input.name,
            email: input.email,
        };
        const newAccessToken = await adminAuth(adminToken);
        if (newAccessToken) {
            dispatch(setAdminToken(newAccessToken));
            Cookies.set('adminAccessToken', newAccessToken);

            const response = await fetch('http://localhost:3000/admin/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newAccessToken}`,
                },
                body: JSON.stringify(obj),
            });

            if (response.status === 401) {
                alert('Error updating user');
            } else {
                const result = await response.json();
                console.log(result.message);
                onUserUpdate({ _id, name: input.name, email: input.email });
                onClose();
            }
        } else {
            adminContext?.logout();
        }
    };

    return (
        <>
            <div className="modalc-overlay" onClick={onClose}></div>
            <div className="modalc">
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
};

export default EditModal;
