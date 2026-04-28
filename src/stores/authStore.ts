import { create } from 'zustand'
import type { UserInfo, LoginForm, RegisterForm } from '@/types'

interface AuthState {
  user: UserInfo | null
  token: string | null
  isAuthenticated: boolean
  login: (form: LoginForm) => Promise<{ success: boolean; message: string }>
  register: (form: RegisterForm) => Promise<{ success: boolean; message: string }>
  logout: () => void
  setUser: (user: UserInfo) => void
}

const mockUsers = [
  { id: 'u0', account: 'admin', name: '管理员', phone: '13800000000', role: '系统管理员', password: '123456' },
  { id: 'u1', account: 'zhangsan', name: '张三', phone: '13800000001', role: '采购经理', password: '123456' },
  { id: 'u2', account: 'lisi', name: '李四', phone: '13800000002', role: '销售经理', password: '123456' },
]

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('wtm_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })(),
  token: localStorage.getItem('wtm_token'),
  isAuthenticated: !!localStorage.getItem('wtm_token'),

  login: async (form) => {
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 500))
    const user = mockUsers.find(
      (u) => u.account === form.account && u.password === form.password,
    )
    if (!user) {
      return { success: false, message: '账号或密码错误' }
    }
    const { password: _pw, ...userInfo } = user
    const token = 'mock_token_' + Date.now()
    localStorage.setItem('wtm_token', token)
    localStorage.setItem('wtm_user', JSON.stringify(userInfo))
    set({ user: userInfo, token, isAuthenticated: true })
    return { success: true, message: '登录成功' }
  },

  register: async (form) => {
    await new Promise((r) => setTimeout(r, 500))
    if (form.password !== form.confirmPassword) {
      return { success: false, message: '两次输入的密码不一致' }
    }
    // Mock注册成功
    const userInfo: UserInfo = {
      id: 'new_' + Date.now(),
      account: form.phone,
      name: form.name,
      phone: form.phone,
      role: '普通用户',
    }
    const token = 'mock_token_' + Date.now()
    localStorage.setItem('wtm_token', token)
    localStorage.setItem('wtm_user', JSON.stringify(userInfo))
    set({ user: userInfo, token, isAuthenticated: true })
    return { success: true, message: '注册成功' }
  },

  logout: () => {
    localStorage.removeItem('wtm_token')
    localStorage.removeItem('wtm_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => {
    localStorage.setItem('wtm_user', JSON.stringify(user))
    set({ user })
  },
}))
