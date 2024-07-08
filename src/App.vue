<script lang="ts" setup>
import Toaster from '@/components/ui/toast/Toaster.vue';
import { onMounted, watch } from "vue";
import { i18n } from "@/lib/i18n.ts";
import { useSettings } from "@/composables/useSettings.ts";

const {settings} = useSettings();

onMounted(() => {
    i18n.global.locale.value = settings.value.language;
});

watch(() => settings.value.language, (newLanguage) => {
    i18n.global.locale.value = newLanguage;
});
</script>

<template>
    <RouterView/>
    <Toaster/>
</template>

<style scoped>

</style>
