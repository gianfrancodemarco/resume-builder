<template>
    <p class="skills-list">
        <span v-for="(item, itemIndex) in items" :key="itemIndex">
            {{ item }}<br />
        </span>
    </p>
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