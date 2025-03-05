import 'bootstrap/dist/css/bootstrap.min.css';
import "@/assets/scss/main.scss";


export const metadata = {
    title: "University Admin",
    description: "Centralised admin for all university related tasks",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>
        {children}
        <script src={"./assets/js/core.js"}></script>
        </body>
        </html>
    );
}
