import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";


export const metadata = {
    title: "University Admin",
    description: "Centralised admin for all university related tasks",
};

export default function RootLayout({children}) {
    return (
        <>
            <Navbar/>
            {children}
            <Footer/>
        </>
    );
}
