<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">修改商品</span>
            </template>
        </el-page-header>

        <product-detail :is-edit="true"></product-detail>
    </div>
</template>

<script>
import ProductDetail from './components/ProductDetail';

export default {
    name: 'updateProduct',
    components: { ProductDetail },
    methods: {
        onBack() {
            this.$router.back();
        }
    }
};
</script>
