<script lang="ts" setup>
import { FieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from "@/composables/useSettings.ts";
import { useToast } from '@/components/ui/toast/use-toast';
import { IconChevronLeft, IconX } from '@tabler/icons-vue';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const {settings} = useSettings();
const {toast} = useToast();

const startupMessagesFormSchema = toTypedSchema(z.object({
    messages: z
        .array(
            z.object({
                value: z
                    .string({message: t('settings.startup messages.rules.message required')})
                    .max(500, {
                        message: t('settings.startup messages.rules.message length'),
                    }),
            }),
        ),
}));

const {handleSubmit, resetForm} = useForm({
    validationSchema: startupMessagesFormSchema,
    initialValues: {
        messages: settings.value.startupMessages.map(message => ({value: message})),
    },
});

const onSubmit = handleSubmit((values) => {
    settings.value.startupMessages = values.messages
        .filter(message => message.value.trim() !== '')
        .map(message => message.value);

    resetForm({
        values: {
            messages: values.messages
        }
    });

    toast({
        title: 'Messages saved',
    });
});
</script>

<template>
    <div class="p-4 h-screen">
        <Card>
            <CardHeader>
                <CardTitle>{{ $t('settings.startup messages.label') }}</CardTitle>
                <CardDescription class="mt-2">
                    {{ $t('settings.startup messages.description') }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-8" @submit="onSubmit">
                    <div>
                        <FieldArray v-slot="{ fields, push, remove }" name="messages">
                            <div v-for="(field, index) in fields" :key="`messages-${field.key}`">
                                <FormField v-slot="{ componentField }" :name="`messages[${index}].value`">
                                    <FormItem>
                                        <FormLabel :class="cn(index !== 0 && 'sr-only')">
                                            {{ $t('settings.startup messages.messages') }}
                                        </FormLabel>
                                        <div class="relative flex items-center">
                                            <FormControl>
                                                <Input type="text" v-bind="componentField"/>
                                            </FormControl>
                                            <button class="absolute py-2 pe-3 end-0 text-muted-foreground" type="button"
                                                    @click="remove(index)">
                                                <IconX class="w-3"/>
                                            </button>
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                </FormField>
                            </div>

                            <Button
                                class="text-xs mt-2"
                                size="sm"
                                type="button"
                                variant="outline"
                                @click="push({ value: '' })"
                            >
                                {{ $t('settings.startup messages.add message') }}
                            </Button>
                        </FieldArray>
                    </div>

                    <div class="flex gap-2 justify-start">
                        <Button type="submit">
                            {{ $t('save') }}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            @click="resetForm"
                        >
                            {{ $t('reset form') }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        <Button as-child class="mt-2" variant="outline">
            <RouterLink to="/dashboard">
                <IconChevronLeft :size="16" class="mr-1"/>
                {{ $t('back') }}
            </RouterLink>
        </Button>
    </div>
</template>

<style scoped>

</style>