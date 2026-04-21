import { apiConfiguration, inioApiConfiguration } from '@/queries/utils'
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources'
import { ReportDataTba3Api } from '@tba3/api-new'
import { computed, type ComputedRef } from 'vue'

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
    return useQuery({
        queryKey: ['user-items-base', code.value],
        queryFn: async () => {
            if (!code.value) return []
            const config = await inioApiConfiguration()
            const api = new ReportDataTba3Api(config)
            const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
                tgId: 270,
                groupId: 1001,
                testId: 9524,
                type: 'students',
                studentCode: code.value,
            })
            const students = response.data?.studentsData ?? [];

            const targetUser = students.find((u) => u.code === code.value)
            return targetUser?.items ?? []
        },
        enabled: computed(() => !!code.value),
        staleTime: 1000 * 60 * 60,
    })
}
