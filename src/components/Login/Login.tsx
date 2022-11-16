import * as React from "react";
import { useState } from "react";
import style from "./Login.module.css";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const signIn = UserAuth()?.signIn;
    const navigate = useNavigate();
    const handleSubmit = async () => {

        try {
        if (signIn !== undefined) {
            await signIn(email,password);
            navigate("/home");
        }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                setError(error.message);
            } else {
                console.log("Unexpected error", error);
                setError("Unexpected Error");
            }
        }
    };
    return (
        <div className={style.box}>
        <h1 className={style.heading}>Login</h1>
        <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
        }}>
            <label>Email</label>
            <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                    />
            <label>Password</label>
            <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            {error !== "" && <p>{ error }</p>}
            <input type="submit" className={style.submit} />
        </form>
        </div>
    );
}
