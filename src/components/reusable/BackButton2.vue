<template>
    <div v-bind="$attrs">
        <button @click="goBack" class="btn btn-circle bg-secondary hover:bg-secondary/10 border-none">
            <Icon icon="ic:outline-arrow-back-ios" width="24" height="24" />
        </button>
    </div>

</template>

<script setup>
import { Icon } from "@iconify/vue";

const goBack = () => {
    window.history.back();
};
</script>