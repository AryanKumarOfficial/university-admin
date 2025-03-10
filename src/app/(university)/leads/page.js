"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Button, Modal} from "react-bootstrap";
import Link from "next/link";

const breadcrumbs = [{label: "Leads", href: "/leads"}];

export default function LeadsPage() {

    const [leads, setLeads] = useState([]);

    // New state for deletion confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    useEffect(() => {
        (async () => {
            await fetchLeads();
        })()
    }, []);

    const fetchLeads = async () => {
        const leadCollections = collection(db, "leads");
        const querySnapshot = await getDocs(leadCollections);
        const fetchedLeads = [];
        querySnapshot.forEach((doc) => {
            fetchedLeads.push({...doc.data(), id: doc.id});
        });
        setLeads(fetchedLeads);
    };

    const getTag = (status) => {
        switch (status?.toLowerCase()) {
            case "new":
                return "tag-primary";
            case "contacted":
                return "tag-warning";
            case "converted":
                return "tag-success";
            default:
                return "tag-default";
        }
    };

    // Delete confirmation handler using modal
    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "leads", leadToDelete));
            await fetchLeads();
            setShowDeleteConfirm(false);
            setLeadToDelete(null);
        } catch (err) {
            console.error("Error deleting the lead: ", err);
        }
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Link href={`/leads/add`} className="btn btn-primary rounded px-4 py-2">
                        Add Lead
                    </Link>
                </div>
            </div>

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-hover table-vcenter text-nowrap table-striped mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>School</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leads.length > 0 ? (
                                    leads.map((lead, index) => (
                                        <tr key={lead.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {lead.fname} {lead.lname}
                                            </td>
                                            <td>{lead.emailId}</td>
                                            <td>{lead.phoneNumber}</td>
                                            <td>{lead.schoolName}</td>
                                            <td>
                                                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                <span
                                                    className={`tag ${getTag(lead.currentStatus)}`}>{lead.currentStatus}</span>
                                            </td>
                                            <td>
                                                <Link href={`/leads/update/${lead.id}`}
                                                      className={"btn btn-outline-primary btn-sm mr-2"}
                                                >
                                                    <i className="fa fa-edit"></i>
                                                </Link>{" "}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setLeadToDelete(lead.id);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <i className="fa fa-trash-o"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            No leads found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this lead?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
