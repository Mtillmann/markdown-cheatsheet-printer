<script setup lang="ts">
import { inject } from 'vue';


const state = inject('appState') as any  // eslint-disable-line @typescript-eslint/no-explicit-any



</script>


<template>
    <div class="fixed inset-0 z-[9999] bg-black/80 flex flex-col items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
        <div class="mt-4 text-base-content text-center">{{ state.loadingMessage }}</div>
    </div>

</template>