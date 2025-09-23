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
  async signIn({ user, account, profile, email, credentials }) {
    if(account) {
        const {provider, providerAccountId} = account
        const {name, email: user_email, image} = user

        const userData = {provider, providerAccountId, name, email: user_email, image, role : "user", createdAt: new Date(),
            updatedAt: new Date(),}
        const existUser = await dbConnect("users").findOne({providerAccountId})

       if(!existUser) {
        await dbConnect("users").insertOne(userData)
       }
       else {
        await dbConnect("users").updateOne({_id: existUser._id},{$set: {updatedAt: new Date()}})
       }
    }
    return true
  }, 
}
}

/* let userRecord = await users.findOne({ providerAccountId })

if (!userRecord) {
  // try finding by email
  userRecord = await users.findOne({ email: user_email })
  
  if (userRecord) {
    // link new provider to existing user
    await users.updateOne(
      { email: user_email },
      { $set: { provider, providerAccountId } }
    )
  } else {
    // new user entirely
    await users.insertOne(userData)
  }
}
 */



