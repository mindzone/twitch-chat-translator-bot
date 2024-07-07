import { useStorage } from '@vueuse/core';
import { getTokenInfo } from "@twurple/auth";

export function useTwitchToken() {
    const token = useStorage<string | null>('twitch-token', null);

    async function validateToken() {
        if (!token.value) {
            return false;
        }

        try {
            const info = await getTokenInfo(token.value);
            if (!info.scopes.includes('chat:edit') || !info.scopes.includes('chat:read')) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        token,
        getTokenInfo,
        validateToken
    };
}