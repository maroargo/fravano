import NextAuth from "next-auth"
import authConfig from "./app/(auth)/auth.config"
 
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        
        // Fetch the AddressType ID for "Marker"
        const addressType = await db.addressType.findFirst({
          where: {
            name: "Draw"
          }
        });

        token.idOrganization = user.idOrganization,        
        token.idAddressType = addressType?.id

        token.organization = user.organization; 
        token.role = user.role; 
      }
      return token
    },
    session({ session, token }) {      
      if (session.user) {
        session.user.idOrganization = token.idOrganization,        
        session.user.idAddressType = token.idAddressType

        session.user.organization = token.organization;
        session.user.role = token.role;
      }
      return session
    },
  },
  debug: true,
  ...authConfig,
})