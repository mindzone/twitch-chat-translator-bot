<script lang="ts" setup>
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTwitch } from "@/composables/useTwitch.ts";
import { IconCircleCheck, IconCircleX, IconLoader } from "@tabler/icons-vue";

const {connected, connecting, joined, joining, connect, disconnect, join} = useTwitch();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Twitch</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="flex items-center justify-start space-x-2">
                <span>
                    <IconCircleCheck v-if="connected" :size="24" class="text-green-500"/>
                    <IconLoader v-else-if="connecting" :size="24" class="animate-spin"/>
                    <IconCircleX v-else :size="24" class="text-red-500"/>
                </span>
                <Label class="flex flex-col space-y-1">
                    <span>Connected</span>
                </Label>
            </div>
            <div class="flex items-center justify-start space-x-2">
                <span>
                    <IconCircleCheck v-if="joined" :size="24" class="text-green-500"/>
                    <IconLoader v-else-if="joining" :size="24" class="animate-spin"/>
                    <IconCircleX v-else :size="24" class="text-red-500"/>
                </span>
                <Label class="flex flex-col space-y-1">
                    <span>Joined</span>
                </Label>
            </div>
        </CardContent>
        <CardFooter class="space-x-2">
            <Button v-if="!connected" :disabled="connecting" @click="connect">
                <IconLoader v-if="connecting" :size="24" class="animate-spin"/>
                Connect
            </Button>
            <Button v-if="connected && !joined" :disabled="joining" @click="join">
                <IconLoader v-if="joining" :size="24" class="animate-spin"/>
                Join
            </Button>
            <Button v-if="connected" @click="disconnect">Disconnect</Button>
        </CardFooter>
    </Card>
</template>

<style scoped>

</style>