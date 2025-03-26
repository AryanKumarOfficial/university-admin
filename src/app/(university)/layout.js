import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import {Toaster} from "react-hot-toast";


export const metadata = {
    title: "University Admin",
    description: "Centralised admin for all university related tasks",
};

export default function RootLayout({children}) {
    return (
        <>
            <Navbar/>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            {children}
            <Footer/>
        </>
    );
}
