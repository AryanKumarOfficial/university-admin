"use client";
import React from "react";

// Expanded toppers data
const defaultToppers = [
    {
        no: 11,
        avatar: "/assets/images/xs/avatar1.jpg",
        name: "Merri Diamond",
        subtitle: "Science",
        marks: 199,
        percentage: "99.00",
    },
    {
        no: 23,
        avatar: "/assets/images/xs/avatar2.jpg",
        name: "Sara Hopkins",
        subtitle: "Mechanical",
        marks: 197,
        percentage: "98.00",
    },
    {
        no: 41,
        avatar: "/assets/images/xs/avatar3.jpg",
        name: "Allen Collins",
        subtitle: "M.C.A.",
        marks: 197,
        percentage: "98.00",
    },
    {
        no: 17,
        avatar: "/assets/images/xs/avatar4.jpg",
        name: "Erin Gonzales",
        subtitle: "Arts",
        marks: 194,
        percentage: "97.00",
    },
    {
        no: 57,
        avatar: "/assets/images/xs/avatar5.jpg",
        name: "Claire Peters",
        subtitle: "Science",
        marks: 192,
        percentage: "95.00",
    },
    {
        no: 72,
        avatar: "/assets/images/xs/avatar8.jpg",
        name: "Dylan Hunt",
        subtitle: "Mechanical",
        marks: 188,
        percentage: "94.00",
    },
    {
        no: 85,
        avatar: "/assets/images/xs/avatar6.jpg",
        name: "John Carter",
        subtitle: "Science",
        marks: 192,
        percentage: "95.00",
    },
    {
        no: 93,
        avatar: "/assets/images/xs/avatar9.jpg",
        name: "Caroline Rice",
        subtitle: "Computer Science",
        marks: 186,
        percentage: "93.00",
    },
    {
        no: 9,
        avatar: "/assets/images/xs/avatar7.jpg",
        name: "Alex Morgan",
        subtitle: "Science",
        marks: 191,
        percentage: "95.00",
    },
    {
        no: 101,
        avatar: "/assets/images/xs/avatar10.jpg",
        name: "Nathan Perez",
        subtitle: "Commerce",
        marks: 185,
        percentage: "92.50",
    },
];

/**
 * A reusable "Exam Toppers" component that displays a scrollable table of student data.
 * @param {string} title - Card title
 * @param {Array} toppers - Array of topper objects:
 *    { no, avatar, name, subtitle, marks, percentage }
 */
export default function ExamToppers({
                                        title = "Exam Toppers",
                                        toppers = defaultToppers,
                                    }) {
    return (
        <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    <div className="card-options">
                        <a href="#" className="card-options-collapse" data-toggle="card-collapse">
                            <i className="fe fe-chevron-up"></i>
                        </a>
                        <div className="item-action dropdown ml-2">
                            <a href="#" data-toggle="dropdown">
                                <i className="fe fe-more-vertical"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-eye"></i> View Details
                                </a>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-share-alt"></i> Share
                                </a>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-cloud-download"></i> Download
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-copy"></i> Copy to
                                </a>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-folder"></i> Move to
                                </a>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-edit"></i> Rename
                                </a>
                                <a href="#" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-trash"></i> Delete
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable table */}
                <div className="table-responsive" style={{height: "310px"}}>
                    <table className="table card-table table-vcenter text-nowrap table-striped mb-0">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th></th>
                            <th>Marks</th>
                            <th>%AGE</th>
                        </tr>

                        {toppers.map((topper, index) => (
                            <tr key={index}>
                                <td>{topper.no}</td>
                                <td className="w40">
                                    <div className="avatar">
                                        <img className="avatar" src={topper.avatar} alt="avatar"/>
                                    </div>
                                </td>
                                <td>
                                    <div>{topper.name}</div>
                                    <div className="text-muted">{topper.subtitle}</div>
                                </td>
                                <td>{topper.marks}</td>
                                <td>{topper.percentage}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <div className="font-14">
            <span>
              Measure How Fast You’re Growing Monthly Recurring Revenue.{" "}
                <a href="#">View All</a>
            </span>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary">
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
