import React from "react";
import "./login.scss";
import { Navigate, useNavigate } from "react-router-dom";
import contentManager from "../../contentmanager";

const Login = () => {

    let [name, setName] = React.useState("");
    let [password, setPassword] = React.useState("");
    let navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, dispatch: React.Dispatch<React.SetStateAction<string>>) => {
        e.preventDefault()
        dispatch(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        contentManager.setToken(name, password);

        navigate("/");

    }

    return (
        <main>
            <form onSubmit={e => handleSubmit(e)}>
                <h3>Name</h3>
                <input type="text" name="name" value={name} onChange={e => handleChange(e, setName)} />
                <h3>Password</h3>
                <input type="password" name="password" id="" value={password} onChange={e => handleChange(e, setPassword)} />
                <br />
                <button type="submit">login</button>
                <p>Create an account</p>
            </form>
        </main>
    );
}

export default Login;