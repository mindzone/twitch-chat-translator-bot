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
import { useI18n } from "vue-i18n";

const {username} = useTwitchUsername();
const router = useRouter();
const {token, getTokenInfo} = useTwitchToken();
const {toast} = useToast();
const {t} = useI18n();

const formSchema = toTypedSchema(z.object({
    token: z.string().min(1, t('getting started.rules.token required')),
    username: z.string().min(1, t('getting started.rules.channel required')),
}));

const {isFieldDirty, handleSubmit, isSubmitting} = useForm({
    validationSchema: formSchema,
    initialValues: {
        token: token.value,
        username: username.value,
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
            title: t('getting started.successfully connected.title'),
            description: t('getting started.successfully connected.description', {name: info.userName}),
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
                <CardTitle>{{ $t('getting started.getting started') }}</CardTitle>
                <CardDescription class="mt-2">
                    {{ $t('getting started.introduction') }}
                </CardDescription>
                <CardDescription>
                    <p v-html="$t('getting started.token help')"></p>
                    <Button as="a" class="px-0" href="https://twitchtokengenerator.com/" target="_blank" variant="link">
                        {{ $t('getting started.open token generator') }}
                        <IconExternalLink :size="14" class="ml-1" color="currentColor"/>
                    </Button>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="token">
                        <FormItem>
                            <FormLabel>{{ $t('getting started.token') }}</FormLabel>
                            <FormControl>
                                <Input :disabled="isSubmitting" placeholder="Enter your token" type="password"
                                       v-bind="componentField"/>
                            </FormControl>
                            <FormDescription>
                                {{ $t('getting started.token hint') }}
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="username">
                        <FormItem>
                            <FormLabel>{{ $t('getting started.channel') }}</FormLabel>
                            <FormControl>
                                <Input :disabled="isSubmitting" placeholder="Your Twitch channel" type="text"
                                       v-bind="componentField"/>
                            </FormControl>
                            <FormDescription>
                                {{ $t('getting started.channel hint') }}
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <Button :disabled="isSubmitting" type="submit">
                        <IconLoader v-if="isSubmitting" :size="14" class="mr-1 animate-spin" color="currentColor"/>
                        <span v-if="isSubmitting">{{ $t('submitting') }}</span>
                        <span v-else>{{ $t('getting started.continue') }}</span>
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