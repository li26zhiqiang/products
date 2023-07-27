<template>
    <home-advertise-detail :isEdit="true"></home-advertise-detail>
</template>

<script>
import HomeAdvertiseDetail from './components/HomeAdvertiseDetail.vue';
export default {
    name: 'updateHomeAdvertise',
    components: { HomeAdvertiseDetail }
};
</script>
