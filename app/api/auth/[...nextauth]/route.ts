import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Email/Password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Find user by email
        const profile = await prisma.profile.findUnique({
          where: { email: credentials.email }
        });

        if (!profile || !profile.password) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, profile.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: profile.userId,
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`,
          image: null,
          role: profile.role
        };
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },

  callbacks: {
    async signIn({ user, account, profile: oauthProfile }) {
      // Handle OAuth sign-in (Google)
      if (account?.provider === "google") {
        try {
          // Check if user exists
          let existingProfile = await prisma.profile.findUnique({
            where: { email: user.email! }
          });

          if (!existingProfile) {
            // Create new user from OAuth
            const names = user.name?.split(" ") || ["", ""];
            const firstName = names.slice(0, -1).join(" ") || names[0] || "User";
            const lastName = names[names.length - 1] || "";

            existingProfile = await prisma.profile.create({
              data: {
                userId: user.id,
                email: user.email!,
                firstName,
                lastName,
                middleInitial: null,
                role: "STUDENT",
                verificationStatus: "VERIFIED", // OAuth users are auto-verified
              }
            });
          } else if (!existingProfile.userId) {
            // Update existing profile with OAuth userId
            await prisma.profile.update({
              where: { email: user.email! },
              data: { userId: user.id }
            });
          }

          user.role = existingProfile.role;
          return true;
        } catch (error) {
          console.error("Error during OAuth sign-in:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.email) {
        // Refresh role from database
        const profile = await prisma.profile.findUnique({
          where: { email: token.email }
        });
        if (profile) {
          token.role = profile.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
