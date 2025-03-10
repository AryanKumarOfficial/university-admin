"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Button, Modal} from "react-bootstrap";
import Link from "next/link";
import {formatTime} from "@/helpers/TimeFormat";

const breadcrumbs = [{label: "Leads", href: "/leads"}];

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const leadsCollections = collection(db, "leads");
        const querySnapshot = await getDocs(leadsCollections);
        const fetchedLeads = [];
        querySnapshot.forEach((doc) => {
            fetchedLeads.push({...doc.data(), id: doc.id});
        });
        setLeads(fetchedLeads);
    };


    const confirmDelete = async () => {
        await deleteDoc(doc(db, "leads", clientToDelete));
        fetchClients();
        setShowDeleteConfirm(false);
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Link href={"/leads/add"} className="btn btn-primary rounded px-4 py-2">
                        Add a new Lead
                    </Link>
                </div>
            </div>

            <div className="section-body mt-4">
                <div className="container-fluid">
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table table-hover table-vcenter table-responsive table-striped table-custom2 text-nowrap table-striped mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>School Name</th>
                                    <th>Contact Person</th>
                                    <th>Contact Number</th>
                                    <th>Location</th>
                                    <th>Number of Students</th>
                                    <th>Annual Fees</th>
                                    <th>Website</th>
                                    <th>Follow Up</th>
                                    <th>Date & Time</th>
                                    <th>Comments</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leads.length > 0 ? (
                                    leads.map((client, index) => (
                                        <tr key={client.id}>
                                            <td>{index + 1}</td>
                                            <td>{client.schoolName}</td>
                                            <td>{client.contacts[0]?.name}</td>
                                            <td>{client.contacts[0]?.phone}</td>
                                            <td>{client.state}, {client.city}, {client.area}</td>
                                            <td>{client.numStudents}</td>
                                            <td>{client.annualFees}</td>
                                            <td>{client.hasWebsite === "yes" ? "Yes" : "No"}</td>
                                            <td>
                                                {client.response}
                                            </td>
                                            <td>
                                                {client.response === "Call later" ? (
                                                    new Date(client.followUpDate).toLocaleString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }) + " - " + formatTime(client.followUpTime)
                                                ) : (
                                                    new Date(client.createdAt).toLocaleString()
                                                )}
                                            </td>
                                            <td>{client.comments[0].text || "No comments"}</td>
                                            <td>
                                                <Link href={`/leads/update/${client.id}`}
                                                      className="btn btn-outline-primary btn-sm">
                                                    <i className="fa fa-edit"></i>
                                                </Link>{" "}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setClientToDelete(client.id);
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
                                        <td colSpan={12} className="text-center">No Leads found</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

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
