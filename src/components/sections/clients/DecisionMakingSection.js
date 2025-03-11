import React from "react";

export default function DecisionMakingSection({
                                                  contactFields,
                                                  appendContact,
                                                  removeContact,
                                                  register,
                                                  errors,
                                              }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Decision-Making and Influencers</h3>
            </div>
            <div className="card-body">
                {/* Key Contact Person (Dynamic Array) */}
                <h6>Key Contact Person(s)</h6>
                {contactFields.map((field, index) => (
                    <div key={field.id} className="card card-body mb-2">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    className="form-control"
                                    {...register(`contacts.${index}.name`)}
                                />
                                {errors.contacts?.[index]?.name && (
                                    <small className="text-danger">
                                        {errors.contacts[index].name.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                    className="form-control"
                                    {...register(`contacts.${index}.designation`)}
                                />
                                {errors.contacts?.[index]?.designation && (
                                    <small className="text-danger">
                                        {errors.contacts[index].designation.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-control"
                                    {...register(`contacts.${index}.email`)}
                                />
                                {errors.contacts?.[index]?.email && (
                                    <small className="text-danger">
                                        {errors.contacts[index].email.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    className="form-control"
                                    {...register(`contacts.${index}.phone`)}
                                />
                                {errors.contacts?.[index]?.phone && (
                                    <small className="text-danger">
                                        {errors.contacts[index].phone.message}
                                    </small>
                                )}
                            </div>
                        </div>
                        {contactFields.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm align-self-end"
                                onClick={() => removeContact(index)}
                            >
                                Remove Contact
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => appendContact({ name: "", designation: "", email: "", phone: "" })}
                >
                    + Add Contact
                </button>

                {/* Who Makes Purchase Decisions? */}
                <div className="mt-3">
                    <label className="form-label">Who Makes Purchase Decisions?</label>
                    <select className="form-select" {...register("purchaseDecisionBy")}>
                        <option value="principal">Principal</option>
                        <option value="school-owner">School Owner</option>
                        <option value="management">Management</option>
                        <option value="admin">Admin</option>
                        <option value="others">Others</option>
                    </select>
                    {errors.purchaseDecisionBy && (
                        <small className="text-danger">{errors.purchaseDecisionBy.message}</small>
                    )}
                </div>
            </div>
        </div>
    );
}
