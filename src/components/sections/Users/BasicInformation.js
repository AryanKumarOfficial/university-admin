import React from "react";

export default function BasicInformation({register, errors}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Basic Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"name"} className="form-label">User Name</label>
                        <input
                            id={"name"}
                            className="form-control"
                            type="text"
                            {...register("name")}
                        />
                        {errors.name && (
                            <small className="text-danger">{errors.name.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"email"} className="form-label">User Email ID</label>
                        <input
                            id={"email"}
                            className="form-control"
                            type="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <small className="text-danger">{errors.email.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"phoneNumber"} className="form-label">User Phone Number</label>
                        <input
                            id={"phoneNumber"}
                            className="form-control"
                            type="tel"
                            {...register("phone")}
                        />
                        {errors.phone && (
                            <small className="text-danger">{errors.phone.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
