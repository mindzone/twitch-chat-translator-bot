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
                <AlertDialogTitle>Invalid Token</AlertDialogTitle>
                <AlertDialogDescription>
                    Make sure you have entered the correct token.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel @click="model = false">Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<style scoped>

</style>