import { useMutation } from '@tanstack/vue-query'
import { ReportDataTba3Api } from '@tba3/api-new'
import { inioApiConfiguration, inioAuthApiConfiguration } from '@/queries/utils'
import { DEMO_GROUP_ID, DEMO_TEST_GROUP_ID, DEMO_TEST_ID } from '@/stores/auth'

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
    testId: string
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

  const reportConfiguration = await inioApiConfiguration()
  const reportApi = new ReportDataTba3Api(reportConfiguration)
  const reportResponse = await reportApi.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
    tgId: Number(import.meta.env.VITE_TEST_GROUP || 270),
    testId: Number(data.data.testId),
    groupId: Number(data.data.groupId),
    schoolId: Number(data.data.schoolId),
    type: 'students',
    studentCode: request.loginCode,
  })

  if ((reportResponse.data?.studentsData ?? []).length === 0) {
    throw new Error('Der Schülercode ist ungültig oder es liegen keine Daten vor.')
  }

  return data
}

export async function validateDemoStudentCode(studentCode: string) {
  const configuration = await inioApiConfiguration()
  const api = new ReportDataTba3Api(configuration)
  const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdAggregationsGet({
    tgId: DEMO_TEST_GROUP_ID,
    testId: DEMO_TEST_ID,
    groupId: DEMO_GROUP_ID,
    aggregation: 'generalMathematicalCompetence',
    type: 'students',
    studentCode,
  })

  if ((response.data?.studentsData ?? []).length === 0) {
    throw new Error('Der Schülercode ist ungültig oder es liegen keine Daten vor.')
  }
}

export function useStudentLoginMutation() {
  return useMutation({ mutationFn: loginStudent })
}
