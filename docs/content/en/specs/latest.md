---
layout: page
---

<script setup>
import { useData, useRouter, withBase } from 'vitepress'
const { theme } = useData()
const router = useRouter()
router.go(withBase(`/specs/${theme.value.specs.latest}/`))
</script>
