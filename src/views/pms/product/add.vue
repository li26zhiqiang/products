<template>
    <div class="app-container">
        <el-page-header v-if="this.$route.query.isChildPage" @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">添加商品</span>
            </template>
        </el-page-header>

        <product-detail :is-edit="false"></product-detail>
    </div>
</template>

<script>
import ProductDetail from './components/ProductDetail';
export default {
    name: 'addProduct',
    components: { ProductDetail },
    methods: {
        onBack() {
            this.$router.back();
        }
    },
    data() {
        return {};
    }
};
</script>
