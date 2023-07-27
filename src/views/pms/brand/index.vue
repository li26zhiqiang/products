<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="输入搜索：">
                                <el-input
                                    class="input-width"
                                    v-model="listQuery.keyword"
                                    placeholder="品牌名称/关键字"
                                ></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="16">
                            <div class="filter-operation">
                                <el-button style="float: right" @click="searchBrandList()" type="primary">
                                    查询
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-card class="operate-container" shadow="never">
                <el-button class="btn-add" @click="addBrand()" type="primary"> 添加 </el-button>
                <div class="batch-operate-container">
                    <el-select v-model="operateType" placeholder="批量操作">
                        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button
                        style="margin-left: 8px"
                        class="search-button"
                        @click="handleBatchOperate()"
                        type="primary"
                    >
                        确定
                    </el-button>
                </div>
            </el-card>

            <div class="table-container">
                <el-table
                    ref="brandTable"
                    :data="list"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                >
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column label="编号" width="100">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="品牌名称">
                        <template v-slot="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="品牌首字母" width="100">
                        <template v-slot="scope">{{ scope.row.firstLetter }}</template>
                    </el-table-column>
                    <el-table-column label="排序" width="100">
                        <template v-slot="scope">{{ scope.row.sort }}</template>
                    </el-table-column>
                    <el-table-column label="品牌制造商" width="100">
                        <template v-slot="scope">
                            <el-switch
                                @change="handleFactoryStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.factoryStatus"
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
                    <el-table-column label="相关" width="220">
                        <template v-slot="scope">
                            <span>商品：</span>
                            <el-button link type="primary" @click="getProductList(scope.$index, scope.row)"
                                >100</el-button
                            >
                            <el-divider direction="vertical" />
                            <span>评价：</span>
                            <el-button link type="primary" @click="getProductCommentList(scope.$index, scope.row)"
                                >1000
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)"
                                >编辑
                            </el-button>
                            <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)"
                                >删除
                            </el-button>
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
import { fetchList, updateShowStatus, updateFactoryStatus, deleteBrand } from '@/api/brand';

export default {
    name: 'brandList',
    data() {
        return {
            operates: [
                {
                    label: '显示品牌',
                    value: 'showBrand'
                },
                {
                    label: '隐藏品牌',
                    value: 'hideBrand'
                }
            ],
            operateType: null,
            listQuery: {
                keyword: null,
                pageNum: 1,
                pageSize: 10
            },
            list: null,
            total: null,
            listLoading: true,
            multipleSelection: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
                this.totalPage = response.data.totalPage;
                this.pageSize = response.data.pageSize;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleUpdate(index, row) {
            this.$router.push({ path: '/pms/brand/updateBrand', query: { id: row.id } });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该品牌吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBrand(row.id).then((response) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        },
        getProductList(index, row) {
            console.log(index, row);
        },
        getProductCommentList(index, row) {
            console.log(index, row);
        },
        handleFactoryStatusChange(index, row) {
            var data = new URLSearchParams();
            data.append('ids', row.id);
            data.append('factoryStatus', row.factoryStatus);
            updateFactoryStatus(data)
                .then((response) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                })
                .catch((error) => {
                    if (row.factoryStatus === 0) {
                        row.factoryStatus = 1;
                    } else {
                        row.factoryStatus = 0;
                    }
                });
        },
        handleShowStatusChange(index, row) {
            let data = new URLSearchParams();
            data.append('ids', row.id);
            data.append('showStatus', row.showStatus);
            updateShowStatus(data)
                .then((response) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                })
                .catch((error) => {
                    if (row.showStatus === 0) {
                        row.showStatus = 1;
                    } else {
                        row.showStatus = 0;
                    }
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
        searchBrandList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleBatchOperate() {
            console.log(this.multipleSelection);
            if (this.multipleSelection < 1) {
                this.$message({
                    message: '请选择一条记录',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            let showStatus = 0;
            if (this.operateType === 'showBrand') {
                showStatus = 1;
            } else if (this.operateType === 'hideBrand') {
                showStatus = 0;
            } else {
                this.$message({
                    message: '请选择批量操作类型',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            let ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
                ids.push(this.multipleSelection[i].id);
            }
            let data = new URLSearchParams();
            data.append('ids', ids);
            data.append('showStatus', showStatus);
            updateShowStatus(data).then((response) => {
                this.getList();
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        addBrand() {
            this.$router.push({ path: '/pms/brand/addBrand' });
        }
    }
};
</script>
