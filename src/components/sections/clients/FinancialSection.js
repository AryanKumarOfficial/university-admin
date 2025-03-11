import React from "react";

export default function FinancialSection({ register, errors }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Financial Information</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Annual School Fees</label>
                        <input className="form-control" {...register("annualFees")} />
                        {errors.annualFees && (
                            <small className="text-danger">{errors.annualFees.message}</small>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Fee Payment Frequency</label>
                        <select className="form-select" {...register("feePaymentFrequency")}>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                        </select>
                        {errors.feePaymentFrequency && (
                            <small className="text-danger">
                                {errors.feePaymentFrequency.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
