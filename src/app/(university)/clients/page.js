"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, { useState, useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Modal, Button, Form } from "react-bootstrap";

const breadcrumbs = [{ label: "Clients", href: "/clients" }];

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
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const clientCollections = collection(db, "clients");
        const querySnapshot = await getDocs(clientCollections);
        const fetchedClients = [];
        querySnapshot.forEach((doc) => {
            fetchedClients.push({ ...doc.data(), id: doc.id });
        });
        setClients(fetchedClients);
    };

    // A helper for visual styling of status tags
    const getTag = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "tag-success";
            case "inactive":
                return "tag-danger";
            default:
                return "tag-default";
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedClient) {
                // Update existing client
                await updateDoc(doc(db, "clients", selectedClient.id), formData);
            } else {
                // Add new client
                await addDoc(collection(db, "clients"), formData);
            }
            await fetchClients();
            setShowModal(false);
        } catch (err) {
            console.error("Error adding/updating document: ", err);
        } finally {
            setFormData(initialFormState);
            setSelectedClient(null);
        }
        console.log("Form submitted with data:", formData);
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

    const handleEdit = (client) => {
        setSelectedClient(client);
        setFormData({
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            email: client.email || "",
            phone: client.phone || "",
            company: client.company || "",
            address: client.address || "",
            status: client.status || "",
            note: client.note || "",
            createdAt: client.createdAt || new Date().toISOString(),
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedClient(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Button variant="primary" className="rounded px-4 py-2" onClick={handleAdd}>
                        Add Client
                    </Button>
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
                                    <th>Company</th>
                                    <th>Address</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {clients.length > 0 ? (
                                    clients.map((client, index) => (
                                        <tr key={client.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {client.firstName} {client.lastName}
                                            </td>
                                            <td>{client.email}</td>
                                            <td>{client.phone}</td>
                                            <td>{client.company}</td>
                                            <td>{client.address}</td>
                                            <td>
                                                {new Date(client.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                <span className={`tag ${getTag(client.status)}`}>{client.status}</span>
                                            </td>
                                            <td>
                                                <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(client)}>
                                                    <i className="fa fa-edit"></i>
                                                </Button>{" "}
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
                                        <td colSpan={9} className="text-center">
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

            {/* Add/Edit Client Modal using React-Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)} id="clientModal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedClient ? "Edit Client" : "Add Client"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            {[
                                { id: "firstName", label: "First Name", type: "text" },
                                { id: "lastName", label: "Last Name", type: "text" },
                                { id: "email", label: "Email", type: "email" },
                                { id: "phone", label: "Phone", type: "tel" },
                                { id: "company", label: "Company", type: "text" },
                                { id: "address", label: "Address", type: "text" },
                            ].map((field, index) => (
                                <div className="col-md-6 col-sm-12" key={index}>
                                    <Form.Group className="my-2" controlId={field.id}>
                                        <Form.Label>{field.label}</Form.Label>
                                        <Form.Control type={field.type} name={field.id} value={formData[field.id]} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                            ))}
                            <div className="col-md-6 col-sm-12">
                                <Form.Group controlId="status" className="my-2">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
                                        <option value="">-- Status --</option>
                                        {["Active", "Inactive"].map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-sm-12">
                                <Form.Group controlId="note" className="my-2">
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="note"
                                        placeholder="Additional information..."
                                        value={formData.note}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <Button type="submit" variant="primary">
                                {selectedClient ? "Update" : "Submit"}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

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
