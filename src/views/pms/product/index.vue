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
                                    placeholder="商品名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品货号：">
                                <el-input
                                    class="input-width"
                                    v-model="listQuery.productSn"
                                    placeholder="商品货号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品分类：">
                                <el-cascader
                                    class="input-width"
                                    clearable
                                    v-model="selectProductCateValue"
                                    :options="productCateOptions"
                                >
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品品牌：">
                                <el-select
                                    class="input-width"
                                    v-model="listQuery.brandId"
                                    placeholder="请选择品牌"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in brandOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select> </el-form-item
                        ></el-col>
                        <el-col :span="8">
                            <el-form-item label="上架状态：">
                                <el-select
                                    class="input-width"
                                    v-model="listQuery.publishStatus"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in publishStatusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select> </el-form-item
                        ></el-col>
                        <el-col :span="8">
                            <el-form-item label="审核状态：">
                                <el-select
                                    class="input-width"
                                    v-model="listQuery.verifyStatus"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in verifyStatusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <div class="filter-operation">
                                <el-button style="float: right" @click="handleSearchList()" type="primary">
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
                <el-button class="btn-add" type="primary" @click="handleAddProduct()">添加</el-button>

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
                    ref="productTable"
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
                    <el-table-column label="商品图片" width="120">
                        <template v-slot="scope"><img style="height: 80px" :src="scope.row.pic" /></template>
                    </el-table-column>
                    <el-table-column label="商品名称" width="220">
                        <template v-slot="scope">
                            <p>{{ scope.row.name }}</p>
                            <p>品牌：{{ scope.row.brandName }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格/货号" width="180">
                        <template v-slot="scope">
                            <p>价格：￥{{ scope.row.price }}</p>
                            <p>货号：{{ scope.row.productSn }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="标签" width="140">
                        <template v-slot="scope">
                            <p>
                                上架：
                                <el-switch
                                    @change="handlePublishStatusChange(scope.$index, scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.publishStatus"
                                >
                                </el-switch>
                            </p>
                            <p>
                                新品：
                                <el-switch
                                    @change="handleNewStatusChange(scope.$index, scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.newStatus"
                                >
                                </el-switch>
                            </p>
                            <p>
                                推荐：
                                <el-switch
                                    @change="handleRecommendStatusChange(scope.$index, scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.recommandStatus"
                                >
                                </el-switch>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" width="100">
                        <template v-slot="scope">{{ scope.row.sort }}</template>
                    </el-table-column>
                    <el-table-column label="SKU库存" width="100">
                        <template v-slot="scope">
                            <el-button
                                type="primary"
                                icon="ElIconEdit"
                                @click="handleShowSkuEditDialog(scope.$index, scope.row)"
                                circle
                            ></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="销量" width="100">
                        <template v-slot="scope">{{ scope.row.sale }}</template>
                    </el-table-column>
                    <el-table-column label="审核状态" width="100">
                        <template v-slot="scope">
                            <p>{{ verifyStatusFilter_filter(scope.row.verifyStatus) }}</p>
                            <p>
                                <el-button link type="primary" @click="handleShowVerifyDetail(scope.$index, scope.row)"
                                    >审核详情
                                </el-button>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" fixed="right">
                        <template v-slot="scope">
                            <p>
                                <el-button link type="primary" @click="handleShowProduct(scope.$index, scope.row)"
                                    >查看</el-button
                                >
                                <el-button link type="primary" @click="handleUpdateProduct(scope.$index, scope.row)"
                                    >编辑
                                </el-button>
                            </p>
                            <p>
                                <el-button link type="primary" @click="handleShowLog(scope.$index, scope.row)"
                                    >日志
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

            <el-dialog title="编辑货品信息" v-model="editSkuInfo.dialogVisible" width="760px">
                <span>商品货号：</span>
                <span>{{ editSkuInfo.productSn }}</span>
                <el-input
                    placeholder="按sku编号搜索"
                    v-model="editSkuInfo.keyword"
                    style="width: 50%; margin-left: 20px"
                >
                    <template v-slot:append>
                        <el-button icon="ElIconSearch" @click="handleSearchEditSku"></el-button>
                    </template>
                </el-input>
                <el-table style="width: 100%; margin-top: 20px" :data="editSkuInfo.stockList" border>
                    <el-table-column label="SKU编号">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.skuCode"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, index) in editSkuInfo.productAttr" :label="item.name" :key="item.id">
                        <template v-slot="scope">
                            {{ getProductSkuSp(scope.row, index) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售价格" width="90">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.price"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品库存" width="90">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.stock"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存预警值" width="100">
                        <template v-slot="scope">
                            <el-input v-model="scope.row.lowStock"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="editSkuInfo.dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleEditSkuConfirm">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus
} from '@/api/product';
import { fetchList as fetchSkuStockList, update as updateSkuStockList } from '@/api/skuStock';
import { fetchList as fetchProductAttrList } from '@/api/productAttr';
import { fetchList as fetchBrandList } from '@/api/brand';
import { fetchListWithChildren } from '@/api/productCate';

const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 10,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
};
export default {
    data() {
        return {
            editSkuInfo: {
                dialogVisible: false,
                productId: null,
                productSn: '',
                productAttributeCategoryId: null,
                stockList: [],
                productAttr: [],
                keyword: null
            },
            operates: [
                {
                    label: '商品上架',
                    value: 'publishOn'
                },
                {
                    label: '商品下架',
                    value: 'publishOff'
                },
                {
                    label: '设为推荐',
                    value: 'recommendOn'
                },
                {
                    label: '取消推荐',
                    value: 'recommendOff'
                },
                {
                    label: '设为新品',
                    value: 'newOn'
                },
                {
                    label: '取消新品',
                    value: 'newOff'
                },
                {
                    label: '转移到分类',
                    value: 'transferCategory'
                },
                {
                    label: '移入回收站',
                    value: 'recycle'
                }
            ],
            operateType: null,
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: true,
            selectProductCateValue: null,
            multipleSelection: [],
            productCateOptions: [],
            brandOptions: [],
            publishStatusOptions: [
                {
                    value: 1,
                    label: '上架'
                },
                {
                    value: 0,
                    label: '下架'
                }
            ],
            verifyStatusOptions: [
                {
                    value: 1,
                    label: '审核通过'
                },
                {
                    value: 0,
                    label: '未审核'
                }
            ]
        };
    },
    name: 'productList',
    created() {
        this.getList();
        this.getBrandList();
        this.getProductCateList();
    },
    watch: {
        selectProductCateValue: function (newValue) {
            if (newValue != null && newValue.length == 2) {
                this.listQuery.productCategoryId = newValue[1];
            } else {
                this.listQuery.productCategoryId = null;
            }
        }
    },
    methods: {
        verifyStatusFilter_filter(value) {
            if (value === 1) {
                return '审核通过';
            } else {
                return '未审核';
            }
        },
        getProductSkuSp(row, index) {
            let spData = JSON.parse(row.spData);
            if (spData != null && index < spData.length) {
                return spData[index].value;
            } else {
                return null;
            }
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        getBrandList() {
            fetchBrandList({ pageNum: 1, pageSize: 100 }).then((response) => {
                this.brandOptions = [];
                let brandList = response.data.list;
                for (let i = 0; i < brandList.length; i++) {
                    this.brandOptions.push({
                        label: brandList[i].name,
                        value: brandList[i].id
                    });
                }
            });
        },
        getProductCateList() {
            fetchListWithChildren().then((response) => {
                let list = response.data;
                this.productCateOptions = [];
                for (let i = 0; i < list.length; i++) {
                    let children = [];
                    if (list[i].children != null && list[i].children.length > 0) {
                        for (let j = 0; j < list[i].children.length; j++) {
                            children.push({
                                label: list[i].children[j].name,
                                value: list[i].children[j].id
                            });
                        }
                    }
                    this.productCateOptions.push({
                        label: list[i].name,
                        value: list[i].id,
                        children: children
                    });
                }
            });
        },
        handleShowSkuEditDialog(index, row) {
            this.editSkuInfo.dialogVisible = true;
            this.editSkuInfo.productId = row.id;
            this.editSkuInfo.productSn = row.productSn;
            this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
            this.editSkuInfo.keyword = null;
            fetchSkuStockList(row.id, { keyword: this.editSkuInfo.keyword }).then((response) => {
                this.editSkuInfo.stockList = response.data;
            });
            if (row.productAttributeCategoryId != null) {
                fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then((response) => {
                    this.editSkuInfo.productAttr = response.data.list;
                });
            }
        },
        handleSearchEditSku() {
            fetchSkuStockList(this.editSkuInfo.productId, {
                keyword: this.editSkuInfo.keyword
            }).then((response) => {
                this.editSkuInfo.stockList = response.data;
            });
        },
        handleEditSkuConfirm() {
            if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
                this.$message({
                    message: '暂无sku信息',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            this.$confirm('确定要进行修改吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then((response) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.editSkuInfo.dialogVisible = false;
                });
            });
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleAddProduct() {
            this.$router.push({ path: '/pms/addProduct', query: { isChildPage: true } });
        },
        handleBatchOperate() {
            if (this.operateType == null) {
                this.$message({
                    message: '请选择操作类型',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            if (this.multipleSelection == null || this.multipleSelection.length < 1) {
                this.$message({
                    message: '请选择要操作的商品',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            this.$confirm('是否要进行该批量操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                switch (this.operateType) {
                    case this.operates[0].value:
                        this.updatePublishStatus(1, ids);
                        break;
                    case this.operates[1].value:
                        this.updatePublishStatus(0, ids);
                        break;
                    case this.operates[2].value:
                        this.updateRecommendStatus(1, ids);
                        break;
                    case this.operates[3].value:
                        this.updateRecommendStatus(0, ids);
                        break;
                    case this.operates[4].value:
                        this.updateNewStatus(1, ids);
                        break;
                    case this.operates[5].value:
                        this.updateNewStatus(0, ids);
                        break;
                    case this.operates[6].value:
                        break;
                    case this.operates[7].value:
                        this.updateDeleteStatus(1, ids);
                        break;
                    default:
                        break;
                }
                this.getList();
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handlePublishStatusChange(index, row) {
            let ids = [];
            ids.push(row.id);
            this.updatePublishStatus(row.publishStatus, ids);
        },
        handleNewStatusChange(index, row) {
            let ids = [];
            ids.push(row.id);
            this.updateNewStatus(row.newStatus, ids);
        },
        handleRecommendStatusChange(index, row) {
            let ids = [];
            ids.push(row.id);
            this.updateRecommendStatus(row.recommandStatus, ids);
        },
        handleResetSearch() {
            this.selectProductCateValue = [];
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = [];
                ids.push(row.id);
                this.updateDeleteStatus(1, ids);
            });
        },
        handleUpdateProduct(index, row) {
            this.$router.push({ path: '/pms/product/updateProduct', query: { id: row.id } });
        },
        handleShowProduct(index, row) {
            console.log('handleShowProduct', row);
        },
        handleShowVerifyDetail(index, row) {
            console.log('handleShowVerifyDetail', row);
        },
        handleShowLog(index, row) {
            console.log('handleShowLog', row);
        },
        updatePublishStatus(publishStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('publishStatus', publishStatus);
            updatePublishStatus(params).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updateNewStatus(newStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('newStatus', newStatus);
            updateNewStatus(params).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updateRecommendStatus(recommendStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('recommendStatus', recommendStatus);
            updateRecommendStatus(params).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updateDeleteStatus(deleteStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('deleteStatus', deleteStatus);
            updateDeleteStatus(params).then((response) => {
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000
                });
            });
            this.getList();
        }
    }
};
</script>
