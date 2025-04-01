"use client";
import React, {useMemo, useState} from "react";
import ConfirmModal from "@/components/sections/leads/ConfirmModal";
import Pagination from "@/components/sections/leads/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

export default function GenericTable({
                                         tableData = [],
                                         tableColumns = [],
                                         filterOptions = [], // e.g. [{ key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"] }]
                                         rowActions = [],
                                         initialFilterValues = {},
                                         pageSize = 5,
                                         globalActions,
                                         title = "Data",
                                     }) {
    const pathname = usePathname();
    const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    // Notification state
    const [notifications, setNotifications] = useState([]);
    // Active filters state – may contain text, select, date, etc.
    const [activeFilters, setActiveFilters] = useState(initialFilterValues);
    // Debounce text filters to avoid filtering on every keystroke.
    const debouncedFilters = useDebounce(activeFilters, 300);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    // Confirmation modal state
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Sorting state – default sort by createdAt descending.
    const [sortColumn, setSortColumn] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"

    // Notification handlers
    const addNotification = (variant, message) => {
        setNotifications((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((note) => note.id !== id));
    };

    // Handle sorting when column header is clicked
    const handleSort = (colKey) => {
        if (sortColumn === colKey) {
            // Toggle direction if the same column is clicked.
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(colKey);
            setSortDirection("asc");
        }
        setCurrentPage(1);
    };

    // Sorting the data based on sortColumn and sortDirection.
    const sortedData = useMemo(() => {
        const dataCopy = [...tableData];
        const key = sortColumn || "createdAt";
        dataCopy.sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];

            // If values are date strings, convert them to Date objects.
            if (key === "createdAt" || key === "updatedAt") {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return dataCopy;
    }, [tableData, sortColumn, sortDirection]);

    // Filtering function: Applies different logic based on filter type.
    const filterData = (data, filters) => {
        return filterOptions.reduce((filtered, filter) => {
            const filterValue = filters[filter.key];
            if (!filterValue || filterValue === "All") return filtered;

            // Apply filtering logic based on filter type.
            switch (filter.type) {
                case "text":
                    return filtered.filter((item) =>
                        String(item[filter.key] || "")
                            .toLowerCase()
                            .includes(filterValue.toLowerCase())
                    );
                case "date":
                    return filtered.filter((item) => {
                        const itemDate = new Date(item[filter.key]).toISOString().slice(0, 10);
                        return itemDate === filterValue;
                    });
                case "select":
                default:
                    return filtered.filter((item) => item[filter.key] === filterValue);
            }
        }, data);
    };

    // Apply filtering on sorted data.
    const filteredItems = useMemo(() => {
        return filterData(sortedData, debouncedFilters);
    }, [sortedData, debouncedFilters, filterOptions]);

    // Calculate pagination.
    const totalPages = Math.ceil(filteredItems.length / pageSize);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, currentPage, pageSize]);

    // Update filter values.
    const updateFilter = (key, value) => {
        setActiveFilters((prev) => ({...prev, [key]: value}));
        setCurrentPage(1);
    };

    // Reset all filters to their initial values.
    const resetFilters = () => {
        setActiveFilters(initialFilterValues);
        setCurrentPage(1);
    };

    // Handle row actions, showing confirmation if necessary.
    const handleRowAction = (action, item) => {
        if (action.requireConfirm) {
            setSelectedItem(item);
            setPendingAction(action);
            setShowConfirmation(true);
        } else {
            action.onClick(item);
        }
    };

    // Confirmation modal handler.
    const confirmHandler = async () => {
        setShowConfirmation(false);
        if (pendingAction?.onClick && selectedItem) {
            try {
                await pendingAction.onClick(selectedItem);
                addNotification("success", `${pendingAction.label} action completed.`);
            } catch (error) {
                addNotification("danger", `${pendingAction.label} action failed.`);
            }
        }
        setSelectedItem(null);
        setPendingAction(null);
    };

    return (
        <div className="section-body p-3">
            {/* Notifications */}
            {/* <AlertList alerts={notifications} removeAlert={removeNotification} /> */}

            {/* Filter Bar & Global Actions */}
            <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                <div className="d-flex gap-2 align-items-center">
                    {filterOptions.map((filter) => {
                        switch (filter.type) {
                            case "select":
                                return (
                                    <select
                                        key={filter.key}
                                        className="form-select"
                                        value={activeFilters[filter.key] || "All"}
                                        onChange={(e) => updateFilter(filter.key, e.target.value)}
                                    >
                                        <option value="All">{filter.label || filter.key}</option>
                                        {filter.options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                );
                            case "date":
                                return (
                                    <input
                                        key={filter.key}
                                        type="date"
                                        lang="en-GB"
                                        max={new Date().toISOString().slice(0, 10)}
                                        className="form-control input-group-prepend"
                                        value={activeFilters[filter.key] || ""}
                                        onChange={(e) => updateFilter(filter.key, e.target.value)}
                                    />
                                );
                            case "text":
                                return (
                                    <input
                                        key={filter.key}
                                        type="text"
                                        className="form-control"
                                        placeholder={filter.label || filter.key}
                                        value={activeFilters[filter.key] || ""}
                                        onChange={(e) => updateFilter(filter.key, e.target.value)}
                                    />
                                );
                            case "custom":
                                return (
                                    <div key={filter.key}>
                                        {filter.render
                                            ? filter.render({
                                                value: activeFilters[filter.key] || "",
                                                onChange: (newVal) => updateFilter(filter.key, newVal),
                                            })
                                            : null}
                                    </div>
                                );
                            default:
                                return (
                                    <input
                                        key={filter.key}
                                        type="text"
                                        className="form-control"
                                        placeholder={filter.label || filter.key}
                                        value={activeFilters[filter.key] || ""}
                                        onChange={(e) => updateFilter(filter.key, e.target.value)}
                                    />
                                );
                        }
                    })}
                    <button className="btn btn-danger w-100" onClick={resetFilters}>
                        Clear Filters
                    </button>
                </div>

                {/* Global actions dropdown (optional) */}
                {globalActions && globalActions.type === "link" ? (
                    <Link className="btn btn-primary px-4" href={globalActions.href}>
                        {globalActions.label}
                    </Link>
                ) : (
                    <div className="dropdown">
                        <button
                            className="btn btn-primary"
                            type="button"
                            id="globalActionsDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Global Actions
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="globalActionsDropdown">
                            {rowActions.map((action) => (
                                <li key={action.key}>
                                    <button
                                        className={`dropdown-item ${action.buttonClass || ""}`}
                                        onClick={() => action.onClick && action.onClick(null)}
                                    >
                                        {action.label ? action.label : action.icon}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Data Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mb-0 text-nowrap">
                            <thead>
                            <tr>
                                {tableColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => handleSort(col.key)}
                                        style={{cursor: "pointer"}}
                                    >
                                        {col.header}{" "}
                                        {sortColumn === col.key && (
                                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </th>
                                ))}
                                {rowActions && rowActions.length > 0 && <th>Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item) => {
                                    // Create sorted actions: convert first, then the rest.
                                    const sortedActions = [
                                        ...rowActions.filter((a) => a.key === "convert"),
                                        ...rowActions.filter((a) => a.key !== "convert"),
                                    ];
                                    return (
                                        <tr key={item.id} className={item.converted ? "table-success" : ""}>
                                            {tableColumns.map((col) => (
                                                <td key={col.key}>
                                                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                                                </td>
                                            ))}
                                            {rowActions && rowActions.length > 0 && (
                                                <td className="d-flex gap-2 justify-content-end">
                                                    {sortedActions.map((action) => {
                                                        if (action.key === "convert" && item.converted) return null;
                                                        return (
                                                            <button
                                                                key={action.key}
                                                                className={`btn btn-sm ${action.buttonClass || "btn-outline-light"}`}
                                                                onClick={() => handleRowAction(action, item)}
                                                            >
                                                                {action.icon &&
                                                                    (React.isValidElement(action.icon) ? (
                                                                        action.icon
                                                                    ) : (
                                                                        <>
                                                                            <i className={action.icon}
                                                                               style={{fontSize: "18px"}}></i>{" "}
                                                                            {action.label}
                                                                        </>
                                                                    ))}
                                                            </button>
                                                        );
                                                    })}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={tableColumns.length + 1} className="text-center">
                                        No {title} found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {filteredItems.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Pagination
                        totalItems={filteredItems.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                title={pendingAction?.title || "Confirm Action"}
                message={pendingAction?.confirmMessage || "Are you sure?"}
                onConfirm={confirmHandler}
            />
        </div>
    );
}
