import React from "react"
import Link from "next/link";

export default function NOT_FOUND() {
    return (
        <div className="auth option2">
            <div className="auth_left">
                <div className="card">
                    <div className="card-body text-center">
                        <div className="display-3 text-muted mb-5">
                            <i className="si si-exclamation"></i> 404
                        </div>
                        <h1 className="h3 mb-3">Oops.. You just found an error page..</h1>
                        <p className="h6 text-muted font-weight-normal mb-3">
                            We are sorry but our service is currently not available&hellip;
                        </p>
                        <Link className="btn btn-default" href="/">
                            <i className="fe fe-arrow-left mr-2"></i>Go back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}