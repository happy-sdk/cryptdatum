---
layout: page
---

<script setup>
import { useData, useRouter } from 'vitepress'
const { theme } = useData()
const router = useRouter()
router.go(theme.value.specs.latest)
</script>
