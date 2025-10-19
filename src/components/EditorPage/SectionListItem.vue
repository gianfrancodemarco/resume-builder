<template>
    <div class="item-header">
        <span class="item-title">{{ title }}</span>
        <div class="item-actions">
            <v-icon :icon="visible ? 'ph-eye' : 'ph-eye-slash'" size="small" class="visibility-icon"
                @click.stop="$emit('toggle-visibility')" />

            <v-tooltip location="top">
                <template v-slot:activator="{ props: iconProps }">
                    <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                        @click.stop="$emit('edit')" />
                </template>
                Edit
            </v-tooltip>

            <v-tooltip location="top">
                <template v-slot:activator="{ props: iconProps }">
                    <v-icon v-bind="iconProps" icon="ph-arrow-up" size="small" class="move-icon"
                        :class="{ 'v-icon--disabled': disabled || !canMoveUp }" @click.stop="$emit('move-up')"
                        :disabled="disabled || !canMoveUp" />
                </template>
                Move up
            </v-tooltip>

            <v-tooltip location="top">
                <template v-slot:activator="{ props: iconProps }">
                    <v-icon v-bind="iconProps" icon="ph-arrow-down" size="small" class="move-icon"
                        :class="{ 'v-icon--disabled': disabled || !canMoveDown }" @click.stop="$emit('move-down')"
                        :disabled="disabled || !canMoveDown" />
                </template>
                Move down
            </v-tooltip>

            <v-tooltip location="top">
                <template v-slot:activator="{ props: iconProps }">
                    <v-icon v-bind="iconProps" :icon="deleteConfirm ? 'ph-check' : 'ph-delete'" size="small"
                        class="delete-icon" :class="{ 'v-icon--disabled': disabled }" @click.stop="$emit('delete')"
                        :disabled="disabled" />
                </template>
                {{ deleteConfirm ? 'Confirm delete' : 'Delete' }}
            </v-tooltip>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
    visible: { type: Boolean, default: true },
    canMoveUp: { type: Boolean, default: false },
    canMoveDown: { type: Boolean, default: false },
    deleteConfirm: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
})

defineEmits(['toggle-visibility', 'edit', 'move-up', 'move-down', 'delete'])
</script>

<style scoped>
.item-header {
    display: flex;
    align-items: center;
}

.item-title {
    flex: 1 1 auto;
}

.item-actions {
    margin-left: auto;
}
</style>
