<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
    const {class: _, ...delegated} = props

    return delegated
})
</script>

<template>
    <AlertDialogTitle
        :class="cn('text-lg font-semibold', props.class)"
        v-bind="delegatedProps"
    >
        <slot/>
    </AlertDialogTitle>
</template>
