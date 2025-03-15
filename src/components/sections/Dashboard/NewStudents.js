"use client";
import React from "react";

// 1. Provide a default students array
const defaultStudentsData = [
    {
        no: 1,
        name: "Jens Brincker",
        professor: "Kenny Josh",
        dateOfAdmit: "27/05/2016",
        feesStatus: "paid",
        feesClass: "success",
        branch: "Mechanical",
    },
    {
        no: 2,
        name: "Mark Hay",
        professor: "Mark",
        dateOfAdmit: "26/05/2023",
        feesStatus: "unpaid",
        feesClass: "warning",
        branch: "Science",
    },
    {
        no: 3,
        name: "Anthony Davie",
        professor: "Cinnabar",
        dateOfAdmit: "21/05/2023",
        feesStatus: "paid",
        feesClass: "success",
        branch: "Commerce",
    },
    {
        no: 4,
        name: "David Perry",
        professor: "Felix",
        dateOfAdmit: "20/04/2024",
        feesStatus: "unpaid",
        feesClass: "danger",
        branch: "Mechanical",
    },
    {
        no: 5,
        name: "Anthony Davie",
        professor: "Beryl",
        dateOfAdmit: "24/05/2017",
        feesStatus: "paid",
        feesClass: "success",
        branch: "M.B.A.",
    },
];

/**
 * Reusable component to display a list of new students in a table.
 *
 * @param {string} title       - The card's title.
 * @param {Array}  students    - Array of student objects, each containing:
 *                                { no, name, professor, dateOfAdmit, feesStatus, feesClass, branch }
 */
export default function NewStudents({
                                        title = "New Student List",
                                        students = defaultStudentsData,
                                    }) {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{title}</h3>
                        <div className="card-options">
                            <a href="#" className="card-options-collapse" data-toggle="card-collapse">
                                <i className="fe fe-chevron-up"></i>
                            </a>
                            <a href="#" className="card-options-fullscreen" data-toggle="card-fullscreen">
                                <i className="fe fe-maximize"></i>
                            </a>
                            <a href="#" className="card-options-remove" data-toggle="card-remove">
                                <i className="fe fe-x"></i>
                            </a>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped mb-0 text-nowrap">
                                <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Assigned Professor</th>
                                    <th>Date Of Admit</th>
                                    <th>Fees</th>
                                    <th>Branch</th>
                                    <th>Edit</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((student) => (
                                    <tr key={student.no}>
                                        <td>{student.no}</td>
                                        <td>{student.name}</td>
                                        <td>{student.professor}</td>
                                        <td>{student.dateOfAdmit}</td>
                                        <td>
                        <span className={`tag tag-${student.feesClass}`}>
                          {student.feesStatus}
                        </span>
                                        </td>
                                        <td>{student.branch}</td>
                                        <td>
                                            <a href="#">
                                                <i className="fa fa-check me-3"></i>
                                            </a>
                                            <a href="#" className="ml-2">
                                                <i className="fa fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
