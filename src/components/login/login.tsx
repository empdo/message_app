import React from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import contentManager from "../../contentmanager";
import { useToken } from "../../App";

const Login = () => {

    let [name, setName] = React.useState("");
    let [password, setPassword] = React.useState("");
    let navigate = useNavigate();
    
    const token = useToken();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, dispatch: React.Dispatch<React.SetStateAction<string>>) => {
        e.preventDefault()
        dispatch(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await contentManager.setToken(name, password);

        navigate("/");
    }


    React.useEffect(() => {
        if(token) {
            navigate("/");
        }
    }, [token]);

    return (
        <main>
            <form onSubmit={e => handleSubmit(e)}>
                <h3>Name</h3>
                <input type="text" name="name" value={name} onChange={e => handleChange(e, setName)} />
                <h3>Password</h3>
                <input type="password" name="password" id="" value={password} onChange={e => handleChange(e, setPassword)} />
                <br />
                <button type="submit">login</button>
                <a href="/signup">Create an account</a>
            </form>
        </main>
    );
}

export default Login;