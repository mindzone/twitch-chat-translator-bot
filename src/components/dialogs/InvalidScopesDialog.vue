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
                <AlertDialogTitle>Invalid Token Scopes</AlertDialogTitle>
                <AlertDialogDescription>
                    The token you have entered is valid, but it is missing one of the following scopes:
                    <Badge>chat:edit</Badge>
                    <Badge>chat:read</Badge>
                    . Make sure you have enabled these permissions when generating your token.
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