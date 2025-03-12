"use client"; // Marks this as a client component

import Link from "next/link";

export default function ActionDropdown() {
    return (
        <div className="dropdown">
            <button
                className="btn btn-primary text-capitalize"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown" // Bootstrap will pick this up to toggle the menu
                aria-expanded="false"
            >
                Add new lead
            </button>
            <ul className="dropdown-menu mt-1" aria-labelledby="dropdownMenuButton" style={{
                backgroundColor: "#de5d83"
            }}>
                <li>
                    <Link className="dropdown-item text-white" href="/leads/add/school">
                        School
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item text-white" href="/leads/add/collage">
                        Collage
                    </Link>
                </li>
            </ul>
        </div>
    );
}
