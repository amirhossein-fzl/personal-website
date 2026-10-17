<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PhSun, PhMoon, PhDesktop } from '@phosphor-icons/vue';
import { Primitive } from 'reka-ui';

type Mode = 'light' | 'dark' | 'system';
const mode = ref<Mode>('system');

function apply(m: Mode) {
  const root = document.documentElement;
  const isDark = m === 'dark' ||
    (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
  try { localStorage.setItem('theme', m); } catch { }
}

function cycle() {
  const order: Mode[] = ['light', 'dark', 'system'];
  const idx = order.indexOf(mode.value);
  mode.value = order[(idx + 1) % order.length] ?? 'system';
  apply(mode.value);
}

onMounted(() => {
  const stored = (localStorage.getItem('theme') as Mode | null) ?? 'system';
  mode.value = stored;
  apply(stored);
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', () => mode.value === 'system' && apply('system'));
});

const nextLabel = {
  light: 'Switch to dark theme',
  dark: 'Switch to system theme',
  system: 'Switch to light theme',
}[mode.value];
</script>

<template>
  <Primitive
as="button"
type="button" :aria-label="nextLabel" class="inline-flex items-center justify-center size-11 rounded-full border border-line
           bg-surface text-ink hover:bg-surface-2 transition-colors duration-[var(--dur-fast)] cursor-pointer
           active:scale-[.97]" @click="cycle">
    <PhSun v-if="mode === 'light'" :size="20" weight="regular" />
    <PhMoon v-else-if="mode === 'dark'" :size="20" weight="regular" />
    <PhDesktop v-else :size="20" weight="regular" />
  </Primitive>
</template>