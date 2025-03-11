"use server";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { formatTime } from "@/helpers/TimeFormat";
import { db } from "@/lib/firebase/client";

// We import the new client component
import FilterForm from "@/components/sections/leads/FiterForm";

/**
 * fetchLeads:
 *  - Retrieves leads from Firestore
 *  - In-memory searching, filtering, sorting, pagination
 */
async function fetchLeads({
                              search = "",
                              filterResponse = "all",
                              sortBy = "createdAt",
                              sortDir = "desc",
                              page = 1,
                              pageSize = 5,
                          }) {
    // ... same logic as before ...
    try {
        const snapshot = await getDocs(collection(db, "leads"));
        let leads = [];
        snapshot.forEach((docSnap) => {
            leads.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Searching by schoolName or contact name
        if (search.trim()) {
            leads = leads.filter((lead) => {
                const nameMatch = lead.schoolName?.toLowerCase().includes(search.toLowerCase());
                const contactMatch = lead.contacts?.[0]?.name?.toLowerCase().includes(search.toLowerCase());
                return nameMatch || contactMatch;
            });
        }

        // Filtering by response
        if (filterResponse && filterResponse !== "all") {
            leads = leads.filter((lead) => lead.response === filterResponse);
        }

        // Sorting
        leads.sort((a, b) => {
            let valA = a[sortBy] || 0;
            let valB = b[sortBy] || 0;

            if (sortBy === "createdAt" || sortBy === "updatedAt") {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA < valB) return sortDir === "asc" ? -1 : 1;
            if (valA > valB) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedLeads = leads.slice(startIndex, endIndex);

        return {
            leads: pagedLeads,
            total: leads.length,
        };
    } catch (err) {
        console.error("fetchLeads error:", err);
        throw new Error("Failed to fetch leads");
    }
}

// Mark a lead as complete
export async function markLeadAsComplete(formData) {
    "use server";
    try {
        const leadId = formData.get("leadId");
        const docRef = doc(db, "leads", leadId);
        await updateDoc(docRef, {
            response: "Completed",
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Error marking lead as complete:", err);
        throw err;
    }
}

// Delete a lead
export async function deleteLead(formData) {
    "use server";
    try {
        const leadId = formData.get("leadId");
        const docRef = doc(db, "leads", leadId);
        await deleteDoc(docRef);
    } catch (err) {
        console.error("Error deleting lead:", err);
        throw err;
    }
}

export default async function LeadsPage({ searchParams }) {
    const {
        search = "",
        filterResponse = "all",
        sortBy = "createdAt",
        sortDir = "desc",
        page = "1",
        pageSize = "5",
    } = searchParams || {};

    let leadsData;
    try {
        leadsData = await fetchLeads({
            search,
            filterResponse,
            sortBy,
            sortDir,
            page: parseInt(page, 10),
            pageSize: parseInt(pageSize, 10),
        });
    } catch (err) {
        return <div className="text-danger m-4">Failed to load leads. Please try again later.</div>;
    }

    const leads = leadsData.leads;
    const total = leadsData.total;

    const currentPage = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const totalPages = Math.ceil(total / size);

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={[{ label: "Leads", href: "/leads" }]} />

            {/* We remove the old <form> approach and just render FilterForm */}
            <div className="section-body p-3">
                <div className="container-fluid d-flex flex-column gap-2">
                    <FilterForm
                        defaultSearch={search}
                        defaultFilterResponse={filterResponse}
                        defaultSortBy={sortBy}
                        defaultSortDir={sortDir}
                    />
                    <div className="d-flex justify-content-end">
                        <Link href="/leads/add" className="btn btn-primary rounded px-4 py-2">
                            Add a new Lead
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pagination UI */}
            <div className="section-body px-3">
                <div className="container-fluid d-flex justify-content-end mb-2">
                    {total > 0 && (
                        <div>
                            Page {currentPage} of {totalPages}
                            <div className="btn-group ms-2">
                                {currentPage > 1 && (
                                    <Link
                                        href={`/leads?search=${search}&filterResponse=${filterResponse}&sortBy=${sortBy}&sortDir=${sortDir}&page=${
                                            currentPage - 1
                                        }&pageSize=${pageSize}`}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        Prev
                                    </Link>
                                )}
                                {currentPage < totalPages && (
                                    <Link
                                        href={`/leads?search=${search}&filterResponse=${filterResponse}&sortBy=${sortBy}&sortDir=${sortDir}&page=${
                                            currentPage + 1
                                        }&pageSize=${pageSize}`}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="section-body mt-2">
                <div className="container-fluid">
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-hover table-vcenter text-nowrap table-striped mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>School Name</th>
                                    <th>Contact Person</th>
                                    <th>Contact Number</th>
                                    <th>Location</th>
                                    <th>Students</th>
                                    <th>Annual Fees</th>
                                    <th>Website</th>
                                    <th>Response</th>
                                    <th>Date & Time</th>
                                    <th>Comments</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leads.length > 0 ? (
                                    leads.map((lead, index) => {
                                        // example color-coding logic
                                        let rowClass = "";
                                        if (lead.response === "Call later") {
                                            const isOverdue =
                                                lead.followUpDate && new Date(lead.followUpDate) < new Date();
                                            rowClass = isOverdue ? "table-danger" : "table-warning";
                                        } else if (lead.response === "Not interested") {
                                            rowClass = "table-secondary";
                                        } else if (lead.response === "Completed") {
                                            rowClass = "table-success";
                                        }

                                        return (
                                            <tr key={lead.id} className={rowClass}>
                                                <td>{(currentPage - 1) * size + (index + 1)}</td>
                                                <td>{lead.schoolName}</td>
                                                <td>{lead.contacts?.[0]?.name || "N/A"}</td>
                                                <td>{lead.contacts?.[0]?.phone || "N/A"}</td>
                                                <td>
                                                    {lead.state}, {lead.city}, {lead.area}
                                                </td>
                                                <td>{lead.numStudents}</td>
                                                <td>{lead.annualFees}</td>
                                                <td>{lead.hasWebsite === "yes" ? "Yes" : "No"}</td>
                                                <td>{lead.response}</td>
                                                <td>{renderDateTime(lead)}</td>
                                                <td>{renderFirstComment(lead)}</td>
                                                <td>
                                                    {lead.createdAt
                                                        ? new Date(lead.createdAt).toLocaleString()
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {lead.updatedAt
                                                        ? new Date(lead.updatedAt).toLocaleString()
                                                        : "N/A"}
                                                </td>
                                                <td className="d-flex gap-2">
                                                    <Link
                                                        href={`/leads/update/${lead.id}`}
                                                        className="btn btn-outline-primary btn-sm"
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </Link>

                                                    {lead.response !== "Completed" && (
                                                        <form action={markLeadAsComplete} method="post">
                                                            <input type="hidden" name="leadId" value={lead.id} />
                                                            <button
                                                                type="submit"
                                                                className="btn btn-outline-success btn-sm"
                                                            >
                                                                <i className="fa fa-check"></i>
                                                            </button>
                                                        </form>
                                                    )}

                                                    <form action={deleteLead} method="post">
                                                        <input type="hidden" name="leadId" value={lead.id} />
                                                        <button
                                                            type="submit"
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            <i className="fa fa-trash-o"></i>
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={14} className="text-center">
                                            No Leads found.{" "}
                                            <Link href="/leads/add" className="fw-bold">
                                                Add one now!
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Renders date/time logic:
 * - "Call later" => formatted date/time
 * - "Not interested" => "No follow-up scheduled"
 * - "Completed" => blank
 * - Otherwise => "N/A"
 */
function renderDateTime(lead) {
    if (lead.response === "Call later") {
        const datePart = new Date(lead.followUpDate).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const timePart = formatTime(lead.followUpTime);
        return `${datePart} - ${timePart}`;
    } else if (lead.response === "Not interested") {
        return "No follow-up scheduled";
    } else if (lead.response === "Completed") {
        return "";
    }
    return "N/A";
}

function renderFirstComment(lead) {
    if (Array.isArray(lead.comments) && lead.comments.length > 0) {
        if (typeof lead.comments[0] === "object") {
            return lead.comments[0].text || "No comments";
        }
        return lead.comments[0] || "No comments";
    }
    return "No comments";
}
