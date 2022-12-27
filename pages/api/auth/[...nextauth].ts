import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";
import bcrypt from "bcrypt"; 
import clientPromise from "../../../lib/mongodb";
import Stripe from "stripe"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export default NextAuth({
    providers: [ 
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
                if(!user.isVerified) {
                  throw new Error("Email is not verified")
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
    callbacks: {
        session: async ({ session, token }) => {
          if (session?.user) {
            // @ts-ignore

            session.user.id = token.uid;
          }
          return session;
        },
        jwt: async ({ user, token }) => {
          if (user) {
            token.uid = user.id;
          }
          return token;
        },
      },
    
    pages: {
        signIn: "/auth",
        error: "/auth",
        newUser: "/googleStripe"
    },
    secret: process.env.JWT_SECRET,
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),
    session: {
      strategy: "jwt",
    },
    
  
})