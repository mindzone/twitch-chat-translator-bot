import { useStorage } from '@vueuse/core';

interface Settings {
    postWelcomeMessage: boolean;
    welcomesMessages: string[];
}

const DefaultSettings: Settings = {
    postWelcomeMessage: true,
    welcomesMessages: [
        'Twitch Chat Translator Bot connected.'
    ]
}

export function useSettings() {
    const settings = useStorage(
        'settings',
        DefaultSettings,
        localStorage,
        {mergeDefaults: true}
    );

    return {
        settings
    };
}