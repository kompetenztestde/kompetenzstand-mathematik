import { useMutation } from '@tanstack/vue-query'
import { inioAuthApiConfiguration } from '@/queries/utils'

type StudentLoginRequest = {
  surveyId: number
  loginPw: string
  loginCode: string
}

export type StudentLoginResponse = {
  success: boolean
  message: string
  data?: {
    token: string
    tokenExpiresIn: number
    tokenExpiresAt: string
    schoolId: string
    groupId: string
  }
}

async function loginStudent(request: StudentLoginRequest) {
  const configuration = await inioAuthApiConfiguration()
  const response = await fetch(`${configuration.basePath}/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = (await response.json()) as StudentLoginResponse

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || 'Anmeldung fehlgeschlagen.')
  }

  return data
}

export function useStudentLoginMutation() {
  return useMutation({ mutationFn: loginStudent })
}
