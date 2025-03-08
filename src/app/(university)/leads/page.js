"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Button, Form, Modal} from "react-bootstrap";

const breadcrumbs = [{label: "Leads", href: "/leads"}];

export default function LeadsPage() {
    const initialFormState = {
        fname: "",
        lname: "",
        emailId: "",
        phoneNumber: "",
        schoolName: "",
        currentStatus: "",
        note: "",
        createdAt: new Date().toISOString(),
    };

    const [formData, setFormData] = useState(initialFormState);
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // New state for deletion confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    useEffect(() => {
        fetchLeads();
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

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedLead) {
                // Update lead
                await updateDoc(doc(db, "leads", selectedLead.id), formData);
            } else {
                // Add new lead
                await addDoc(collection(db, "leads"), formData);
            }
            await fetchLeads();
            setShowModal(false);
        } catch (err) {
            console.error("Error adding/updating document: ", err);
        } finally {
            setFormData(initialFormState);
            setSelectedLead(null);
        }
        console.log("Form submitted with data:", formData);
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

    const handleEdit = (lead) => {
        setSelectedLead(lead);
        setFormData({
            fname: lead.fname || "",
            lname: lead.lname || "",
            emailId: lead.emailId || "",
            phoneNumber: lead.phoneNumber || "",
            schoolName: lead.schoolName || "",
            currentStatus: lead.currentStatus || "",
            note: lead.note || "",
            createdAt: lead.createdAt || new Date().toISOString(),
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedLead(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Button variant="primary" className="rounded px-4 py-2" onClick={handleAdd}>
                        Add
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
                                                <Button variant="outline-secondary" size="sm"
                                                        onClick={() => handleEdit(lead)}>
                                                    <i className="fa fa-edit"></i>
                                                </Button>{" "}
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

            {/* Add/Edit Lead Modal using React-Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)} id="leadModal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedLead ? "Edit Lead" : "Add a Lead"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            {[
                                {id: "fname", label: "First Name", type: "text"},
                                {id: "lname", label: "Last Name", type: "text"},
                                {id: "emailId", label: "Email ID", type: "email"},
                                {id: "phoneNumber", label: "Phone Number", type: "tel"},
                                {id: "schoolName", label: "School Name", type: "text"},
                            ].map((field, index) => (
                                <div className="col-md-6 col-sm-12" key={index}>
                                    <Form.Group className="my-2" controlId={field.id}>
                                        <Form.Label>{field.label}</Form.Label>
                                        <Form.Control type={field.type} name={field.id} value={formData[field.id]}
                                                      onChange={handleChange}/>
                                    </Form.Group>
                                </div>
                            ))}
                            <div className="col-md-6 col-sm-12">
                                <Form.Group controlId="currentStatus" className="my-2">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" name="currentStatus" value={formData.currentStatus}
                                                  onChange={handleChange}>
                                        <option value="">-- Status --</option>
                                        {["New", "Contacted", "Qualified", "Unqualified", "Follow-Up", "In Progress", "Converted", "Lost"].map(
                                            (status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-sm-12">
                                <Form.Group controlId="note" className="my-2">
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="note"
                                                  placeholder="Additional information..." value={formData.note}
                                                  onChange={handleChange}/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <Button type="submit" variant="primary">
                                {selectedLead ? "Update" : "Submit"}
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
