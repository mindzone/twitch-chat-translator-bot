<script lang="ts" setup>
import { IconLoader } from "@tabler/icons-vue";
import { onMounted } from "vue";
import { useTwitchToken } from "@/composables/useTwitchToken.ts";
import { useRouter } from "vue-router";
import { useTwitchUsername } from "@/composables/useTwitchUsername.ts";

const {validateToken} = useTwitchToken();
const {username} = useTwitchUsername();
const router = useRouter();

onMounted(async () => {
    const tokenIsValid = await validateToken();

    if (tokenIsValid && username.value) {
        await router.replace({path: '/dashboard'});
        return
    }

    await router.replace({path: '/getting-started'});
});
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <IconLoader :size="24" class="mr-1 animate-spin" color="currentColor"/>
    </div>
</template>

<style scoped>

</style>