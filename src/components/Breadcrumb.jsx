import Link from "next/link";

export default function Breadcrumb({breadcrumbs = []}) {
    // If no breadcrumbs provided, default to the home page.
    if (!breadcrumbs.length) {
        breadcrumbs = [{label: "Home", href: "/"}];
    } else {
        // Always ensure the first breadcrumb is Home.
        if (breadcrumbs[0].href !== "/") {
            breadcrumbs.unshift({label: "Home", href: "/"});
        }
    }

    // Use the last breadcrumb's label as the page title.
    const pageTitle = breadcrumbs[breadcrumbs.length - 1].label;

    return (
        <div className="section-body">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="header-action">
                        <h1 className="page-title">{pageTitle}</h1>
                        <ol className="breadcrumb page-breadcrumb">
                            {breadcrumbs.map((crumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <li
                                        key={index}
                                        className={`breadcrumb-item ${isLast ? "active" : ""}`}
                                        aria-current={isLast ? "page" : undefined}
                                    >
                                        {isLast || !crumb.href ? (
                                            crumb.label
                                        ) : (
                                            <Link href={crumb.href}>{crumb.label}</Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
