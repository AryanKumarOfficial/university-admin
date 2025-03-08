"use client";
import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const sidebarLinks = {
    university: [
        {
            path: "/",
            icon: "fa fa-dashboard",
            label: "Dashboard"
        },
        {
            path: "/leads",
            icon: "fa fa-users",
            label: "Leads"
        },
        {
            path: "/clients",
            icon: "fa fa-users",
            label: "Clients"
        },
        {
            path: "/teachers",
            icon: "fa fa-users",
            label: "Teachers"
        },
        {
            path: "/Students",
            icon: "fa fa-users",
            label: "Students"
        },

    ],
    admin: [
        {path: "/payments", icon: "fa fa-credit-card", label: "Payments"},
    ],
};

const Nabvar = () => {
    const [activeTab, setActiveTab] = useState("university");
    const pathname = usePathname()

    return (
        <>
            <div id="main_content">
                {/*Start Main top header */}
                <div id="header_top" className="header_top">
                    <div className="container">
                        <div className="hleft">
                            <Link style={{
                                textDecoration: "none",
                            }} className="header-brand" href="/"><i
                                className="fa fa-graduation-cap brand-logo"></i></Link>
                            <div className="dropdown">
                                <a href="#" className="nav-link icon menu_toggle"><i
                                    className="fe fe-align-center"></i></a>
                                <a href="page-search.html" className="nav-link icon"><i className="fe fe-search"
                                                                                        data-toggle="tooltip"
                                                                                        data-placement="right"
                                                                                        title="Search..."></i></a>
                                <a href="app-email.html" className="nav-link icon app_inbox"><i className="fe fe-inbox"
                                                                                                data-toggle="tooltip"
                                                                                                data-placement="right"
                                                                                                title="Inbox"></i></a>
                                <a href="app-filemanager.html" className="nav-link icon app_file xs-hide"><i
                                    className="fe fe-folder" data-toggle="tooltip" data-placement="right"
                                    title="File Manager"></i></a>
                                <a href="app-social.html" className="nav-link icon xs-hide"><i className="fe fe-share-2"
                                                                                               data-toggle="tooltip"
                                                                                               data-placement="right"
                                                                                               title="Social Media"></i></a>
                                <a href="javascript:void(0)" className="nav-link icon theme_btn"><i
                                    className="fe fe-feather"></i></a>
                                <a href="javascript:void(0)" className="nav-link icon settingbar"><i
                                    className="fe fe-settings"></i></a>
                            </div>
                        </div>
                        <div className="hright">
                            <a href="javascript:void(0)" className="nav-link icon right_tab"><i
                                className="fe fe-align-right"></i></a>
                            <Link href="/login" className="nav-link icon settingbar"><i
                                className="fe fe-power"></i></Link>
                        </div>
                    </div>
                </div>
                {/*Start Rightbar setting panel */}
                {/*Start Theme panel do not add in project */}
                {/*Start Quick menu with more function */}
                {/*Start Main leftbar navigation */}
                <div id="left-sidebar" className="sidebar">

                    {/*Brand Name*/}

                    <h5 className="brand-name"><Link href="/"
                                                     className="menu_option float-right" style={{
                        textDecoration: "none"
                    }}>Centralized Admin</Link></h5>

                    {/*Navigation Tab */}

                    <ul className="nav nav-tabs">
                        {Object.keys(sidebarLinks).map((tab) => (
                            <li key={tab} className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/*Tab Content */}

                    <div className="tab-content mt-3">
                        {Object.entries(sidebarLinks).map(([tab, links]) => (
                            <div
                                key={tab}
                                className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
                                id={`menu-${tab}`}
                                role="tabpanel"
                            >
                                <nav className="sidebar-nav">
                                    <ul className="metismenu">
                                        {links.map(({path, icon, label}) => (
                                            <li key={label} className={pathname === path ? "active" : ""}>
                                                <Link href={path} style={{textDecoration: "none"}}>
                                                    <i className={icon}></i>
                                                    <span>{label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        ))}
                    </div>

                </div>
                {/*Start project content area */}
                <div className="page">
                    {/*Start Page header */}
                    <div className="section-body" id="page_top">
                        <div className="container-fluid">
                            <div className="page-header">
                                <div className="left">
                                </div>
                                <div className="right">
                                    <div className="notification d-flex">
                                        <div className="dropdown d-flex">
                                            <a href="javascript:void(0)" className="chip ml-3" data-toggle="dropdown">
                                                <span className="avatar"
                                                      style={{backgroundImage: "url(../assets/images/xs/avatar5.jpg)"}}
                                                ></span> George</a>
                                            <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                                <a className="dropdown-item" href="page-profile.html"><i
                                                    className="dropdown-icon fe fe-user"></i> Profile</a>
                                                <a className="dropdown-item" href="app-setting.html"><i
                                                    className="dropdown-icon fe fe-settings"></i> Settings</a>
                                                <a className="dropdown-item" href="app-email.html"><span
                                                    className="float-right"><span
                                                    className="badge badge-primary">6</span></span><i
                                                    className="dropdown-icon fe fe-mail"></i> Inbox</a>
                                                <a className="dropdown-item" href="javascript:void(0)"><i
                                                    className="dropdown-icon fe fe-send"></i> Message</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="javascript:void(0)"><i
                                                    className="dropdown-icon fe fe-help-circle"></i> Need help?</a>
                                                <a className="dropdown-item" href="login.html"><i
                                                    className="dropdown-icon fe fe-log-out"></i> Sign out</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Start Page title and tab */}
                </div>
            </div>
        </>
    );
};

export default Nabvar;