"use client"; // Marks this as a client component

export default function DropdownMenu() {
    return (
        <div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown" // Bootstrap will pick this up to toggle the menu
                aria-expanded="false"
            >
                Dropdown button
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                    <a className="dropdown-item" href="#">
                        Action
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Another action
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Something else here
                    </a>
                </li>
            </ul>
        </div>
    );
}
