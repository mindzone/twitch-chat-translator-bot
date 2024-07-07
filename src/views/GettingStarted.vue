<script lang="ts" setup>
import * as z from 'zod';
import InvalidTokenDialog from "@/components/dialogs/InvalidTokenDialog.vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconExternalLink, IconLoader } from '@tabler/icons-vue';
import { Input } from '@/components/ui/input'
import { ref } from "vue";
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useTwitchToken } from '@/composables/useTwitchToken.ts';
import { useToast } from '@/components/ui/toast/use-toast';
import InvalidScopesDialog from "@/components/dialogs/InvalidScopesDialog.vue";
import { useTwitchUsername } from "@/composables/useTwitchUsername.ts";
import { useRouter } from "vue-router";

const {username} = useTwitchUsername();
const router = useRouter();
const {token, getTokenInfo} = useTwitchToken();
const {toast} = useToast();

const formSchema = toTypedSchema(z.object({
    token: z.string(),
    username: z.string(),
}));

const {isFieldDirty, handleSubmit, isSubmitting} = useForm({
    validationSchema: formSchema,
    initialValues: {
        username: username.value
    }
});

const showInvalidTokenDialog = ref(false);
const showInvalidScopesDialog = ref(false);

const onSubmit = handleSubmit(async (values) => {
    showInvalidTokenDialog.value = false;
    showInvalidScopesDialog.value = false;

    username.value = values.username;

    try {
        const info = await getTokenInfo(values.token);

        if (!info.scopes.includes('chat:edit') || !info.scopes.includes('chat:read')) {
            showInvalidScopesDialog.value = true;
            return;
        }

        token.value = values.token;

        toast({
            title: 'Successfully connected',
            description: `Connected as ${info.userName}`,
        });

        await router.replace({path: '/dashboard'});
    } catch (e) {
        showInvalidScopesDialog.value = false;
        showInvalidTokenDialog.value = true;
    }
})
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <Card class="max-w-md">
            <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription class="mt-2">To get started using the Translator Bot you will need to provide a Twitch
                    Bot Access token that allows the bot to connect to Twitch.
                </CardDescription>
                <CardDescription>
                    The easiest way to obtain a token is by generating a <br> "<b>Bot Chat Token</b>" using the Twitch
                    Token Generator.
                    <Button as="a" class="px-0" href="https://twitchtokengenerator.com/" target="_blank" variant="link">
                        Go to the Twitch Token Generator
                        <IconExternalLink :size="14" class="ml-1" color="currentColor"/>
                    </Button>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="token">
                        <FormItem>
                            <FormLabel>Token</FormLabel>
                            <FormControl>
                                <Input :disabled="isSubmitting" placeholder="Enter your token" type="password"
                                       v-bind="componentField"/>
                            </FormControl>
                            <FormDescription>
                                Never share this token with anyone.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="username">
                        <FormItem>
                            <FormLabel>Twitch Channel</FormLabel>
                            <FormControl>
                                <Input :disabled="isSubmitting" placeholder="Your Twitch channel" type="text"
                                       v-bind="componentField"/>
                            </FormControl>
                            <FormDescription>
                                The name of your Twitch Channel.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <Button :disabled="isSubmitting" type="submit">
                        <IconLoader v-if="isSubmitting" :size="14" class="mr-1 animate-spin" color="currentColor"/>
                        <span v-if="isSubmitting">Loading</span>
                        <span v-else>Continue</span>
                    </Button>
                </form>
            </CardContent>
        </Card>

        <InvalidTokenDialog v-model="showInvalidTokenDialog"/>
        <InvalidScopesDialog v-model="showInvalidScopesDialog"/>
    </div>
</template>

<style scoped>

</style>