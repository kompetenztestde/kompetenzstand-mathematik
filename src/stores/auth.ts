import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Role = 'teacher' | 'student' | 'demo' | 'demo-student'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(sessionStorage.getItem('token'))
    const role = ref<Role | null>((sessionStorage.getItem('role') as Role | null) ?? null)
    const expiresAt = ref<number | null>(sessionStorage.getItem('expires-at') ? Number(sessionStorage.getItem('expires-at')) : null)
    const studentCode = ref<string | null>(sessionStorage.getItem('student-code'))
    const studentGroupId = ref<number | null>(
        sessionStorage.getItem('student-group-id') ? Number(sessionStorage.getItem('student-group-id')) : null,
    )

    const isAuthenticated = computed(() => !!token.value)
    const isSessionExpired = computed(() => !!expiresAt.value && Date.now() > expiresAt.value)

    function login(newToken: string, newRole: Role, tokenExpiresAt?: string, newStudentCode?: string, newGroupId?: number) {
        const expiry = tokenExpiresAt
            ? new Date(tokenExpiresAt).getTime()
            : (() => {
                const d = new Date()
                d.setHours(23, 59, 59, 999)
                return d.getTime()
            })()

        token.value = newToken
        role.value = newRole
        expiresAt.value = expiry

        const trimmed = newStudentCode?.trim()
        const normalizedCode = trimmed ? (trimmed.length > 3 ? trimmed.slice(0, 3) : trimmed) : null
        studentCode.value = normalizedCode

        sessionStorage.setItem('token', newToken)
        sessionStorage.setItem('role', newRole)
        sessionStorage.setItem('expires-at', String(expiry))

        if (normalizedCode) {
            sessionStorage.setItem('student-code', normalizedCode)
        } else {
            sessionStorage.removeItem('student-code')
        }

        studentGroupId.value = newGroupId ?? null
        if (newGroupId) {
            sessionStorage.setItem('student-group-id', String(newGroupId))
        } else {
            sessionStorage.removeItem('student-group-id')
        }
    }

    function logout() {
        token.value = null
        role.value = null
        expiresAt.value = null
        studentCode.value = null
        studentGroupId.value = null

        sessionStorage.removeItem('token')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('expires-at')
        sessionStorage.removeItem('student-code')
        sessionStorage.removeItem('student-group-id')

        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('expires-at')
        localStorage.removeItem('student-code')
        localStorage.removeItem('student-group-id')
    }

    return {
        token,
        role,
        studentCode,
        studentGroupId,
        isAuthenticated,
        isSessionExpired,
        login,
        logout,
    }
})
