import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /** Include ADMIN role to the session **/
    async jwt({ token, user }) {
      if (user) {
        // By default, the user's role is "user"
        const isAdmin =
          user.email &&
          process.env.ADMIN_EMAIL &&
          user.email === process.env.ADMIN_EMAIL;
        token.role = isAdmin ? "ADMIN" : "user";
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token?.role as string,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
