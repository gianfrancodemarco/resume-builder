<template>
    <div class="section-actions">
        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" icon="ph-pencil-simple" size="small" class="edit-icon"
                    @click.stop="$emit('edit')" />
            </template>
            Rename section
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps" :icon="visible ? 'ph-eye' : 'ph-eye-slash'" size="small"
                    class="visibility-icon" @click.stop="$emit('toggle-visible')" />
            </template>
            {{ visible ? 'Hide section' : 'Show section' }}
        </v-tooltip>

        <v-tooltip v-if="showColumn" location="top">
            <template v-slot:activator="{ props: iconProps }">
                <v-icon v-bind="iconProps"
                    :icon="column === 'sidebar' ? 'ph-format-align-right' : 'ph-format-align-left'" size="small"
                    class="position-icon" @click.stop="$emit('toggle-column')" />
            </template>
            {{ column === 'sidebar' ? 'Move to main content' : 'Move to sidebar' }}
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
                <v-icon v-bind="iconProps" :icon="deleteConfirm ? 'ph-check' : 'ph-delete'" size="small"
                    class="delete-icon" @click.stop="$emit('delete')" />
            </template>
            {{ deleteConfirm ? 'Confirm: remove section and its content' : 'Remove section' }}
        </v-tooltip>
    </div>
</template>

<script setup>
defineProps({
    visible: { type: Boolean, default: true },
    column: { type: String, default: 'main' },
    showColumn: { type: Boolean, default: false },
    canMoveUp: { type: Boolean, default: false },
    canMoveDown: { type: Boolean, default: false },
    deleteConfirm: { type: Boolean, default: false },
})

defineEmits(['edit', 'toggle-visible', 'toggle-column', 'move-up', 'move-down', 'delete'])
</script>
