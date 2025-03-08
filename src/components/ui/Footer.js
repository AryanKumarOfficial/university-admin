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
                                    Copyright &copy; 2024
                                    <Link href="https://themeforest.net/user/puffintheme/portfolio" target="_blank"
                                          rel="noopener noreferrer">
                                        {" "}PuffinTheme
                                    </Link>.
                                </div>
                                <div className="col-md-6 col-sm-12 text-md-right">
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item">
                                            <Link href="/doc/index.html">Documentation</Link>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link href="#">FAQ</Link>
                                        </li>
                                        <li className="list-inline-item">
                                            <button className="btn btn-outline-primary btn-sm">Buy Now</button>
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