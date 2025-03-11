"use client";

import React from "react";

export default function Pagination({
                                       totalItems,
                                       pageSize,
                                       currentPage,
                                       onPageChange,
                                   }) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        pages.push(p);
    }

    return (
        <div className="btn-group">
            {pages.map((p) => (
                <button
                    key={p}
                    className={`btn btn-sm ${
                        p === currentPage ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}
