import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
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
                const url= process.env.NEXT_PUBLIC_BACKEND_URL
                const user= await axios.post(`${url}/api/useraccount/one`, {email: credentials.email})
                console.log('\n-----NextAuth-----\n', user.data)
                if (!user.data.userAccount || Object.keys(user.data.userAccount).length== 0) {
                    console.log("Error: ",user.data.resp.message)
                    throw new Error(user.data.resp.message)
                }
                
                //console.log("Dados senha: \n", credentials.password, "\n", user.data.userAccount.password)
                const checkPassword= await bcrypt.compare(credentials.password, user.data.userAccount.password) 
                if (!checkPassword) {
                    console.log("Error: Senha não confere")
                    throw new Error("Error: Senha não confere")
                }

                return {
                    id: user.data.userAccount._id,
                    name: user.data.userAccount.firstName,
                    email: user.data.userAccount.email,
                    type: "local"
                }

            }
            
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            //cadastrar conta do google no banco se ainda ñ for cadastrada
            console.log("\n\nCallback signIn")
            console.log("account: ",account, "\nprofile: ", profile)
            

            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.type = user.type
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.type = token.type
            }
            return session
        }
    },
    pages: { signIn: "/auth/signin" }
});
