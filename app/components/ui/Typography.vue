<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

const typography = cva('', {
  variants: {
    variant: {
      'base-lg': 'text-body-lg',
      'base': 'text-small',
      caption: 'text-caption',
    },
    color: {
      primary: 'text-primary',
      muted: 'text-muted',
      theme: 'text-ink',
    },
  },
});

type TypographyVariants = VariantProps<typeof typography>;

const props = withDefaults(defineProps<{
  variant?: TypographyVariants['variant'],
  color?: TypographyVariants['color'],
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span',
}>(), {
  variant: 'base',
  color: 'theme',
  as: 'p',
});

const classes = computed(() => typography({variant: props.variant, color: props.color}));

</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
