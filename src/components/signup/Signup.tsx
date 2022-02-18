import React from "react";
import { useNavigate } from "react-router-dom";
import contentManager from "../../contentmanager";
import "./signup.scss"

const Signup = () => {
    let [name, setName] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [errormessage, setErrormessage] = React.useState("");
    let navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, dispatch: React.Dispatch<React.SetStateAction<string>>) => {
        e.preventDefault()
        dispatch(e.target.value)
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const createUserResponse = await contentManager.createUser(name, password);

        
        if (createUserResponse) {
            setErrormessage("Name already taken");
        } else {
            navigate("/");
        }
        

    }

    return (
        <>
            <main>
                <form onSubmit={e => {e.preventDefault(); handleSubmit(e)}}>
                    <h3>Name</h3>
                    <input type="text" name="name" value={name} onChange={e => handleChange(e, setName)} />
                    <h3>Password</h3>
                    <input type="password" name="password" id="" value={password} onChange={e => handleChange(e, setPassword)} />
                    <br />
                    <button type="submit">signup</button>
                    <p>already have an account? <a href="/login">login</a></p>

                    <p className="error-text">{errormessage}</p>
                    
                </form>
            </main>
        </>
    )
}

export default Signup;