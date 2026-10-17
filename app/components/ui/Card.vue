<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui';

withDefaults(defineProps<{
  as?: PrimitiveProps['as'] | 'article',
}>(), {
  as: 'div',
});

</script>

<template>
  <Primitive :as="as" class="relative card-surface overflow-hidden transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]">
    <slot />
  </Primitive>
</template>
