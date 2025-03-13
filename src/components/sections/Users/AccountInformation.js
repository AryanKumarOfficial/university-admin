import React from "react";

export default function AccountInformation({register, errors}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Account Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"password"} className="form-label">Account Password</label>
                        <input
                            id={"password"}
                            className="form-control"
                            type="text"
                            {...register("password")}
                        />
                        {errors.passwrod && (
                            <small className="text-danger">{errors.passwrod.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"role"} className="form-label">Role Assigned</label>
                        <select
                            id="role"
                            className="form-select"
                            {...register("role")}
                        >
                            <option value="">Select a role</option>
                            {["Admin", "Course Manager", "Professional", "Trainee", "Growth Manager", "Intern"].map((role, index) => (
                                <option key={index} value={role}>{role}</option>
                            ))}
                        </select>
                        {errors.hasWebsite && (
                            <small className="text-danger">{errors.hasWebsite.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor={"createdBy"} className="form-label">Created By</label>
                        <input
                            id={"createdBy"}
                            className="form-control"
                            type="text"
                            {...register("createdBy")}
                        />
                        {errors.createdBy && (
                            <small className="text-danger">{errors.createdBy.message}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
