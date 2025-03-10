"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuthStore} from "@/stores/auth-store";

const sidebarLinks = {
    university: [
        {path: "/", icon: "fa fa-tachometer", label: "Dashboard"},
        {path: "/leads", icon: "fa fa-address-book", label: "Leads"},
        {path: "/clients", icon: "fa fa-briefcase", label: "Clients"},
        {path: "/teachers", icon: "fa fa-user", label: "Teachers"},
        {path: "/students", icon: "fa fa-graduation-cap", label: "Students"},
    ],
    admin: [
        {path: "/payments", icon: "fa fa-credit-card", label: "Payments"},
    ],
};

function TopHeader({user}) {
    return (
        <div id="header_top" className="header_top">
            <div className="container">
                <div className="hleft">
                    <Link href="/" className="header-brand" style={{textDecoration: "none"}}>
                        <i className="fa fa-graduation-cap brand-logo"></i>
                    </Link>
                    <div className="dropdown">
                        <a href="#" className="nav-link icon menu_toggle">
                            <i className="fe fe-align-center"></i>
                        </a>
                        {/*<a href="page-search.html" className="nav-link icon">*/}
                        {/*    <i className="fe fe-search" data-bs-toggle="tooltip" data-bs-placement="right"*/}
                        {/*       title="Search..."></i>*/}
                        {/*</a>*/}
                        {/*<a href="app-email.html" className="nav-link icon app_inbox">*/}
                        {/*    <i className="fe fe-inbox" data-bs-toggle="tooltip" data-bs-placement="right"*/}
                        {/*       title="Inbox"></i>*/}
                        {/*</a>*/}
                        {/*<a href="app-filemanager.html" className="nav-link icon app_file xs-hide">*/}
                        {/*    <i className="fe fe-folder" data-bs-toggle="tooltip" data-bs-placement="right"*/}
                        {/*       title="File Manager"></i>*/}
                        {/*</a>*/}
                        {/*<a href="app-social.html" className="nav-link icon xs-hide">*/}
                        {/*    <i className="fe fe-share-2" data-bs-toggle="tooltip" data-bs-placement="right"*/}
                        {/*       title="Social Media"></i>*/}
                        {/*</a>*/}
                        {/*<a href="javascript:void(0)" className="nav-link icon theme_btn">*/}
                        {/*    <i className="fe fe-feather"></i>*/}
                        {/*</a>*/}
                        {/*<a href="javascript:void(0)" className="nav-link icon settingbar">*/}
                        {/*    <i className="fe fe-settings"></i>*/}
                        {/*</a>*/}
                    </div>
                </div>
                <div className="hright">
                    <Link href="#" className="nav-link icon right_tab">
                        <i className="fe fe-align-right"></i>
                    </Link>
                    <Link href="/login" className="nav-link  right_tab">
                        <i className="fe fe-power"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SidebarNav({activeTab, onTabChange, currentPath}) {
    return (
        <>
            <ul className="nav nav-tabs">
                {Object.keys(sidebarLinks).map((tab) => (
                    <li key={tab} className="nav-item">
                        <button
                            className={`nav-link ${activeTab === tab ? "active" : ""}`}
                            onClick={() => onTabChange(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>
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
                                    <li
                                        key={label}
                                        className={
                                            path === "/"
                                                ? currentPath === "/"
                                                    ? "active"
                                                    : ""
                                                : currentPath.startsWith(path)
                                                    ? "active"
                                                    : ""
                                        }
                                    >
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
        </>
    );
}

function UserDropdown({user, dropdownItems}) {
    return (
        <div className="dropdown d-flex align-items-center">
            <a
                className="chip ml-3 text-decoration-none"
                role="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
        <span
            className="avatar"
            style={{
                backgroundImage: `url(https://ui-avatars.com/api/?name=${
                    user?.displayName
                        ? user.displayName.replace(/[\s,]+/g, "+")
                        : "Guest"
                })`,
            }}
        ></span>
                {user?.displayName ?? "Guest"}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                {dropdownItems.map(({label, href, type, action}) => (
                    <li key={label} className="w-100">
                        {type === "link" ? (
                            <Link href={href} style={{textDecoration: "none"}} className="dropdown-item">
                                {label}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="dropdown-item"
                                style={{width: "90%"}}
                                onClick={action}
                            >
                                {label}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Navbar = () => {
    const [activeTab, setActiveTab] = useState("university");
    const {logOut, user} = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await logOut();
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const dropdownItems = [
        {label: "Dashboard", href: "/", type: "link"},
        {label: "Logout", type: "button", action: handleLogout},
    ];

    return (
        <div id="main_content">
            <TopHeader user={user}/>
            <div id="left-sidebar" className="sidebar">
                <h5 className="brand-name fs-6 w-100">Centralized Admin
                    <Link href="#" className="menu_option float-right ms-3" style={{textDecoration: "none"}}>
                        <i className="icon-grid font-16" data-toggle="tooltip" data-placement="left"
                           title="Grid & List Toggle"></i>
                    </Link>
                </h5>
                <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} currentPath={pathname}/>
            </div>
            <div className="page">
                <div className="section-body" id="page_top">
                    <div className="container-fluid">
                        <div className="page-header">
                            <div className="left"></div>
                            <div className="right">
                                <div className="notification d-flex">
                                    {!user ? (
                                            <Link href="/login" className="nav-link icon">
                                                <i className="fa fa-sign-in"></i>
                                            </Link>
                                        ) :
                                        <UserDropdown user={user} dropdownItems={dropdownItems}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Additional page content goes here */}
            </div>
        </div>
    );
};

export default Navbar;
