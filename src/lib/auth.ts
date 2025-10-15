import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  birthday?: Date
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub OAuth 
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // Email/Password credentials
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // First check demo accounts for development
          const demoAccount = TEST_ACCOUNTS.find(
            account => account.email === credentials.email && account.password === credentials.password
          )

          if (demoAccount) {
            return {
              id: demoAccount.id,
              name: demoAccount.name,
              email: demoAccount.email,
              image: demoAccount.avatar
            }
          }

          // Then check database for real users
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            return null
          }

          // For users created via registration API (they have hashed passwords)
          // Demo users in seed don't have hashed passwords, so we handle both cases
          let isPasswordValid = false
          
          if (user.password) {
            // Compare with bcrypt hash
            isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          } else {
            // For seed users without hashed passwords, direct comparison
            isPasswordValid = credentials.password === 'demo123'
          }

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

// Helper function to get server session
export async function getServerSession() {
  const { getServerSession } = await import('next-auth')
  return await getServerSession(authOptions)
}

// Test accounts for development
export const TEST_ACCOUNTS = [
  {
    id: 'demo-anh-001',
    email: 'anh@loveeee.app',
    password: 'demo123',
    name: 'Anh Yêu',
    avatar: '/avatars/user1.jpg',
    description: 'Tài khoản demo - Anh trong cặp đôi'
  },
  {
    id: 'demo-em-002',
    email: 'em@loveeee.app', 
    password: 'demo123',
    name: 'Em Thương',
    avatar: '/avatars/user2.jpg',
    description: 'Tài khoản demo - Em trong cặp đôi'
  }
]
