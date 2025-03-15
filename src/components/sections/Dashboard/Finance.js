"use client";
import React from "react";

/**
 * A reusable component that displays multiple finance-related cards in a row.
 * @param {Array} financeData - Array of objects containing {label, color, percentage}.
 */
export default function Finance({financeData = []}) {
    return (
        <div className="row">
            {financeData.map(({label, color, percentage}) => (
                <FinanceCard
                    key={label}
                    label={label}
                    color={color}
                    percentage={percentage}
                />
            ))}
        </div>
    );
}

/**
 * A small, reusable card component that displays a label, a progress bar,
 * and a percentage comparison.
 */
function FinanceCard({label, color, percentage}) {
    return (
        <div className="col-xl-3 col-md-6 mb-2">
            <div className="card">
                <div className="card-body">
                    <div className="clearfix">
                        <div className="float-left h6">
                            <strong>{label}</strong>
                        </div>
                        <div className="float-right">
                            <small className="text-muted">{percentage}%</small>
                        </div>
                    </div>
                    <div className="progress progress-sm mt-1">
                        <div
                            className={`progress-bar bg-${color}`}
                            role="progressbar"
                            style={{width: `${percentage}%`}}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>
                    <span className="font-10">Compared to last year</span>
                </div>
            </div>
        </div>
    );
}
