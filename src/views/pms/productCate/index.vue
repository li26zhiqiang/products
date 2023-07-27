<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-page-header v-if="this.$route.query.parentId" @back="onBack">
                <template #icon>
                    <el-icon><ElIconArrowLeft /></el-icon>
                </template>
                <template #content>
                    <span class="text-large font-600 mr-3">二级商品分类</span>
                </template>
            </el-page-header>

            <el-card class="operate-container" shadow="never">
                <el-button class="btn-add" @click="handleAddProductCate()" type="primary">添加</el-button>
            </el-card>

            <div class="table-container">
                <el-table ref="productCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
                    <el-table-column label="编号" width="100">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="分类名称" width="200">
                        <template v-slot="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="级别" width="100">
                        <template v-slot="scope">{{ levelFilter_filter(scope.row.level) }}</template>
                    </el-table-column>
                    <el-table-column label="商品数量" width="100">
                        <template v-slot="scope">{{ scope.row.productCount }}</template>
                    </el-table-column>
                    <el-table-column label="数量单位" width="100">
                        <template v-slot="scope">{{ scope.row.productUnit }}</template>
                    </el-table-column>
                    <el-table-column label="导航栏" width="100">
                        <template v-slot="scope">
                            <el-switch
                                @change="handleNavStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.navStatus"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否显示" width="100">
                        <template v-slot="scope">
                            <el-switch
                                @change="handleShowStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.showStatus"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" width="100">
                        <template v-slot="scope">{{ scope.row.sort }}</template>
                    </el-table-column>
                    <el-table-column label="设置" width="200">
                        <template v-slot="scope">
                            <el-button
                                link
                                type="primary"
                                :disabled="disableNextLevel_filter(scope.row.level)"
                                @click="handleShowNextLevel(scope.$index, scope.row)"
                                >查看下级
                            </el-button>
                            <el-button link type="primary" @click="handleTransferProduct(scope.$index, scope.row)"
                                >转移商品
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template v-slot="scope">
                            <p>
                                <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)"
                                    >编辑
                                </el-button>
                                <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)"
                                    >删除
                                </el-button>
                            </p>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="total, sizes,prev, pager, next,jumper"
                        :page-size="listQuery.pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        v-model:current-page="listQuery.pageNum"
                        :total="total"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import { fetchList, deleteProductCate, updateShowStatus, updateNavStatus } from '@/api/productCate';

export default {
    name: 'productCateList',
    data() {
        return {
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                pageNum: 1,
                pageSize: 10
            },
            parentId: 0
        };
    },
    created() {
        this.resetParentId();
        this.getList();
    },
    watch: {
        $route(route) {
            this.resetParentId();
            this.getList();
        }
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        disableNextLevel_filter(value) {
            if (value === 0) {
                return false;
            } else {
                return true;
            }
        },
        levelFilter_filter(value) {
            if (value === 0) {
                return '一级';
            } else if (value === 1) {
                return '二级';
            }
        },
        resetParentId() {
            this.listQuery.pageNum = 1;
            if (this.$route.query.parentId != null) {
                this.parentId = this.$route.query.parentId;
            } else {
                this.parentId = 0;
            }
        },
        handleAddProductCate() {
            this.$router.push('/pms/productCate/addProductCate');
        },
        getList() {
            this.listLoading = true;
            fetchList(this.parentId, this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleNavStatusChange(index, row) {
            let data = new URLSearchParams();
            let ids = [];
            ids.push(row.id);
            data.append('ids', ids);
            data.append('navStatus', row.navStatus);
            updateNavStatus(data).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        handleShowStatusChange(index, row) {
            let data = new URLSearchParams();
            let ids = [];
            ids.push(row.id);
            data.append('ids', ids);
            data.append('showStatus', row.showStatus);
            updateShowStatus(data).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        handleShowNextLevel(index, row) {
            this.$router.push({
                path: '/pms/productCate',
                query: { parentId: row.id }
            });
        },
        handleTransferProduct(index, row) {
            console.log('handleAddProductCate');
        },
        handleUpdate(index, row) {
            this.$router.push({
                path: '/pms/productCate/updateProductCate',
                query: { id: row.id }
            });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该品牌吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProductCate(row.id).then((response) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        }
    }
};
</script>
