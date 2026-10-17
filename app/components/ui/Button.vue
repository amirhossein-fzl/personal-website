<script setup lang="ts">
import { Primitive } from 'reka-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import type { NuxtLinkProps } from '#app';
import { omit } from '@@/utils';

const button = cva([
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap cursor-pointer',
  'rounded-full transition-[background-color,border-color,transform,opacity]',
  'duration-[var(--dur-fast)] ease-[var(--ease-out)]',
  'active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none',
  'aria-disabled:opacity-50 aria-disabled:pointer-events-none',
], {
  variants: {
    variant: {
      primary: 'bg-primary text-on-primary hover:bg-primary/90',
      secondary: 'border border-line bg-surface text-ink hover:bg-surface-2',
    },
    size: {
      sm: 'h-9  px-4 text-small',
      md: 'h-11 px-5 text-body',
      lg: 'h-13 px-6 text-body',
    },
  },
});

type ButtonVariantsProps = VariantProps<typeof button>;

export interface ButtonProps extends Omit<NuxtLinkProps, 'raw' | 'custom'> {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariantsProps['variant'],
  size?: ButtonVariantsProps['size'],
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
});

const classes = computed(() => button({ size: props.size, variant: props.variant }));
const isDisabled = props.disabled || props.loading;
const linkProps = computed(() => omit(props, [
  'type',
  'variant',
  'size',
  'disabled',
  'loading',
]));

</script>

<template>
  <Primitive
  v-if="!to"
    as="button" :type="type"
    :disabled="isDisabled" :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined" :class="classes">
    <slot />
    <span v-if="loading" class="inline-flex gap-1" aria-hidden="true">
      <span class="size-1 rounded-full bg-current animate-pulse" />
      <span class="size-1 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
      <span class="size-1 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
    </span>
  </Primitive>
  <NuxtLink v-else :class="classes" v-bind="linkProps">
    <slot />
  </NuxtLink>
</template>