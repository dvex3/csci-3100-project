"use client"

import {LogOut} from "lucide-react"
import {Button} from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {useAuth} from "@/src/context/authContext";

export function UserMenu() {
    const authContext = useAuth()

    const handleLogout = () => {
        authContext.logout()
    }
    if (authContext.user) {
        return (
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <h1 className="text-xl font-semibold">Annotator</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="relative">
                                Menu
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium leading-none">{authContext.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

        )
    }

    return <></>
}
