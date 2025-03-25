import Link from "next/link";

const Footer = () => {
    return (
        <div id={"main-content w-100"}>
            <div className={"page bg-primary w-100"}>
                <div className="section-body bg-primary w-100">
                    <footer className="footer w-100" style={{
                        //  fix the footer to the bottom of the page without altering the rest of the layout
                        position: "fixed",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "#f8f9fa",
                        borderTop: "1px solid #e9ecef",
                        // padding: "10px 0",
                    }}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    Copyright &copy; 2025
                                    <Link href="https://iqnaut.com" target="_blank"
                                          rel="noopener noreferrer">
                                        {" "}Iqnaut Central Admin
                                    </Link>.
                                </div>
                                <div
                                    className="col-md-6 col-sm-12 text-md-right d-flex justify-content-md-end justify-content-center mb-10 mb-md-0">
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item">
                                            <Link href="#">Privacy Policy</Link>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link href="#">Terms of Use</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Footer;