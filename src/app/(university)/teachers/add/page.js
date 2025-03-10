import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AddTeacherPage() {
    const breadcrumbs = [
        {label: 'Home', href: '/'},
        {label: 'Teachers', href: '/university/teachers'},
        {label: 'Add Teacher', href: '/university/teachers/add'},
    ]
    return (
        <div className="page">
            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <div className={"section-body my-3"}>
                <div className="container-fluid">
                    <h1 className={"card-subtitle"}>Add Teacher</h1>
                </div>
            </div>
        </div>
    )
}
