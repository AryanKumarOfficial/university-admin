"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Button, Modal} from "react-bootstrap";
import Link from "next/link";
import {formatTime} from "@/helpers/TimeFormat";

const breadcrumbs = [{label: "Clients", href: "/clients"}];

export default function ClientsPage() {
    // Define client-related form fields
    const initialFormState = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        status: "",
        note: "",
        createdAt: new Date().toISOString(),
    };

    const [formData, setFormData] = useState(initialFormState);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    useEffect(() => {
        (async () => {
            await fetchClients();
        })()
    }, []);

    const fetchClients = async () => {
        const clientCollections = collection(db, "clients");
        const querySnapshot = await getDocs(clientCollections);
        const fetchedClients = [];
        querySnapshot.forEach((doc) => {
            fetchedClients.push({...doc.data(), id: doc.id});
        });
        setClients(fetchedClients);
    };

    // A helper for visual styling of status tags
    const getTag = (status) => {
        switch (status?.toLowerCase()) {
            case "yes":
                return "tag-success";
            case "no":
                return "tag-danger";
            default:
                return "tag-default";
        }
    };

    // Delete confirmation using modal
    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "clients", clientToDelete));
            await fetchClients();
            setShowDeleteConfirm(false);
            setClientToDelete(null);
        } catch (err) {
            console.error("Error deleting the client: ", err);
        }
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Link href={"/clients/add"} variant="primary" className="rounded px-4 py-2 btn btn-primary">
                        Add Client
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
                                    <th>School Name</th>
                                    <th>Address</th>
                                    <th>Session Starts From</th>
                                    <th>School Timing</th>
                                    <th>Students</th>
                                    <th>Annual Fee</th>
                                    <th>Website</th>
                                    <th>Contact Person</th>
                                    <th>Comment</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {clients.length > 0 ? (
                                    clients.map((client, index) => (
                                        <tr key={client.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {client.schoolName} {client.lastName}
                                            </td>
                                            <td>{client.area + ", " + client.city + ", " + client.state}</td>
                                            <td>{client.newSessionStarts}</td>
                                            <td>{formatTime(client.schoolTimingsFrom)} - {formatTime(client.schoolTimingsTo)}</td>
                                            <td>{client.numStudents}</td>
                                            <td>
                                                {client.annualFees}
                                            </td>
                                            <td>
                                                <span
                                                    className={`tag ${getTag(client.hasWebsite)} text-capitalize`}>{client.hasWebsite}</span>
                                            </td>
                                            <td>
                                                {client.contacts[0].name}{" ("}{client.contacts[0].phone}{")"}
                                            </td>
                                            <td className={"text-truncate"}>
                                                {client.comments[0].text}
                                            </td>
                                            <td>
                                                <Link href={`/clients/update/${client.id}`} className={"btn btn-outline-primary btn-sm"}
                                                >
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
                                        <td colSpan={12} className="text-center">
                                            No clients found
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
                <Modal.Body>Are you sure you want to delete this client?</Modal.Body>
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
