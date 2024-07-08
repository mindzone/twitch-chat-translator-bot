import { useStorage } from '@vueuse/core';

export interface Settings {
    postWelcomeMessage: boolean;
    postStartupMessage: boolean;
    welcomeMessages: string[];
    startupMessages: string[];
}

export const DefaultSettings: Settings = {
    postStartupMessage: true,
    startupMessages: [
        'Twitch Chat Translator Bot connected.'
    ],
    postWelcomeMessage: true,
    welcomeMessages: [
        'This channel uses a translator. Feel free to speak your native language and the bot will translate it!'
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