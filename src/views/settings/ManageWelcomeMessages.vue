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

const {settings} = useSettings();
const {toast} = useToast();

const welcomeMessagesFormSchema = toTypedSchema(z.object({
    type: z.enum(['firstTime', 'firstTimeStream'], {
        required_error: 'You need to select a type.',
    }),
    interval: z.array(
        z.number().min(0).max(600),
    ),
    messages: z
        .array(
            z.object({
                value: z
                    .string({message: 'Please enter a valid message.'})
                    .max(500, {
                        message: 'Message must not be longer than 500 characters.',
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
        title: 'Settings saved',
    });
});
</script>

<template>
    <div class="p-4 h-screen">
        <Card>
            <CardHeader>
                <CardTitle>Welcome messages</CardTitle>
                <CardDescription class="mt-2">
                    These messages will be posted to the chat when a user joins the chat.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-8" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="type" type="radio">
                        <FormItem class="space-y-3">
                            <FormLabel>When to send a welcome message</FormLabel>
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
                                            The first time someone joins the chat ever.
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem class="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="firstTimeStream"/>
                                        </FormControl>
                                        <FormLabel class="font-normal">
                                            The first time someone joins the chat during the current stream.
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField, value }" name="interval">
                        <FormItem>
                            <FormLabel>Seconds between welcome messages</FormLabel>
                            <FormControl>
                                <Slider
                                    :default-value="[30]"
                                    :max="600"
                                    :min="0"
                                    :step="5"
                                    v-bind="componentField"
                                />
                                <FormDescription class="flex justify-between">
                                    <span>How many seconds should there be between welcome messages?</span>
                                    <span>{{ value?.[0] }} seconds</span>
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
                                            Messages
                                        </FormLabel>
                                        <FormDescription :class="cn(index !== 0 && 'sr-only')">
                                            Use the
                                            <Badge variant="secondary">%user</Badge>
                                            placeholder to mention the user
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
                                Add message
                            </Button>
                        </FieldArray>
                    </div>

                    <div class="flex gap-2 justify-start">
                        <Button type="submit">
                            Save
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            @click="resetForm"
                        >
                            Reset form
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        <Button as-child class="mt-2" variant="outline">
            <RouterLink to="/dashboard">
                <IconChevronLeft :size="16" class="mr-1"/>
                Back
            </RouterLink>
        </Button>
    </div>
</template>

<style scoped>

</style>