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
                console.log("-----CredentialsProvider-----")
                const url= process.env.NEXT_PUBLIC_BACKEND_URL
                const user= await axios.post(`${url}/api/useraccount/one`, {email: credentials.email})
                if (!user.data.userAccount || Object.keys(user.data.userAccount).length== 0) {
                    console.log("Error: ",user.data.resp)
                    throw new Error(user.data.resp)
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
                    image: user.data.userAccount.avatarImage,
                    type: "local"
                }

            }
            
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            //cria registro de conta do google no banco se ainda ñ for cadastrada
            console.log("\n------Callback signIn------")
            const url= process.env.NEXT_PUBLIC_BACKEND_URL
            //console.log("account: ",account, "\nprofile: ", profile)
            if (account.provider== "google") {
                const googleAccount= {
                    userName: profile.email,
                    email: profile.email,
                    googleId: profile.sub,
                    avatarImage: profile.picture,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    type: "googleAccount"
                }
                
                const verifyAccount= await axios.post(`${url}/api/useraccount/verifygoogleaccount`, googleAccount)
                console.log("verifyAccount response: ", verifyAccount.data)
                if (verifyAccount.data.error) {
                    return false
                } else {
                    return true
                }
                
            } else {
                return true
            }
            
        },
        async jwt({ token, user, account }) {
            const url= process.env.NEXT_PUBLIC_BACKEND_URL
            if (user) {
                console.log("------jwt------")
                if (account.provider=="google") {
                    const response = await axios.post(`${url}/api/useraccount/one`, {googleId: user.id})
                    //console.log("consulta conta google: ", response.data.userAccount)
                    user.id= response.data.userAccount._id
                    user.type= response.data.userAccount.type
                } else {
                    user.type= "local"
                }
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
    pages: { signIn: "/auth/signin" },
    secret: process.env.NEXTAUTH_SECRET
});
