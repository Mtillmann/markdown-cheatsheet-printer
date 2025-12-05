<script setup lang="ts">
import { ref, inject, watch } from "vue"

const state = inject('appState') as any // eslint-disable-line @typescript-eslint/no-explicit-any

const tabs = [
    'Markdown',
    'Design',
    'CSS',
    'Layout',
    'Print',
    'Options'
];

const checkedTab = ref(tabs.indexOf(state.currentTab))


watch(checkedTab, (newIndex) => {
    state.currentTab = tabs[newIndex]
})



</script>

<template>
    <div class="flex items-center justify-between gap-4 w-full pr-2">
        <div class="tabs tabs-lift">
            <input 
                v-for="tab, i in tabs"
                :key="i"
                type="radio" 
                name="tab_bar" 
                class="tab" 
                :aria-label="tab" 
                :value="i"
                v-model="checkedTab"
            />
        </div>

        <Transition name="fade">
            <div v-if="state.status" class="text-xs text-base-content/60 whitespace-nowrap">
                {{ state.status }}
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>