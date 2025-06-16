<template>
    <p class="skills-list">
        <span v-for="(item, itemIndex) in items" :key="itemIndex">
            {{ item.value }}<br />
        </span>
    </p>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    }
}
</script>