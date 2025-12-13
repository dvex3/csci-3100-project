import { Configuration } from "@/src/api/generated";

export const loginApiConfig = () => {
    const basePath = "http://localhost:5000/api/v1";
    return new Configuration({
        basePath: basePath,
    })
}

export const apiConfig = () => {
    const userToken = localStorage.getItem("user_token") ?? ""
    const basePath = "http://localhost:5000/api/v1";

    console.log(userToken)
    return new Configuration({
        basePath: basePath,
        apiKey: userToken,
    })
}