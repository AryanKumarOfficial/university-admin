"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useAuthStore} from "@/stores/auth-store";
import {useRouter} from "next/navigation";

export default function Page() {
    const {signIn, error, loading} = useAuthStore();
    const [formState, setFormState] = useState({email: "", password: ""});
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(formState.email, formState.password);
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const onChange = (e) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="auth option2">
            <div className="auth_left">
                <div className="card">
                    <div id="main" className="card-body">
                        <div className="text-center">
                            <Link className="header-brand" href="/">
                                <i className="fa fa-graduation-cap brand-logo"></i>
                            </Link>
                            <div className="card-title mt-3">Login to your account</div>
                            {/*<button type="button" className="btn btn-google">*/}
                            {/*    <i className="fa fa-google mr-2"></i> Login with Google*/}
                            {/*</button>*/}
                            {/*<h6 className="mt-3 mb-3">Or</h6>*/}
                        </div>

                        <form id="loginForm" onSubmit={handleSubmit}
                              className={"flex justify-content-center align-items-center flex-column"}>
                            <div className="form-group my-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formState.email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group my-4">
                                <label className="form-label">
                                    {/*<Link href="/forgot-password" className="small"*/}
                                    {/*      style={{*/}
                                    {/*          float: "right",*/}
                                    {/*          textDecoration: "none",*/}
                                    {/*          margin: "5px 0",*/}
                                    {/*      }}*/}
                                    {/*>*/}
                                    {/*    I forgot password*/}
                                    {/*</Link>*/}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    value={formState.password}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="text-center d-flex flex-column justify-content-between">
                                <button type="submit" className="btn btn-primary btn-block mt-2">
                                    {loading ? <i className="fa fa-spinner fa-spin"/> : "Login"}
                                </button>
                                {error && <p className="text-danger mt-2">{error}</p>}
                                {/*<div className="text-muted mt-4">*/}
                                {/*    Don't have an account?{" "}*/}
                                {/*    <Link href="/register" style={{*/}
                                {/*        textDecoration: "none",*/}
                                {/*    }}>Sign up</Link>*/}
                                {/*</div>*/}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
