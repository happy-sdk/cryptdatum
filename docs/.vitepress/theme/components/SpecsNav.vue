<script setup>
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import VPMenuLink from 'vitepress/dist/client/theme-default/components/VPMenuLink.vue'
import { isActive } from 'vitepress/dist/client/shared'
import { useData } from 'vitepress'
import { computed }from 'vue'


const { theme, page } = useData()


const currentSpec = computed(() => {
  const current = theme.value.specs?.items.find((spec) => isActive(page.value.relativePath, spec.activeMatch || spec.link, !!spec.activeMatch))
  return current ? current.text : theme.value.specs?.title
})

</script>

<template>
  <VPFlyout
    v-if="theme.specs.items.length"
    class="specs-version-menu"
    :label="currentSpec"
    :button="currentSpec"
  >
    <div class="items">
      <VPMenuLink v-for="spec in theme.specs.items" :key="spec.link" :item="spec" />
    </div>
  </VPFlyout>
</template>

<style scoped>
.specs-version-menu {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.title {
  padding: 0 24px 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* Fix dropdown positioning */
.specs-version-menu :deep(.menu) {
  left: 0 !important;
  right: auto !important;
  min-width: 200px;
  z-index: 1000 !important;
}

.specs-version-menu :deep(.VPMenu) {
  position: relative;
}

.specs-version-menu :deep(.items) {
  z-index: 1000 !important;
}

.items {
  min-width: 200px;
}
</style>
