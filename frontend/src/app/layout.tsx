import "./globals.css";
import "../utils/axios"
import {AuthProvider} from "@/src/context/authContext";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning lang="en">
        <body className="min-h-screen flex flex-col">
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}
