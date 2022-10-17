import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";
import bcrypt from "bcrypt"; 
import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";




export default NextAuth({
    providers: [ 
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                await dbConnect();
                // @ts-ignore
                const user = await User.findOne({email: credentials?.email});

                if(!user) {
                    throw new Error("Email is not registered")
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials!.password,
                    user.hashedPassword
                );
                // Incorrect password
                if (!isPasswordCorrect) {
                    throw new Error("Password is incorrect");
                }
                return user;

            }
        })
    ],
    
    pages: {
        signIn: "/auth",
        error: "/auth",
        newUser: "/link"
    },
    secret: process.env.JWT_SECRET,
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),
    session: {
      strategy: "jwt",
    },
    
  
})