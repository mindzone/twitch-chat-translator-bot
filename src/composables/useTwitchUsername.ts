import { useStorage } from '@vueuse/core';

export function useTwitchUsername() {
    const username = useStorage<string | undefined>('twitch-username', undefined);

    return {
        username,
    };
}