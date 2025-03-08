import 'bootstrap/dist/css/bootstrap.min.css';
import "@/assets/scss/main.scss";
import AuthProvider from "@/components/auth-provider";

export const metadata = {
    title: "University Admin",
    description: "Centralised admin for all university related tasks",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={"font-muli theme-blush"}>
        <AuthProvider>
            {children}
        </AuthProvider>
        <script src={"../assets/js/lib.vendor.bundle.js"}></script>
        <script src={"../assets/js/core.js"}></script>
        </body>
        </html>
    );
}
