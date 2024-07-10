<script lang="ts" setup>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from "@/composables/useSettings.ts";

const {settings} = useSettings();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>{{ $t('settings.settings') }}</CardTitle>
            <CardDescription>{{ $t('settings.manage settings') }}</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="flex items-center justify-between space-x-2">
                <Label class="flex flex-col space-y-1" for="postStartupMessage">
                    <span>{{ $t('settings.language.label') }}</span>
                    <span class="font-normal leading-snug text-muted-foreground">
                        {{ $t('settings.language.description') }}
                    </span>
                </Label>
                <Select v-model="settings.language">
                    <SelectTrigger class="ml-auto w-[120px]">
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                            {{ $t('locales.' + locale) }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="flex items-center justify-between space-x-2">
                <Label class="flex flex-col space-y-1" for="postStartupMessage">
                    <span>{{ $t('settings.startup messages.label') }}</span>
                    <span class="font-normal leading-snug text-muted-foreground">
                        {{ $t('settings.startup messages.description') }}
                    </span>
                    <div v-if="settings.postStartupMessage">
                        <Button as-child class="p-0" variant="link">
                            <RouterLink to="/settings/startup-messages">
                                {{ $t('settings.startup messages.configure') }}
                            </RouterLink>
                        </Button>
                    </div>
                </Label>
                <Switch id="postStartupMessage" v-model:checked="settings.postStartupMessage"/>
            </div>
            <div class="flex items-center justify-between space-x-2">
                <Label class="flex flex-col space-y-1" for="postWelcomeMessage">
                    <span>{{ $t('settings.welcome messages.label') }}</span>
                    <span class="font-normal leading-snug text-muted-foreground">
                        {{ $t('settings.welcome messages.description') }}
                    </span>
                    <div v-if="settings.postWelcomeMessage">
                        <Button as-child class="p-0" variant="link">
                            <RouterLink to="/settings/welcome-messages">
                                {{ $t('settings.welcome messages.configure') }}
                            </RouterLink>
                        </Button>
                    </div>
                </Label>
                <Switch id="postWelcomeMessage" v-model:checked="settings.postWelcomeMessage"/>
            </div>
        </CardContent>
        <CardFooter>
            <Button class="w-full" variant="outline">
                {{ $t('settings.more settings') }}
            </Button>
        </CardFooter>
    </Card>
</template>

<style scoped>

</style>