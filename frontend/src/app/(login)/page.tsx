"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import {useAuth} from "@/src/context/authContext";
import {useRouter} from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [licenseKey, setLicenseKey] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const router = useRouter()

    const authContext = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (isRegister) {
                const response = await authContext.register(email, password, licenseKey)
                if (response?.status == "success") {
                    router.push("/main")
                }
            } else {
                const response = await authContext.login(email, password)
                console.log(response?.status)
                if (response?.status == "success") {
                    router.push("/main")
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md ">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-balance">Welcome</CardTitle>
                    <CardDescription className="text-pretty">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {isRegister && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">License Key</Label>
                                </div>
                                <Input
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isRegister ? "Sign up" : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <p className="text-center text-sm text-muted-foreground">
                        {isRegister ? (<>{"Have an account? "}</>) : (<>{"Don't have an account? "}</>)}
                        <a href="#" onClick={() => setIsRegister(!isRegister)} className="font-medium text-foreground hover:underline">
                            {isRegister ? (<>{"Sign in"}</>) : (<>{"Sign up"}</>)}
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
