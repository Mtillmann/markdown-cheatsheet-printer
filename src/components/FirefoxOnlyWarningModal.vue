<script setup lang="ts">
import { computed, inject, ref } from "vue";

const appState = inject("appState") as any; // eslint-disable-line @typescript-eslint/no-explicit-any
const dismissed = ref(false);
const showWarning = computed(
	() => Boolean(appState && !appState.isFirefox && !dismissed.value)
);

const dismiss = () => {
	dismissed.value = true;
};
</script>

<template>
	<div
		v-if="showWarning"
		class="modal modal-open"
		role="alertdialog"
		aria-labelledby="firefox-modal-title"
		aria-modal="true"
	>
		<div class="modal-box space-y-4">
			<h3 id="firefox-modal-title" class="text-lg font-bold">
				For Best Results Use Firefox
			</h3>
			<p>
				This app relies on a working, deterministic render/preview/print pipeline.
                Currently, Firefox is the only browser that provides this consistently.
                You can use any other browser to edit and design your cheatsheet, but for
                printing, please switch to Firefox.
			</p>
			<div class="modal-action">
				<button type="button" class="btn btn-primary" @click="dismiss">
					Got it
				</button>
			</div>
		</div>
	</div>
</template>
