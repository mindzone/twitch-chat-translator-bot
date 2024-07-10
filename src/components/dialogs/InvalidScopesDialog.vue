<script lang="ts" setup>
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const model = defineModel({default: true})
</script>

<template>
    <AlertDialog :open="model">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ $t('getting started.invalid scopes dialog.title') }}</AlertDialogTitle>
                <AlertDialogDescription>
                    <i18n-t keypath="getting started.invalid scopes dialog.description">
                        <Badge>chat:edit</Badge>
                        <Badge>chat:read</Badge>
                    </i18n-t>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel @click="model = false">
                    {{ $t('getting started.invalid scopes dialog.close') }}
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<style scoped>

</style>