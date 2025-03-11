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
                <h6>Key Contact Person(s)</h6>
                {contactFields.map((field, index) => (
                    <div key={field.id} className="card card-body mb-2">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor={`contacts[${index}].name`} className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register(`contacts[${index}].name`)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`contacts[${index}].designation`} className="form-label">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register(`contacts[${index}].designation`)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`contacts[${index}].email`} className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    {...register(`contacts[${index}].email`)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor={`contacts[${index}].phone`} className="form-label">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    {...register(`contacts[${index}].phone`)}
                                />
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
                    onClick={() =>
                        appendContact({name: "", designation: "", email: "", phone: ""})
                    }
                >
                    + Add Contact
                </button>
            </div>
        </div>
    );
}
