"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React, {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import {Button, Form, Modal} from "react-bootstrap";

const breadcrumbs = [{label: "Students", href: "/students"}];

export default function StudentsPage() {
    // Define initial state with student-relevant fields
    const initialFormState = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        grade: "",
        section: "",
        status: "",
        note: "",
        createdAt: new Date().toISOString(),
    };

    const [formData, setFormData] = useState(initialFormState);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const studentCollections = collection(db, "students");
        const querySnapshot = await getDocs(studentCollections);
        const fetchedStudents = [];
        querySnapshot.forEach((doc) => {
            fetchedStudents.push({...doc.data(), id: doc.id});
        });
        setStudents(fetchedStudents);
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
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedStudent) {
                // Update existing student record
                await updateDoc(doc(db, "students", selectedStudent.id), formData);
            } else {
                // Add new student record
                await addDoc(collection(db, "students"), formData);
            }
            await fetchStudents();
            setShowModal(false);
        } catch (err) {
            console.error("Error adding/updating student: ", err);
        } finally {
            setFormData(initialFormState);
            setSelectedStudent(null);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "students", studentToDelete));
            await fetchStudents();
            setShowDeleteConfirm(false);
            setStudentToDelete(null);
        } catch (err) {
            console.error("Error deleting student: ", err);
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setFormData({
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            email: student.email || "",
            phone: student.phone || "",
            grade: student.grade || "",
            section: student.section || "",
            status: student.status || "",
            note: student.note || "",
            createdAt: student.createdAt || new Date().toISOString(),
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedStudent(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    return (
        <div className="page vh-100">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className="section-body">
                <div className="container-fluid d-flex justify-content-end">
                    <Button variant="primary" className="rounded px-4 py-2" onClick={handleAdd}>
                        Add Student
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
                                    <th>Grade</th>
                                    <th>Section</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.id}>
                                            <td>{index + 1}</td>
                                            <td>{student.firstName} {student.lastName}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone}</td>
                                            <td>{student.grade}</td>
                                            <td>{student.section}</td>
                                            <td>
                                                {new Date(student.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                <span
                                                    className={`tag ${getTag(student.status)}`}>{student.status}</span>
                                            </td>
                                            <td>
                                                <Button variant="outline-secondary" size="sm"
                                                        onClick={() => handleEdit(student)}>
                                                    <i className="fa fa-edit"></i>
                                                </Button>{" "}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setStudentToDelete(student.id);
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
                                            No students found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Student Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} id="studentModal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedStudent ? "Edit Student" : "Add Student"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            {[
                                {id: "firstName", label: "First Name", type: "text"},
                                {id: "lastName", label: "Last Name", type: "text"},
                                {id: "email", label: "Email", type: "email"},
                                {id: "phone", label: "Phone", type: "tel"},
                                {id: "grade", label: "Grade", type: "text"},
                                {id: "section", label: "Section", type: "text"},
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
                                <Form.Group controlId="status" className="my-2">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" name="status" value={formData.status}
                                                  onChange={handleChange}>
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
                                {selectedStudent ? "Update" : "Submit"}
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
                <Modal.Body>Are you sure you want to delete this student?</Modal.Body>
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
