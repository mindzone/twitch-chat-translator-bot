import { useStorage } from '@vueuse/core';

interface Settings {
    postWelcomeMessage: boolean;
    welcomeMessages: string[];
}

const DefaultSettings: Settings = {
    postWelcomeMessage: true,
    welcomeMessages: [
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