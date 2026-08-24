import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Role = 'teacher' | 'student' | 'demo' | 'demo-student'

export const DEMO_SCHOOL_NUMBER = 'DEMO-TBA3-2026'
export const DEMO_API_KEY_SCHOOL = 'DEMO-TBA3-2026'
export const DEMO_TEST_GROUP_ID = 270
export const DEMO_TEST_ID = 9524
export const DEMO_GROUP_ID = 1001

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(sessionStorage.getItem('token'))
    const role = ref<Role | null>((sessionStorage.getItem('role') as Role | null) ?? null)
    const expiresAt = ref<number | null>(sessionStorage.getItem('expires-at') ? Number(sessionStorage.getItem('expires-at')) : null)
    const studentCode = ref<string | null>(sessionStorage.getItem('student-code'))
    const studentGroupId = ref<number | null>(
        sessionStorage.getItem('student-group-id') ? Number(sessionStorage.getItem('student-group-id')) : null,
    )
    const studentTestId = ref<number | null>(
        sessionStorage.getItem('student-test-id') ? Number(sessionStorage.getItem('student-test-id')) : null,
    )
    const studentSchoolId = ref<number | null>(
        sessionStorage.getItem('student-school-id') ? Number(sessionStorage.getItem('student-school-id')) : null,
    )

    const isAuthenticated = computed(() => !!token.value)
    const isSessionExpired = computed(() => !!expiresAt.value && Date.now() > expiresAt.value)
    const isDemoAccess = computed(() => role.value === 'demo' || role.value === 'demo-student')
    const reportTestGroupId = computed(() => (isDemoAccess.value ? DEMO_TEST_GROUP_ID : null))
    const reportTestId = computed(() => (isDemoAccess.value ? DEMO_TEST_ID : studentTestId.value))
    const reportGroupId = computed(() => (isDemoAccess.value ? DEMO_GROUP_ID : studentGroupId.value))

    function login(
        newToken: string,
        newRole: Role,
        tokenExpiresAt?: string,
        newStudentCode?: string,
        newGroupId?: number,
        newTestId?: number,
        newSchoolId?: number,
    ) {
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

        studentTestId.value = newTestId ?? null
        if (newTestId) {
            sessionStorage.setItem('student-test-id', String(newTestId))
        } else {
            sessionStorage.removeItem('student-test-id')
        }

        studentSchoolId.value = newSchoolId ?? null
        if (newSchoolId) {
            sessionStorage.setItem('student-school-id', String(newSchoolId))
        } else {
            sessionStorage.removeItem('student-school-id')
        }
    }

    function logout() {
        token.value = null
        role.value = null
        expiresAt.value = null
        studentCode.value = null
        studentGroupId.value = null
        studentTestId.value = null
        studentSchoolId.value = null

        sessionStorage.removeItem('token')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('expires-at')
        sessionStorage.removeItem('student-code')
        sessionStorage.removeItem('student-group-id')
        sessionStorage.removeItem('student-test-id')
        sessionStorage.removeItem('student-school-id')

        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('expires-at')
        localStorage.removeItem('student-code')
        localStorage.removeItem('student-group-id')
        localStorage.removeItem('student-test-id')
        localStorage.removeItem('student-school-id')
    }

    return {
        token,
        role,
        studentCode,
        studentGroupId,
        studentTestId,
        studentSchoolId,
        isDemoAccess,
        reportTestGroupId,
        reportTestId,
        reportGroupId,
        isAuthenticated,
        isSessionExpired,
        login,
        logout,
    }
})
