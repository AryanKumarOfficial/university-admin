"use client";

import React from "react";

export default function BasicInfoSection({register, errors, title}) {

    // Fetch the available colleges from the "leads-tnp" collection

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">{title} Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Name */}
                    <div className="col-md-12 mb-3">
                        <label htmlFor={"name"} className="form-label">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            {...register("name")}
                            autoComplete={"address"}
                        />
                        {errors.name && (
                            <small className="text-danger">{errors.name.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
