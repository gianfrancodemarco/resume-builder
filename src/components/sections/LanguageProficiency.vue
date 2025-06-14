<template>
    <div class="language-proficiency" v-for="(item, itemIndex) in items" :key="itemIndex">
        <div class="language-proficiency-label">{{ item.name }}</div>
        <div class="language-proficiency-bar">
            <div class="language-proficiency-bar-fill" :style="{ width: item.proficiency + '%' }"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>