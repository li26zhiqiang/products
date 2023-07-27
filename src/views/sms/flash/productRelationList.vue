<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">秒杀商品列表</span>
            </template>
        </el-page-header>

        <el-card class="operate-container" shadow="never">
            <el-button type="primary" class="btn-add" @click="handleSelectProduct()">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="productRelationTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="商品名称" width="200">
                    <template v-slot="scope">{{ scope.row.product.name }}</template>
                </el-table-column>
                <el-table-column label="货号" width="140">
                    <template v-slot="scope">NO.{{ scope.row.product.productSn }}</template>
                </el-table-column>
                <el-table-column label="商品价格" width="100">
                    <template v-slot="scope">￥{{ scope.row.product.price }}</template>
                </el-table-column>
                <el-table-column label="剩余数量" width="100">
                    <template v-slot="scope">{{ scope.row.product.stock }}</template>
                </el-table-column>
                <el-table-column label="秒杀价格" width="100">
                    <template v-slot="scope">
                        <p v-if="scope.row.flashPromotionPrice !== null">￥{{ scope.row.flashPromotionPrice }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="秒杀数量" width="100">
                    <template v-slot="scope">{{ scope.row.flashPromotionCount }}</template>
                </el-table-column>
                <el-table-column label="限购数量" width="100">
                    <template v-slot="scope">{{ scope.row.flashPromotionLimit }}</template>
                </el-table-column>
                <el-table-column label="排序" width="100">
                    <template v-slot="scope">{{ scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes,prev, pager, next,jumper"
                    v-model:current-page="listQuery.pageNum"
                    :page-size="listQuery.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>

        <el-dialog title="选择商品" v-model="selectDialogVisible" width="720px">
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

        <el-dialog title="编辑秒杀商品信息" v-model="editDialogVisible" width="660px">
            <el-form :model="flashProductRelation" ref="flashProductRelationForm" label-width="90px">
                <el-form-item label="商品名称：">
                    <span>{{ flashProductRelation.product.name }}</span>
                </el-form-item>
                <el-form-item label="货号：">
                    <span>NO.{{ flashProductRelation.product.productSn }}</span>
                </el-form-item>
                <el-form-item label="商品价格：">
                    <span>￥{{ flashProductRelation.product.price }}</span>
                </el-form-item>
                <el-form-item label="秒杀价格：">
                    <el-input v-model="flashProductRelation.flashPromotionPrice" class="input-width">
                        <template v-slot:append>￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="剩余数量：">
                    <span>{{ flashProductRelation.product.stock }}</span>
                </el-form-item>
                <el-form-item label="秒杀数量：">
                    <el-input v-model="flashProductRelation.flashPromotionCount" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="限购数量：">
                    <el-input v-model="flashProductRelation.flashPromotionLimit" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="flashProductRelation.sort" class="input-width"></el-input>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleEditDialogConfirm()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    fetchList,
    createFlashProductRelation,
    deleteFlashProductRelation,
    updateFlashProductRelation
} from '@/api/flashProductRelation';
import { fetchList as fetchProductList } from '@/api/product';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    flashPromotionId: null,
    flashPromotionSessionId: null
};
export default {
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
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
            editDialogVisible: false,
            flashProductRelation: {
                product: {}
            }
        };
    },
    name: 'flashPromotionProductRelationList',
    created() {
        this.listQuery.flashPromotionId = this.$route.query.flashPromotionId;
        this.listQuery.flashPromotionSessionId = this.$route.query.flashPromotionSessionId;
        this.getList();
    },
    methods: {
        onBack() {
            this.$router.back();
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
        handleSelectProduct() {
            this.selectDialogVisible = true;
            this.getDialogList();
        },
        handleUpdate(index, row) {
            this.editDialogVisible = true;
            this.flashProductRelation = Object.assign({}, row);
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFlashProductRelation(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
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
                    flashPromotionId: this.listQuery.flashPromotionId,
                    flashPromotionSessionId: this.listQuery.flashPromotionSessionId
                });
            }
            this.$confirm('使用要进行添加操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                createFlashProductRelation(selectProducts).then((response) => {
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
        handleEditDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateFlashProductRelation(this.flashProductRelation.id, this.flashProductRelation).then((response) => {
                    this.$message({
                        message: '修改成功！',
                        type: 'success'
                    });
                    this.editDialogVisible = false;
                    this.getList();
                });
            });
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
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

<style scoped>
.input-width {
    width: 200px;
}
</style>
