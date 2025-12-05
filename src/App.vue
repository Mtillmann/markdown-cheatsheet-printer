<script setup lang="ts">
import TabBar from '@/components/TabBar.vue'
import Markdown from '@/components/Markdown.vue'
import CSS from '@/components/CSS.vue'
import Layout from '@/components/Layout.vue'
import Design from '@/components/Design.vue'
import Options from '@/components/Options.vue'
import Loading from './components/Loading.vue'
import Print from '@/components/Print.vue'
import FirefoxOnlyWarningModal from './components/FirefoxOnlyWarningModal.vue'
import { inject } from 'vue'


const state = inject('appState') as any  // eslint-disable-line @typescript-eslint/no-explicit-any


</script>


<template>
  <div class="flex flex-col h-screen">
    <TabBar />
    <div class="flex-1 overflow-auto">
      <Markdown v-if="state.currentTab === 'Markdown'" />
      <CSS v-if="state.currentTab === 'CSS'" />
      <Design v-if="state.currentTab === 'Design'" />
      <Layout v-if="state.currentTab === 'Layout'" />
      <Options v-if="state.currentTab === 'Options'" />
      <Print v-if="state.currentTab === 'Print'" />
    </div>
  </div>
  <Loading v-if="state.loading"/>
  <FirefoxOnlyWarningModal />
</template>
