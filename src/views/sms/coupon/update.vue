<template>
    <coupon-detail :isEdit="true"></coupon-detail>
</template>

<script>
import CouponDetail from './components/CouponDetail.vue';
export default {
    name: 'updateCoupon',
    components: { CouponDetail }
};
</script>
