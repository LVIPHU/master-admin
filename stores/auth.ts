import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserDto } from '@/packages/models'

type AuthState = {
  user: UserDto | null
}

type AuthActions = {
  setUser: (user: UserDto | null) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user })
      },
    }),
    { name: 'auth' }
  )
)
