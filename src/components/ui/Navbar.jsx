"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuthStore} from "@/stores/auth-store";

const sidebarLinks = {
    School: [
        {path: "/", icon: "fa fa-tachometer-alt", label: "Dashboard"},
        {path: "/leads", icon: "fa fa-handshake", label: "Leads"},
        {path: "/clients", icon: "fa fa-user-tie", label: "Clients"},
        {path: "/students", icon: "fa fa-user-graduate", label: "Students"},
        {path: "/teachers", icon: "fa fa-chalkboard-teacher", label: "Teachers"},
        {path: "/users", icon: "fa fa-users", label: "Users"}
    ],
    Training: [
        {path: "/training", icon: "fa fa-tachometer", label: "Dashboard"},
        {path: "/training/leads-tnp", icon: "fa fa-handshake", label: "Leads (TNP)"},
        {path: "/training/leads-trainee", icon: "fa fa-handshake", label: "Leads (Trainees)"},
        {path: "/training/trainee", icon: "fa fa-user-plus", label: "Trainees"},
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

function SidebarNav({activeTab, onTabChange, currentPath, linksByTab}) {
    return (
        <>
            <ul className="nav nav-tabs">
                {Object.keys(linksByTab).map((tab) => (
                    <li key={tab} className="nav-item">
                        <button
                            className={`nav-link ${activeTab === tab ? "active" : ""}`}
                            onClick={() => onTabChange(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="tab-content mt-3">
                {Object.entries(linksByTab).map(([tab, links]) => (
                    <div
                        key={tab}
                        className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
                    >
                        <nav className="sidebar-nav">
                            <ul className="metismenu">
                                {links.map(({path, icon, label}) => (
                                    <li key={label} className={currentPath === path ? "active" : ""}>
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


function getSidebarLinksForRole(role) {
    if (!role) return {};

    if (role === "Admin") {
        // Admin sees both tabs with all links.
        return {...sidebarLinks};
    } else if (role === "Growth Manager") {
        return {
            School: sidebarLinks.School.filter(link =>
                ["Dashboard", "Leads", "Clients"].includes(link.label)
            ),
            Training: [...sidebarLinks.Training]
        };
    } else {
        // For any other role, only show the Training tab.
        let trainingLinks = [...sidebarLinks.Training];
        if (role === "Course Manager" || role === "Professional") {
            trainingLinks = trainingLinks.filter(link =>
                ["Dashboard", "Trainees"].includes(link.label)
            );
        } else if (role === "Trainee" || role === "Intern") {
            trainingLinks = trainingLinks.filter(link => link.label === "Dashboard");
        }
        return {Training: trainingLinks};
    }
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
    const [activeTab, setActiveTab] = useState("School");
    const {logOut, user, role} = useAuthStore();
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

    const filteredLinks = useMemo(() => getSidebarLinksForRole(role), [role]);

    useEffect(() => {
        const tabs = Object.keys(filteredLinks);
        if (tabs.length && !tabs.includes(activeTab)) {
            // Here we prefer "Training" if available, otherwise the first available tab.
            setActiveTab(tabs.includes("Training") ? "Training" : tabs[0]);
        }
    }, [filteredLinks, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const tabLinks = filteredLinks[tab];
        if (tabLinks && tabLinks.length > 0) {
            router.push(tabLinks[0].path);
        }
    };


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
                <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} currentPath={pathname}
                            linksByTab={filteredLinks}
                />
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
