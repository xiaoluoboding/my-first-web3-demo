<template>
  <header>
    <div class="wrapper flex items-center justify-between">
      <div class="account text-2xl flex flex-1">
        <span v-if="account">{{ `Logged as: ${ensName || account}` }}</span>
      </div>
      <div class="space-x-4 flex justify-center" lg="justify-end">
        <button
          border="~ [var(--color-border)]"
          class="p-2 rounded-md"
          @click="(e) => toggleDark()"
        >
          <carbon:moon class="w-6 h-6" v-if="isDark" />
          <carbon:sun class="w-6 h-6" v-else />
        </button>
        <button
          border="~ [var(--color-border)]"
          class="p-2 rounded-md"
          @click="toggleLocales"
        >
          <carbon:language class="w-6 h-6" />
        </button>
        <button
          border="~ [var(--color-border)]"
          class="p-2 rounded-md"
          @click="gotoGitHub"
        >
          <carbon:logo-github class="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAccountStore } from '@/stores/account'
import { isDark, toggleDark } from '@/composables/useDark'
const { locale, availableLocales } = useI18n()

const gotoGitHub = () => {
  window.open('https://github.com/xiaoluoboding/my-first-web3-demo', '_blank')
}

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  console.log(locale.value)
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const accountStore = useAccountStore()

const account = computed(() => accountStore.shortAccount)
const ensName = computed(() => accountStore.ensName)
</script>

<style>
@import '@/assets/base.css';

#app {
  @apply max-w-screen-xl mx-auto my-0 p-8 font-normal;
}
</style>
