import { apiConfiguration } from '@/queries/utils';
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources';
import { computed, type ComputedRef } from 'vue'

export function useUserItems(userName: ComputedRef<string | undefined>) {
    return useQuery({
        queryKey: ['user-items-base', userName.value],
        queryFn: async () => {
            if (!userName.value) return [];
            const config = await apiConfiguration();
            const api = new GroupsApi(config);
            const response = await api.getGroupItems({ id: '8b-mathe', type: 'students' });
            
            const targetUser = response.find(u => u.name === userName.value);
            return targetUser?.items ?? [];
        },
        enabled: computed(() => !!userName.value),
        staleTime: 1000 * 60 * 60 
    });
}