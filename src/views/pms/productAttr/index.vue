<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="operate-container" shadow="never">
                <el-button class="btn-add" @click="addProductAttrCate()" type="primary"> 添加 </el-button>
            </el-card>

            <div class="table-container">
                <el-table ref="productAttrCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
                    <el-table-column label="编号" width="100">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="类型名称">
                        <template v-slot="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="属性数量" width="200">
                        <template v-slot="scope">{{
                            scope.row.attributeCount == null ? 0 : scope.row.attributeCount
                        }}</template>
                    </el-table-column>
                    <el-table-column label="参数数量" width="200">
                        <template v-slot="scope">{{
                            scope.row.paramCount == null ? 0 : scope.row.paramCount
                        }}</template>
                    </el-table-column>
                    <el-table-column label="设置" width="200">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="getAttrList(scope.$index, scope.row)"
                                >属性列表
                            </el-button>
                            <el-button link type="primary" @click="getParamList(scope.$index, scope.row)"
                                >参数列表
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
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

            <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="handleClose()" width="660px">
                <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="90px">
                    <el-form-item label="类型名称" prop="name">
                        <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确定</el-button>
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
import { fetchList, createProductAttrCate, deleteProductAttrCate, updateProductAttrCate } from '@/api/productAttrCate';

export default {
    name: 'productAttrCateList',
    data() {
        return {
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                pageNum: 1,
                pageSize: 10
            },
            dialogVisible: false,
            dialogTitle: '',
            productAttrCate: {
                name: '',
                id: null
            },
            rules: {
                name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
            }
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
            });
        },
        addProductAttrCate() {
            this.dialogVisible = true;
            this.dialogTitle = '添加类型';
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
        handleDelete(index, row) {
            this.$confirm('确定要删除该品牌吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProductAttrCate(row.id).then((response) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.dialogTitle = '编辑类型';
            this.productAttrCate.name = row.name;
            this.productAttrCate.id = row.id;
        },
        getAttrList(index, row) {
            this.$router.push({
                path: '/pms/productAttr/productAttrList',
                query: { cid: row.id, cname: row.name, type: 0 }
            });
        },
        getParamList(index, row) {
            this.$router.push({
                path: '/pms/productAttr/productAttrList',
                query: { cid: row.id, cname: row.name, type: 1 }
            });
        },
        handleConfirm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = new URLSearchParams();
                    data.append('name', this.productAttrCate.name);
                    if (this.dialogTitle === '添加类型') {
                        createProductAttrCate(data).then((response) => {
                            this.$message({
                                message: '添加成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.dialogVisible = false;
                            this.getList();
                        });
                    } else {
                        updateProductAttrCate(this.productAttrCate.id, data).then((response) => {
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.dialogVisible = false;
                            this.getList();
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleClose() {
            if (!this.dialogVisible && this.$refs.productAttrCatForm) {
                this.$refs.productAttrCatForm.clearValidate();
            }
        }
    }
};
</script>
