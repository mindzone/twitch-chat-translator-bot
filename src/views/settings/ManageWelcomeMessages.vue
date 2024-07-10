<script lang="ts" setup>
import { FieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettings } from "@/composables/useSettings.ts";
import { useToast } from '@/components/ui/toast/use-toast';
import { IconChevronLeft, IconX } from '@tabler/icons-vue';
import { Slider } from '@/components/ui/slider';
import { Badge } from "@/components/ui/badge";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const {settings} = useSettings();
const {toast} = useToast();

const welcomeMessagesFormSchema = toTypedSchema(z.object({
    type: z.enum(['firstTime', 'firstTimeStream'], {
        required_error: t('settings.welcome messages.rules.type invalid'),
        invalid_type_error: t('settings.welcome messages.rules.type invalid'),
    }),
    interval: z.array(
        z.number().min(0).max(600),
    ),
    messages: z
        .array(
            z.object({
                value: z
                    .string({message: t('settings.welcome messages.rules.message required')})
                    .max(500, {
                        message: t('settings.welcome messages.rules.message length'),
                    }),
            }),
        ),
}));

const {handleSubmit, resetForm} = useForm({
    validationSchema: welcomeMessagesFormSchema,
    initialValues: {
        messages: settings.value.welcomeMessages.map(message => ({value: message})),
        interval: [settings.value.intervalBetweenWelcomeMessages],
        type: settings.value.welcomeMessageSendWhen,
    },
});

const onSubmit = handleSubmit((values) => {
    settings.value.welcomeMessages = values.messages
        .filter(message => message.value.trim() !== '')
        .map(message => message.value);

    settings.value.intervalBetweenWelcomeMessages = values.interval[0] ?? 30;
    settings.value.welcomeMessageSendWhen = values.type;

    resetForm({
        values: {
            messages: values.messages
        }
    });

    toast({
        title: t('settings.welcome messages.settings saved'),
    });
});
</script>

<template>
    <div class="p-4 h-screen">
        <Card>
            <CardHeader>
                <CardTitle>{{ $t('settings.welcome messages.label') }}</CardTitle>
                <CardDescription class="mt-2">
                    {{ $t('settings.welcome messages.description') }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-8" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="type" type="radio">
                        <FormItem class="space-y-3">
                            <FormLabel>{{ $t('settings.welcome messages.type') }}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    class="flex flex-col space-y-1"
                                    v-bind="componentField"
                                >
                                    <FormItem class="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="firstTime"/>
                                        </FormControl>
                                        <FormLabel class="font-normal">
                                            {{ $t('settings.welcome messages.type first time') }}
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem class="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="firstTimeStream"/>
                                        </FormControl>
                                        <FormLabel class="font-normal">
                                            {{ $t('settings.welcome messages.type first time stream') }}
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField, value }" name="interval">
                        <FormItem>
                            <FormLabel>{{ $t('settings.welcome messages.interval') }}</FormLabel>
                            <FormControl>
                                <Slider
                                    :default-value="[30]"
                                    :max="600"
                                    :min="0"
                                    :step="5"
                                    v-bind="componentField"
                                />
                                <FormDescription class="flex justify-between">
                                    <span>{{ $t('settings.welcome messages.interval description') }}</span>
                                    <span>{{
                                            $t('settings.welcome messages.interval hint', {seconds: value?.[0]})
                                        }}</span>
                                </FormDescription>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <div>
                        <FieldArray v-slot="{ fields, push, remove }" name="messages">
                            <div v-for="(field, index) in fields" :key="`messages-${field.key}`">
                                <FormField v-slot="{ componentField }" :name="`messages[${index}].value`">
                                    <FormItem>
                                        <FormLabel :class="cn(index !== 0 && 'sr-only')">
                                            {{ $t('settings.welcome messages.messages') }}
                                        </FormLabel>
                                        <FormDescription :class="cn(index !== 0 && 'sr-only')">
                                            <i18n-t keypath="settings.welcome messages.messages hint">
                                                <Badge variant="secondary">%user</Badge>
                                            </i18n-t>
                                        </FormDescription>
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
                                {{ $t('settings.welcome messages.add message') }}
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