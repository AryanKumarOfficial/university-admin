import React from "react";

export default function TechSystemSection({ register, errors }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Technology and Current System</h3>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Current Tools/Software Used</label>
                    <input className="form-control" {...register("currentTools")} />
                    {errors.currentTools && (
                        <small className="text-danger">{errors.currentTools.message}</small>
                    )}
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Do they have a website?</label>
                        <select className="form-select" {...register("hasWebsite")}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.hasWebsite && (
                            <small className="text-danger">{errors.hasWebsite.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Access to Internet on Campus?</label>
                        <select className="form-select" {...register("hasInternet")}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.hasInternet && (
                            <small className="text-danger">{errors.hasInternet.message}</small>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Digital Literacy Level of Staff</label>
                        <select className="form-select" {...register("digitalLiteracy")}>
                            <option value="basic">Basic</option>
                            <option value="moderate">Moderate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        {errors.digitalLiteracy && (
                            <small className="text-danger">
                                {errors.digitalLiteracy.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
