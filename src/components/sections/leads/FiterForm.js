"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FilterForm({
                                       defaultSearch,
                                       defaultFilterResponse,
                                       defaultSortBy,
                                       defaultSortDir,
                                   }) {
    const router = useRouter();

    // Local states mirror the query param fields
    const [search, setSearch] = useState(defaultSearch || "");
    const [filterResponse, setFilterResponse] = useState(defaultFilterResponse || "all");
    const [sortBy, setSortBy] = useState(defaultSortBy || "createdAt");
    const [sortDir, setSortDir] = useState(defaultSortDir || "desc");

    /**
     * Whenever any field changes, we update the URL query params
     * to reflect the new state. This triggers the server component
     * to re-run with updated searchParams.
     */
    useEffect(() => {
        // Build new query string
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (filterResponse !== "all") params.set("filterResponse", filterResponse);
        if (sortBy !== "createdAt") params.set("sortBy", sortBy);
        if (sortDir !== "desc") params.set("sortDir", sortDir);

        // We keep page=1 whenever user changes filters or sort
        // to avoid landing on an out-of-range page
        params.set("page", "1");

        // Navigate to /leads?whatever=...
        router.push(`/leads?${params.toString()}`);
        // We re-run whenever the user changes any field
    }, [search, filterResponse, sortBy, sortDir, router]);

    return (
        <div className="d-flex gap-2 mb-2">
            {/* Search */}
            <input
                type="text"
                className="form-control w-auto"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Filter by response */}
            <select
                className="form-select w-auto"
                value={filterResponse}
                onChange={(e) => setFilterResponse(e.target.value)}
            >
                <option value="all">All Responses</option>
                <option value="Call later">Call later</option>
                <option value="Not interested">Not interested</option>
                <option value="Completed">Completed</option>
            </select>

            {/* Sort by */}
            <select
                className="form-select w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="createdAt">Created At</option>
                <option value="updatedAt">Updated At</option>
                <option value="schoolName">School Name</option>
            </select>

            {/* Sort direction */}
            <select
                className="form-select w-auto"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
            >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
            </select>
        </div>
    );
}
