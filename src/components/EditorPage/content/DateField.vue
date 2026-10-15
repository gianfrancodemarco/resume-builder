<template>
    <div class="date-field">
        <label class="field-label">{{ label }}</label>
        <div class="date-inputs">
            <template v-if="!(end && present)">
                <v-select v-model="month" :items="MONTH_ITEMS" variant="outlined" density="compact" hide-details
                    :aria-label="`${label} month`" class="month" />
                <v-text-field v-model="year" variant="outlined" density="compact" hide-details placeholder="Year"
                    inputmode="numeric" maxlength="4" :aria-label="`${label} year`" class="year"
                    :error="year !== '' && !YEAR.test(year)" />
            </template>
            <v-checkbox v-if="end" v-model="present" label="Present" density="compact" hide-details
                class="present" />
        </div>
    </div>
</template>

<script setup>
// ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD) picked as month + year. For end
// dates an empty value means "present", as in JSON Resume.
import { computed, ref, watch } from 'vue'

const model = defineModel({ type: String, default: '' })

const props = defineProps({
    label: { type: String, required: true },
    // An end date: shows a "Present" checkbox, which clears the value
    end: { type: Boolean, default: false },
})

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_ITEMS = [{ title: 'Month', value: '' }, ...MONTHS.map((title, i) => ({ title, value: String(i + 1).padStart(2, '0') }))]
const YEAR = /^[12]\d{3}$/

const parse = value => {
    const [, year = '', month = '', day = ''] = String(value || '').match(/^(\d{4})?(?:-(\d{2}))?(?:-(\d{2}))?/) || []
    return { year, month, day }
}

const year = ref(parse(model.value).year)
const month = ref(parse(model.value).month)
const present = ref(props.end && !model.value)

// Keep the day of an imported YYYY-MM-DD date while the month is unchanged
const day = computed(() => {
    const parsed = parse(model.value)
    return parsed.month === month.value ? parsed.day : ''
})

watch([year, month, present], () => {
    if (present.value) {
        model.value = ''
    } else if (YEAR.test(year.value)) {
        model.value = [year.value, month.value, month.value && day.value].filter(Boolean).join('-')
    } else if (year.value === '') {
        model.value = ''
    }
})

watch(present, isPresent => {
    if (!isPresent && !year.value) year.value = String(new Date().getFullYear())
})

watch(model, value => {
    const parsed = parse(value)
    if (value && (parsed.year !== year.value || parsed.month !== month.value)) {
        year.value = parsed.year
        month.value = parsed.month
        present.value = false
    }
})
</script>

<style scoped>
.date-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
}

.month {
    flex: 3;
}

.year {
    flex: 2;
}

.present {
    flex: none;
}
</style>
