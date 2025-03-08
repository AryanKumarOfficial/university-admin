import 'bootstrap/dist/css/bootstrap.min.css';
import "../../public/assets/scss/main.scss";
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
        <script src={"/assets/js/lib.vendor.bundle.js"}></script>
        <script src={"/assets/js/core.js"}></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                crossOrigin="anonymous"></script>
        </body>
        </html>
    );
}
