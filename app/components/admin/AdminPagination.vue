<template>
    <div v-if="totalPages > 1" class="pagination">
        <span v-if="from && to && total" class="page-info">{{ from }}–{{ to }} of {{ total }}</span>
        <div class="page-btns">
            <button class="page-btn" :disabled="currentPage === 1" @click="emit('change', 1)">«</button>
            <button class="page-btn" :disabled="currentPage === 1" @click="emit('change', currentPage - 1)">‹</button>
            <button v-for="n in totalPages" :key="n" class="page-btn" :class="{ 'page-active': n === currentPage }"
                @click="emit('change', n)">{{ n }}</button>
            <button class="page-btn" :disabled="currentPage === totalPages"
                @click="emit('change', currentPage + 1)">›</button>
            <button class="page-btn" :disabled="currentPage === totalPages"
                @click="emit('change', totalPages)">»</button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
    total?: number;
    from?: number;
    to?: number;
}>();

const emit = defineEmits<{ (e: 'change', page: number): void }>();
</script>

<style scoped>
.pagination {
    padding: 1rem 1.25rem;
    border-top: 1px solid #f4f4f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.page-info {
    font-size: 0.8rem;
    color: #71717a;
}

.page-btns {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.page-btn {
    padding: 0.35rem 0.65rem;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    background: #fff;
    color: #27272a;
    cursor: pointer;
}

.page-btn:hover:not(:disabled) {
    border-color: #E05615;
    color: #E05615;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-active {
    background: #E05615 !important;
    border-color: #E05615 !important;
    color: #fff !important;
}
</style>
