import Link from "next/link";

const Footer = () => {
    return (
        <div id={"main-content"}>
            <div className={"page"}>
                <div className="section-body">
                    <footer className="footer">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    Copyright &copy; 2025
                                    <Link href="https://iqnaut.com" target="_blank"
                                          rel="noopener noreferrer">
                                        {" "}Iqnaut Central Admin
                                    </Link>.
                                </div>
                                <div className="col-md-6 col-sm-12 text-md-right d-flex justify-content-md-end justify-content-center mb-10 mb-md-0">
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