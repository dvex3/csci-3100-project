"use client"

import { AuthApi, AuthResponse, UserResponse } from "@/src/api/generated";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiConfig, loginApiConfig } from "@/src/utils/api-config";

type AuthContextType = {
    user: UserResponse | null,
    register: (email: string, password: string, licenseKey: string) => Promise<AuthResponse | undefined>,
    login: (email: string, password: string) => Promise<AuthResponse | undefined>,
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            (new AuthApi(apiConfig())).getGetUser().then(response => {
                setUser(response.data)
            }).catch(error => {
                console.log(error)
                localStorage.removeItem("user_token")
                router.push("/")
            })
        }
    }, [router])

    const register = async (email: string, password: string, licenseKey: string): Promise<AuthResponse | undefined> => {
        try {
            const response = await (new AuthApi(loginApiConfig())).postRegisterUser(email, password, licenseKey)
            if (typeof window !== "undefined") {
                localStorage.setItem("user_token", response.data.access_token ?? "")
            }
            const user = await (new AuthApi(apiConfig())).getGetUser()
            setUser(user.data)
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const login = async (email: string, password: string): Promise<AuthResponse | undefined> => {
        try {
            const response = await (new AuthApi(loginApiConfig())).postLoginUser(email, password)
            if (typeof window !== "undefined") {
                localStorage.setItem("user_token", response.data.access_token ?? "")
            }
            const user = await (new AuthApi(apiConfig())).getGetUser()
            setUser(user.data)
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const logout = async () => {
        try {
            const response = await (new AuthApi(apiConfig())).postLogoutUser()
            setUser(null)
            if (typeof window !== "undefined") {
                localStorage.removeItem("user_token")
            }
            router.push("/")
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return <AuthContext.Provider value={{ user, register, login, logout }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}