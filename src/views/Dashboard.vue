<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { useTwitch } from "@/composables/useTwitch.ts";
import ConnectionStateCard from "@/components/twitch/ConnectionStateCard.vue";
import DashboardSettingsCard from "@/components/settings/DashboardSettingsCard.vue";

const twitch = useTwitch();
</script>

<template>
    <div class="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-screen">
        <ConnectionStateCard/>
        <DashboardSettingsCard class="row-span-2"/>

        <div>
            Dashboard

            <RouterLink to="/">
                <Button>
                    Home
                </Button>
            </RouterLink>

            <RouterLink to="/getting-started">
                <Button>
                    Get started
                </Button>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>

</style>