import "./globals.css";
import "../utils/axios"
import {AuthProvider} from "@/src/context/authContext";
import { UserMenu } from "@/src/components/user-menu";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning lang="en">
        <body className="min-h-screen flex flex-col">
        <AuthProvider>
            <UserMenu />
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}
