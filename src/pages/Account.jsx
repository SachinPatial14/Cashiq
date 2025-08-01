import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const userAPI = import.meta.env.VITE_USER_URL;

    const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
    const loggedId = loggedUser.id;

    const navigate = useNavigate("") ;

    useEffect(() => {
        const currUser = localStorage.getItem("currentUser");
        if (currUser) {
            const user = JSON.parse(currUser);
            const userId = user.id;

            axios.get(`${userAPI}/${userId}`)
                .then((res) => {
                    setFullName(res.data.name);
                    setEmail(res.data.email);
                })
        }
    }, []);

    const updateUser = (e) => {
        e.preventDefault();

        axios.patch(`${userAPI}/${loggedId}`, {
            name: fullName,
            email: email,
        }).then((res) => {
            localStorage.setItem("currentUser", JSON.stringify({
                id: res.data.id,
                name: res.data.name,
                email: res.data.email,
            }));
            alert("Update Done");
        }).catch((err) => {
            console.error("failed to update Data ", err);
        })

    };

    const handleDelete = () =>{
        axios.delete(`${userAPI}/${loggedId}`).then(()=>{
            localStorage.removeItem("currentUser") ;
            alert("Account Deleted") ;
            navigate("/login") ;
            })
    } ;

    return (
        <div
            className="d-flex justify-content-center align-items-start pt-5"
            style={{ minHeight: "calc(100vh - 30px)", backgroundColor: "#FFf", width: "100%" }}
        >
            <div
                className="bg-white p-4 rounded shadow-sm w-100"
                style={{ maxWidth: "95%", minHeight: "200%" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">Account</h2>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
                </div>

                <form onSubmit={updateUser}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="fullName" className="form-label">
                                Full Name
                            </label>
                            <input
                                name="fullName"
                                type="text"
                                className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>


                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Account;