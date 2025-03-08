"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, { useState, useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Modal, Button, Form } from "react-bootstrap";

const breadcrumbs = [{ label: "Teachers", href: "/teachers" }];

export default function TeachersPage() {
    const initialFormState = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        department: "",
        qualification: "",
        status: "",
        note: "",
        createdAt: new Date().toISOString(),
    };

    const [formData, setFormData] = useState(initialFormState);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        const teacherCollections = collection(db, "teachers");
        const querySnapshot = await getDocs(teacherCollections);
        const fetchedTeachers = [];
        querySnapshot.forEach((doc) => {
            fetchedTeachers.push({ ...doc.data(), id: doc.id });
        });
        setTeachers(fetchedTeachers);
    };

    // Helper for styling status tags
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
            if (selectedTeacher) {
                // Update teacher record
                await updateDoc(doc(db, "teachers", selectedTeacher.id), formData);
            } else {
                // Add new teacher
                await addDoc(collection(db, "teachers"), formData);
            }
            await fetchTeachers();
            setShowModal(false);
        } catch (err) {
            console.error("Error adding/updating teacher: ", err);
        } finally {
            setFormData(initialFormState);
            setSelectedTeacher(null);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "teachers", teacherToDelete));
            await fetchTeachers();
            setShowDeleteConfirm(false);
            setTeacherToDelete(null);
        } catch (err) {
            console.error("Error deleting teacher: ", err);
        }
    };

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            firstName: teacher.firstName || "",
            lastName: teacher.lastName || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            subject: teacher.subject || "",
            department: teacher.department || "",
            qualification: teacher.qualification || "",
            status: teacher.status || "",
            note: teacher.note || "",
            createdAt: teacher.createdAt || new Date().toISOString(),
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedTeacher(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Button variant="primary" className="rounded px-4 py-2" onClick={handleAdd}>
                        Add Teacher
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
                                    <th>Subject</th>
                                    <th>Department</th>
                                    <th>Qualification</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {teachers.length > 0 ? (
                                    teachers.map((teacher, index) => (
                                        <tr key={teacher.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {teacher.firstName} {teacher.lastName}
                                            </td>
                                            <td>{teacher.email}</td>
                                            <td>{teacher.phone}</td>
                                            <td>{teacher.subject}</td>
                                            <td>{teacher.department}</td>
                                            <td>{teacher.qualification}</td>
                                            <td>
                                                {new Date(teacher.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                <span className={`tag ${getTag(teacher.status)}`}>{teacher.status}</span>
                                            </td>
                                            <td>
                                                <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(teacher)}>
                                                    <i className="fa fa-edit"></i>
                                                </Button>{" "}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setTeacherToDelete(teacher.id);
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
                                        <td colSpan={10} className="text-center">
                                            No teachers found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Teacher Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} id="teacherModal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTeacher ? "Edit Teacher" : "Add Teacher"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            {[
                                { id: "firstName", label: "First Name", type: "text" },
                                { id: "lastName", label: "Last Name", type: "text" },
                                { id: "email", label: "Email", type: "email" },
                                { id: "phone", label: "Phone", type: "tel" },
                                { id: "subject", label: "Subject", type: "text" },
                                { id: "department", label: "Department", type: "text" },
                                { id: "qualification", label: "Qualification", type: "text" },
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
                                    <Form.Control as="textarea" rows={4} name="note" placeholder="Additional information..." value={formData.note} onChange={handleChange} />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <Button type="submit" variant="primary">
                                {selectedTeacher ? "Update" : "Submit"}
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
                <Modal.Body>Are you sure you want to delete this teacher?</Modal.Body>
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
