import React from "react";

export default function MiscSection({
                                        competitorFields,
                                        appendCompetitor,
                                        removeCompetitor,
                                        register,
                                        errors,
                                    }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Miscellaneous</h3>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">
                        Specific Needs Highlighted by the School
                    </label>
                    <textarea className="form-control" rows={2} {...register("specificNeeds")} />
                    {errors.specificNeeds && (
                        <small className="text-danger">{errors.specificNeeds.message}</small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Any Known Pain Points</label>
                    <textarea className="form-control" rows={2} {...register("knownPainPoints")} />
                    {errors.knownPainPoints && (
                        <small className="text-danger">{errors.knownPainPoints.message}</small>
                    )}
                </div>

                {/* Communication Channels */}
                <div className="mb-3">
                    <label className="form-label">
                        Preferred Communication Channels with Parents
                    </label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value="whatsapp"
                            {...register("communicationChannels")}
                        />
                        <label className="form-check-label">WhatsApp</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value="phone-call"
                            {...register("communicationChannels")}
                        />
                        <label className="form-check-label">Phone Call</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value="email"
                            {...register("communicationChannels")}
                        />
                        <label className="form-check-label">Email</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value="others"
                            {...register("communicationChannels")}
                        />
                        <label className="form-check-label">Others</label>
                    </div>
                    {errors.communicationChannels && (
                        <small className="text-danger">
                            {errors.communicationChannels.message}
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Unique Selling Proposition (USP)</label>
                    <textarea className="form-control" rows={2} {...register("usp")} />
                    {errors.usp && <small className="text-danger">{errors.usp.message}</small>}
                </div>

                {/* Competitor Schools (Dynamic Array) */}
                <h6>Competitor Schools Nearby</h6>
                {competitorFields.map((field, index) => (
                    <div key={field.id} className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter competitor school name"
                            {...register(`competitorSchools.${index}`)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeCompetitor(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => appendCompetitor("")}
                >
                    + Add Competitor
                </button>

                <div className="mb-3 mt-3">
                    <label className="form-label">
                        Any Plans for Expansion or Upgrades (Optional)
                    </label>
                    <textarea className="form-control" rows={2} {...register("expansionPlans")} />
                </div>
            </div>
        </div>
    );
}
