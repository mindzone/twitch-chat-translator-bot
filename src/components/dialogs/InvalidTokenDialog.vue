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

const model = defineModel({default: true})
</script>

<template>
    <AlertDialog :open="model">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ $t('getting started.invalid token dialog.title') }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ $t('getting started.invalid token dialog.description') }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel @click="model = false">
                    {{ $t('getting started.invalid token dialog.close') }}
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<style scoped>

</style>