"use client"
import Breadcrumb from "@/components/ui/Breadcrumb";
import GenericTable from "@/components/ui/GenericTable";

export default async function DataClient({locations = []}) {
    const tableColumns = [
        {
            key: "id",
            header: "ID",
        },
        {
            key: "name",
            header: "Name",
        },
        {
            key: "createdBy",
            header: "Created By",
        },
        {
            key: "createdAt",
            header: "Created At",
            render: (value) => (new Date(value).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }))
        }
    ]
    // Filter options
    const filterOptions = [
        {key: "name", label: "Search", type: "text"},
        {key: "createdAt", label: "Joined Date", type: "date"},
    ];
    const rowActions = [
        {
            key: "delete",
            label: "",
            icon: "fa fa-trash",
            buttonClass: "btn-outline-danger",
            requireConfirm: true,
            title: "Confirm Delete",
            confirmMessage: "Are you sure you want to delete this record?",
            onClick: async (item) => {
                if (item) {
                    try {
                        const res = await fetch(`/api/training/trainee`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: item.id}),
                        });
                        if (res.status === 200) {
                            console.log("Record deleted successfully.");
                            router.refresh();
                        } else {
                            console.error("Error deleting record with id:", item.id, "Status:", res.status);
                        }
                    } catch (error) {
                        console.error("Error deleting record:", error);
                    }
                }
            },
        },
        {
            key: "edit",
            label: "",
            icon: "fa fa-edit",
            buttonClass: "btn-outline-primary",
            requireConfirm: false,
            onClick: (item) => {
                if (item) {
                    console.log("Editing record with id:", item.id);
                    router.push(`/training/trainee/update/${item.id}`);

                }
            },
        },
    ];

    const globalActions = {
        type: "link",
        href: "/training/locations/add",
        label: "Add a Location",
    };
    return (
        <div className="page">
            <Breadcrumb
                breadcrumbs={[
                    {
                        label: "Home",
                        href: "/"
                    },
                    {
                        label: "Training",
                        href: "/training"
                    },
                    {
                        label: "Location Master",
                        href: "/university/training/masters/locations"
                    }
                ]}
            />

            <div className="section-body">
                <div className="container-fluid">
                    <GenericTable
                        title={"Locations"}
                        pageSize={10}
                        initialFilterValues={{status: "All"}}
                        rowActions={rowActions}
                        filterOptions={filterOptions}
                        tableColumns={tableColumns}
                        tableData={locations}
                        globalActions={globalActions}
                    />
                </div>
            </div>
        </div>
    )
}