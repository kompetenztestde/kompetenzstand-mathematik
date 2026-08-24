import { apiConfiguration, inioApiConfiguration } from '@/queries/utils'
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources'
import { ReportDataTba3Api } from '@tba3/api-new'
import { computed, type ComputedRef } from 'vue'
import { useAuthStore } from '@/stores/auth'

const testGroupId = Number(import.meta.env.VITE_TEST_GROUP || 270)

export function useUserItems(userName: ComputedRef<string | undefined>) {
    return useQuery({
        queryKey: ['user-items-base', userName.value],
        queryFn: async () => {
            if (!userName.value) return []
            const config = await apiConfiguration()
            const api = new GroupsApi(config)
            const response = await api.getGroupItems({ id: '8b-mathe', type: 'students' })

            const targetUser = response.find((u) => u.name === userName.value)
            return targetUser?.items ?? []
        },
        enabled: computed(() => !!userName.value),
        staleTime: 1000 * 60 * 60,
    })
}

export function useUserItemsNew(code: ComputedRef<string | undefined>) {
    const auth = useAuthStore()
    const query = useQuery({
        queryKey: computed(() => ['user-items-base', code.value]),
        queryFn: async () => {
            if (!code.value) return []
            const config = await inioApiConfiguration()
            const api = new ReportDataTba3Api(config)
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
                tgId: testGroupId,
                groupId: auth.studentGroupId!,
                testId: auth.studentTestId!,
                schoolId: auth.studentSchoolId!,
                type: 'students',
                studentCode: code.value,
            })
            const students = response.data?.studentsData ?? []

            const targetUser = students.find((u) => u.code === code.value)
            return targetUser?.items ?? []
        },
        enabled: computed(() => !!code.value && !!auth.studentGroupId && !!auth.studentTestId && !!auth.studentSchoolId),
        staleTime: 1000 * 60 * 60,
    })

    const stats = computed(() => calculateUserStats(query.data.value))

    return {
        ...query,
        stats,
    }
}

export const calculateUserStats = (items: any[] | undefined) => {
    if (!items || items.length === 0) {
        return { correct: 0, total: 0, percentage: 0 }
    }

    const correct = items.filter((item) => item.descriptiveStatistics?.frequency === 1).length

    const total = items.length
    const percentage = (correct / total) * 100

    return { correct, total, percentage }
}

export function useSchoolForm(code: ComputedRef<string | undefined>) {
    const auth = useAuthStore()
    return useQuery({
        queryKey: computed(() => ['school-form', code.value]),
        queryFn: async () => {
            if (!code.value) return null;
            
            const config = await inioApiConfiguration();
            const api = new ReportDataTba3Api(config);
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
                tgId: testGroupId,
                groupId: auth.studentGroupId!,
                testId: auth.studentTestId!,
                schoolId: auth.studentSchoolId!,
                type: 'students',
                studentCode: code.value,
            });

            return response.data?.groupData?.schoolForm ?? null;
        },
        enabled: computed(() => !!code.value && !!auth.studentGroupId && !!auth.studentTestId && !!auth.studentSchoolId),
        staleTime: 1000 * 60 * 60,
    });
}

export function useTestData(code: ComputedRef<string | undefined>) {
    const auth = useAuthStore()
    return useQuery({
        queryKey: computed(() => ['testId', code.value]),
        queryFn: async () => {
            if (!code.value) return null;
            
            const config = await inioApiConfiguration();
            const api = new ReportDataTba3Api(config);
            const response = await api.testGroupsTgIdTestsGet({
                tgId: testGroupId,
                testIds: String(auth.studentTestId!),
                schoolId: auth.studentSchoolId!,
            });

            return response.data ?? null;
        },
        enabled: computed(() => !!code.value && !!auth.studentTestId && !!auth.studentSchoolId),
        staleTime: 1000 * 60 * 60,
    });
}

