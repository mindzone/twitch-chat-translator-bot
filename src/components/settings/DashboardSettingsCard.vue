<script lang="ts" setup>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from "@/composables/useSettings.ts";

const {settings} = useSettings();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage the settings here.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="flex items-center justify-between space-x-2">
                <Label class="flex flex-col space-y-1" for="postWelcomeMessage">
                    <span>Welcome Message(s)</span>
                    <span class="font-normal leading-snug text-muted-foreground">
                        Have the bot post one or more messages on startup.
                    </span>
                    <div v-if="settings.postWelcomeMessage">
                        <Button as-child class="p-0" variant="link">
                            <RouterLink to="/getting-started">
                                Change messages
                            </RouterLink>
                        </Button>
                    </div>
                </Label>
                <Switch id="postWelcomeMessage" v-model:checked="settings.postWelcomeMessage"/>
            </div>
        </CardContent>
        <CardFooter>
            <Button class="w-full" variant="outline">
                More Settings
            </Button>
        </CardFooter>
    </Card>
</template>

<style scoped>

</style>