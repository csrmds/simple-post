import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import bcrypt from 'bcrypt'


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials) {
                const url = process.env.NEXT_PUBLIC_BACKEND_URL
                
                const user= await axios.post(`${url}/api/useraccount/one`, {email: credentials.email})
                console.log("\n\nNextAuth: ", credentials)
                console.log("\nNextAuth User: ", user.data)
                
                if (!user) {
                    console.log("usuário não encontrado")
                    throw new Error("User not found")
                }
                
                const checkPassword = await bcrypt.compare(credentials.password, user.data.password);
                console.log("\n\ncheckPassword: ", checkPassword)
                if (!checkPassword) {
                    console.log("senha não confere")
                    throw new Error("senha não confere throw error")
                }

                return user
            }
        })
    ],
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error'
    // }
    // Outras configurações do NextAuth
});