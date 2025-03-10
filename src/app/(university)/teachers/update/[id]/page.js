import {use} from "react";

export default function UpdateTeacher({params}) {
    const resolvedParams = use(params);
    return (
        <div className="page">
            <h1>Update Teacher {resolvedParams.id}</h1>
        </div>
    )
}
