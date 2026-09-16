<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  isDestructive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  cancelText: 'Cancel',
  confirmText: 'Continue',
  isDestructive: false,
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  'update:open': [value: boolean];
}>();

const handleOpenChange = (newOpen: boolean) => {
  emit('update:open', newOpen);
  if (!newOpen) {
    emit('cancel');
  }
};

const handleConfirm = () => {
  emit('confirm');
  emit('update:open', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:open', false);
};
</script>

<template>
  <AlertDialog :open="props.open" @update:open="handleOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">
          {{ cancelText }}
        </AlertDialogCancel>
        <AlertDialogAction
          @click="handleConfirm"
          :class="isDestructive ? 'bg-red-600 hover:bg-red-700 text-white border-none' : ''"
        >
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
