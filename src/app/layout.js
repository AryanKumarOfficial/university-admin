import 'bootstrap/dist/css/bootstrap.min.css';
import "@/assets/scss/main.scss";
import Footer from "@/components/Footer";


export const metadata = {
    title: "University Admin",
    description: "Centralised admin for all university related tasks",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={"font-muli theme-blush"}>
        {children}
        <Footer/>
        <script src={"./assets/js/core.js"}></script>
        </body>
        </html>
    );
}
