import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // For now, we'll skip authentication since it's not fully set up
  // This will allow the API to work without requiring login
  session: {
    strategy: "jwt",
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
} 