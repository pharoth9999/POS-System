<script setup lang="ts">
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<template>
  <!-- Layouts are parent routes (see router/index.ts), so App only hosts the router and toasts. -->
  <RouterView />
  <ToastContainer />
</template>
