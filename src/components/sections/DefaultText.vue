<template>
    <p v-for="(item, itemIndex) in items" :key="itemIndex">
        <template v-if="item && item.isLink">
            <a :href="item.href" target="_blank">{{ item.value }}</a>
        </template>
        <template v-else>
            {{ item && item.value ? item.value : '' }}
        </template>
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