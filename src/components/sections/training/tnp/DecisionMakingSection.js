"use client";

import React from "react";
import {useFieldArray} from "react-hook-form";

export default function DecisionMakingSection({register, errors, control}) {
    const {fields, append, remove} = useFieldArray({
        control,
        name: "contacts",
    });

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Decision-Making and Influencers</h3>
            </div>
            <div className="card-body">
                {fields.map((field, index) => (
                    <div key={field.id} className="card card-body mb-3">
                        <h6>Contact {index + 1}</h6>
                        <div className="row">
                            {/* Contact Name */}
                            <div className="col-md-6">
                                <label htmlFor={`contacts.${index}.contactName`} className="form-label">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register(`contacts.${index}.contactName`)}
                                    defaultValue={field.contactName}
                                />
                                {errors.contacts &&
                                    errors.contacts[index] &&
                                    errors.contacts[index].contactName && (
                                        <small className="text-danger">
                                            {errors.contacts[index].contactName.message}
                                        </small>
                                    )}
                            </div>

                            {/* Contact Number */}
                            <div className="col-md-6">
                                <label htmlFor={`contacts.${index}.contactNumber`} className="form-label">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    {...register(`contacts.${index}.contactNumber`)}
                                    defaultValue={field.contactNumber}
                                />
                                {errors.contacts &&
                                    errors.contacts[index] &&
                                    errors.contacts[index].contactNumber && (
                                        <small className="text-danger">
                                            {errors.contacts[index].contactNumber.message}
                                        </small>
                                    )}
                            </div>
                        </div>
                        <div className="mt-2">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                            >
                                Remove Contact
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => append({contactName: "", contactNumber: ""})}
                >
                    Add Contact
                </button>
            </div>
        </div>
    );
}
