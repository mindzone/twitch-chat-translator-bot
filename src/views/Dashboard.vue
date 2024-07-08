<script lang="ts" setup>
import { useTwitch } from "@/composables/useTwitch.ts";
import ConnectionStateCard from "@/components/twitch/ConnectionStateCard.vue";
import DashboardSettingsCard from "@/components/settings/DashboardSettingsCard.vue";

const twitch = useTwitch();
</script>

<template>
    <div class="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-screen">
        <ConnectionStateCard/>
        <DashboardSettingsCard class="row-span-2"/>
    </div>
</template>

<style scoped>

</style>