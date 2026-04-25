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
import { useConfirmDialog } from '~/composables/useConfirmDialog';

const { isOpen, title, description, accept, cancel } = useConfirmDialog();
</script>

<template>
  <AlertDialog :open="isOpen" @update:open="val => { if (!val) cancel() }">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="cancel">Cancel</AlertDialogCancel>
        <!-- Adding some inline styling to ensure destructiveness look in case Tailwind isn't fully configured here, but primary classes mostly apply -->
        <AlertDialogAction @click="accept" class="bg-red-600 hover:bg-red-700 text-white border-none">
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
