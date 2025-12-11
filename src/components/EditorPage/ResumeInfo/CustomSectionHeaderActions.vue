<template>
    <div class="section-actions">
        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                    @click.stop="$emit('edit')" />
            </template>
            Edit section
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" :icon="visible ? 'ph-eye' : 'ph-eye-slash'" size="small"
                    class="visibility-icon" @click.stop="$emit('toggle-visible')" />
            </template>
            {{ visible ? 'Hide section' : 'Show section' }}
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps"
                    :icon="position === 'sidebar' ? 'ph-format-align-right' : 'ph-format-align-left'" size="small"
                    class="position-icon" @click.stop="$emit('toggle-position')" />
            </template>
            {{ position === 'sidebar' ? 'Move to main content' : 'Move to sidebar' }}
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" icon="ph-arrow-up" size="small" class="move-icon"
                    :class="{ 'v-icon--disabled': !canMoveUp }" @click.stop="$emit('move-up')" :disabled="!canMoveUp" />
            </template>
            Move section up
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" icon="ph-arrow-down" size="small" class="move-icon"
                    :class="{ 'v-icon--disabled': !canMoveDown }" @click.stop="$emit('move-down')"
                    :disabled="!canMoveDown" />
            </template>
            Move section down
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" icon="ph-content-copy" size="small" class="clone-icon"
                    :class="{ 'v-icon--disabled': disabled }" @click.stop="$emit('clone')" :disabled="disabled" />
            </template>
            Clone section
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" :icon="deleteConfirm ? 'ph-check' : 'ph-delete'" size="small"
                    class="delete-icon" :class="{ 'v-icon--disabled': disabled }" @click.stop="$emit('delete')"
                    :disabled="disabled" />
            </template>
            {{ deleteConfirm ? 'Confirm delete' : 'Delete section' }}
        </v-tooltip>
    </div>
</template>

<script setup>
const props = defineProps({
    visible: { type: Boolean, default: true },
    position: { type: String, default: 'main' },
    canMoveUp: { type: Boolean, default: false },
    canMoveDown: { type: Boolean, default: false },
    deleteConfirm: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
})

defineEmits(['edit', 'toggle-visible', 'toggle-position', 'move-up', 'move-down', 'delete', 'clone'])
</script>

<style scoped></style>
