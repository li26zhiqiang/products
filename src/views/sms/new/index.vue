<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <el-form :inline="true" :model="listQuery" label-width="90px">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input
                                v-model="listQuery.productName"
                                class="input-width"
                                placeholder="商品名称"
                            ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="推荐状态：">
                            <el-select
                                v-model="listQuery.recommendStatus"
                                placeholder="全部"
                                clearable
                                class="input-width"
                            >
                                <el-option
                                    v-for="item in recommendOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <div class="filter-operation">
                            <el-button style="float: right" type="primary" @click="handleSearchList()">
                                查询
                            </el-button>
                            <el-button style="float: right; margin-right: 16px" @click="handleResetSearch()">
                                重置
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button type="primary" class="btn-add" @click="handleSelectProduct()">选择商品</el-button>
            <div class="batch-operate-container">
                <el-select v-model="operateType" placeholder="批量操作">
                    <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button style="margin-left: 8px" class="search-button" @click="handleBatchOperate()" type="primary">
                    确定
                </el-button>
            </div>
        </el-card>

        <div class="table-container">
            <el-table
                ref="newProductTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border
            >
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column label="编号" width="120">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template v-slot="scope">{{ scope.row.productName }}</template>
                </el-table-column>
                <el-table-column label="是否推荐" width="200">
                    <template v-slot="scope">
                        <el-switch
                            @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.recommendStatus"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="160">
                    <template v-slot="scope">{{ scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="状态" width="160">
                    <template v-slot="scope">{{ formatRecommendStatus_filter(scope.row.recommendStatus) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleEditSort(scope.$index, scope.row)"
                            >设置排序
                        </el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除 </el-button>
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

        <el-dialog title="选择商品" v-model="selectDialogVisible" width="660px">
            <el-input
                v-model="dialogData.listQuery.keyword"
                style="width: 250px; margin-bottom: 20px"
                placeholder="商品名称搜索"
            >
                <template v-slot:append>
                    <el-button icon="ElIconSearch" @click="handleSelectSearch()"></el-button>
                </template>
            </el-input>
            <el-table :data="dialogData.list" @selection-change="handleDialogSelectionChange" border>
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column label="商品名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="货号" width="160">
                    <template v-slot="scope">NO.{{ scope.row.productSn }}</template>
                </el-table-column>
                <el-table-column label="价格" width="120">
                    <template v-slot="scope">￥{{ scope.row.price }}</template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    background
                    @size-change="handleDialogSizeChange"
                    @current-change="handleDialogCurrentChange"
                    layout="prev, pager, next"
                    v-model:current-page="dialogData.listQuery.pageNum"
                    :page-size="dialogData.listQuery.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="dialogData.total"
                >
                </el-pagination>
            </div>
            <div style="clear: both"></div>
            <template v-slot:footer>
                <div>
                    <el-button @click="selectDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSelectDialogConfirm()">确定</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog title="设置排序" v-model="sortDialogVisible" width="660px">
            <el-form :model="sortDialogData" label-width="60px">
                <el-form-item label="排序：">
                    <el-input v-model="sortDialogData.sort" class="input-width"></el-input>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span>
                    <el-button @click="sortDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleUpdateSort">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    fetchList,
    updateRecommendStatus,
    deleteNewProduct,
    createNewProduct,
    updateNewProductSort
} from '@/api/newProduct';
import { fetchList as fetchProductList } from '@/api/product';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    productName: null,
    recommendStatus: null
};
const defaultRecommendOptions = [
    {
        label: '未推荐',
        value: 0
    },
    {
        label: '推荐中',
        value: 1
    }
];
export default {
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            recommendOptions: Object.assign({}, defaultRecommendOptions),
            list: null,
            total: null,
            listLoading: false,
            multipleSelection: [],
            operates: [
                {
                    label: '设为推荐',
                    value: 0
                },
                {
                    label: '取消推荐',
                    value: 1
                },
                {
                    label: '删除',
                    value: 2
                }
            ],
            operateType: null,
            selectDialogVisible: false,
            dialogData: {
                list: null,
                total: null,
                multipleSelection: [],
                listQuery: {
                    keyword: null,
                    pageNum: 1,
                    pageSize: 10
                }
            },
            sortDialogVisible: false,
            sortDialogData: { sort: 0, id: null }
        };
    },
    name: 'newProductList',
    created() {
        this.getList();
    },
    methods: {
        formatRecommendStatus_filter(status) {
            if (status === 1) {
                return '推荐中';
            } else {
                return '未推荐';
            }
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        handleRecommendStatusStatusChange(index, row) {
            this.updateRecommendStatusStatus(row.id, row.recommendStatus);
        },
        handleDelete(index, row) {
            this.deleteProduct(row.id);
        },
        handleBatchOperate() {
            if (this.multipleSelection < 1) {
                this.$message({
                    message: '请选择一条记录',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            let ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
                ids.push(this.multipleSelection[i].id);
            }
            if (this.operateType === 0) {
                //设为推荐
                this.updateRecommendStatusStatus(ids, 1);
            } else if (this.operateType === 1) {
                //取消推荐
                this.updateRecommendStatusStatus(ids, 0);
            } else if (this.operateType === 2) {
                //删除
                this.deleteProduct(ids);
            } else {
                this.$message({
                    message: '请选择批量操作类型',
                    type: 'warning',
                    duration: 1000
                });
            }
        },
        handleSelectProduct() {
            this.selectDialogVisible = true;
            this.getDialogList();
        },
        handleSelectSearch() {
            this.getDialogList();
        },
        handleDialogSizeChange(val) {
            this.dialogData.listQuery.pageNum = 1;
            this.dialogData.listQuery.pageSize = val;
            this.getDialogList();
        },
        handleDialogCurrentChange(val) {
            this.dialogData.listQuery.pageNum = val;
            this.getDialogList();
        },
        handleDialogSelectionChange(val) {
            this.dialogData.multipleSelection = val;
        },
        handleSelectDialogConfirm() {
            if (this.dialogData.multipleSelection < 1) {
                this.$message({
                    message: '请选择一条记录',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            let selectProducts = [];
            for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
                selectProducts.push({
                    productId: this.dialogData.multipleSelection[i].id,
                    productName: this.dialogData.multipleSelection[i].name
                });
            }
            this.$confirm('使用要进行添加操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                createNewProduct(selectProducts).then((response) => {
                    this.selectDialogVisible = false;
                    this.dialogData.multipleSelection = [];
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                });
            });
        },
        handleEditSort(index, row) {
            this.sortDialogVisible = true;
            this.sortDialogData.sort = row.sort;
            this.sortDialogData.id = row.id;
        },
        handleUpdateSort() {
            this.$confirm('确定要修改排序吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateNewProductSort(this.sortDialogData).then((response) => {
                    this.sortDialogVisible = false;
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            });
        },
        getList() {
            this.listLoading = true;

            fetchList(this.listQuery)
                .then((response) => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        },
        updateRecommendStatusStatus(ids, status) {
            this.$confirm('确定要修改推荐状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = new URLSearchParams();
                    params.append('ids', ids);
                    params.append('recommendStatus', status);
                    updateRecommendStatus(params).then((response) => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'success',
                        message: '已取消操作!'
                    });
                    this.getList();
                });
        },
        deleteProduct(ids) {
            this.$confirm('却稳定要删除该推荐吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('ids', ids);
                deleteNewProduct(params).then((response) => {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            });
        },
        getDialogList() {
            fetchProductList(this.dialogData.listQuery).then((response) => {
                this.dialogData.list = response.data.list;
                this.dialogData.total = response.data.total;
            });
        }
    }
};
</script>
