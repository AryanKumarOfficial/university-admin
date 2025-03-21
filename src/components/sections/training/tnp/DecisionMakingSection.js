import React from "react";

export default function DecisionMakingSection({register, errors}) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Decision-Making and Influencers</h3>
            </div>
            <div className="card-body">
                <h6>Key Contact Person</h6>
                <div className="card card-body">
                    <div className="row">
                        {/* Contact Name */}
                        <div className="col-md-6">
                            <label htmlFor="contactName" className="form-label">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("contactName")}
                            />
                            {errors.contactName && (
                                <small className="text-danger">{errors.contactName.message}</small>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div className="col-md-6">
                            <label htmlFor="contactNumber" className="form-label">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                {...register("contactNumber")}
                            />
                            {errors.contactNumber && (
                                <small className="text-danger">{errors.contactNumber.message}</small>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
