import { loginUser } from "@/app/actions/auth/login";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { collectionNames, dbConnect } from "./dbConnect";
import { signIn } from "next-auth/react";

export const authOptions = {

providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
      const user = await loginUser(credentials)

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
],
  pages: {
    signIn: "/login",
  },
    session: {
    strategy: "jwt", // ✅ Enable JWT-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
callbacks: {
  async signIn({ user, account }) {
    if (!account || !user?.email) return false;

    if (account?.type === "credentials") {
      // Block login if email not verified
      if (!user.emailVerified) {
        throw new Error("Email not verified. Please verify OTP first.");
      }
    }

    const { provider, providerAccountId } = account;
    const { name, email, image } = user;

    const usersCollection = await dbConnect("users");

    // 1. Check if user already exists by email
    const existUser = await usersCollection.findOne({ email });

    if (!existUser) {
      // New user → insert
      const userData = {
        name,
        email,
        image,
        role: "user",
        providers: [{ provider, providerAccountId }], // store multiple providers
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(userData);
    } else {
      // Existing user → update provider info if not already linked
      const hasProvider = existUser.providers?.some(
        (p) => p.provider === provider && p.providerAccountId === providerAccountId
      );

      if (!hasProvider) {
        await usersCollection.updateOne(
          { _id: existUser._id },
          {
            $push: { providers: { provider, providerAccountId } },
            $set: { updatedAt: new Date() },
          }
        );
      } else {
        await usersCollection.updateOne(
          { _id: existUser._id },
          { $set: { updatedAt: new Date() } }
        );
      }
    }

    return true;
  },
}

}

/*   callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    if(account) {
        const {provider, providerAccountId} = account
        const {name, email: user_email, image} = user

        const userData = {provider, providerAccountId, name, email: user_email, image, role : "user", createdAt: new Date(),
            updatedAt: new Date(),}
        const existUser = await dbConnect("users").findOne({providerAccountId})

       if(!existUser) {
        if(existUser.email === user_email){
          dbConnect("users").updateOne({_id: existUser._id},{$set: {provider, providerAccountId}})
        }
        await dbConnect("users").insertOne(userData)
       }
       else {
        await dbConnect("users").updateOne({_id: existUser._id},{$set: {updatedAt: new Date()}})
       }
    }
    return true
  }, 
} */



