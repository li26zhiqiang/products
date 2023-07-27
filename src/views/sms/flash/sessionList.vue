<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">秒杀时间段列表</span>
            </template>
        </el-page-header>

        <el-card shadow="never" class="operate-container">
            <el-button type="primary" class="btn-add" @click="handleAdd()">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="flashSessionTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="秒杀时间段名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="每日开始时间">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.startTime) }}</template>
                </el-table-column>
                <el-table-column label="每日结束时间">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.endTime) }}</template>
                </el-table-column>
                <el-table-column label="启用">
                    <template v-slot="scope">
                        <el-switch
                            @change="handleStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.status"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加时间段" v-model="dialogVisible" width="660px">
            <el-form :model="flashSession" ref="flashSessionForm" label-width="130px">
                <el-form-item label="秒杀时间段名称：">
                    <el-input v-model="flashSession.name" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="每日开始时间：">
                    <el-time-picker v-model="flashSession.startTime" placeholder="请选择时间" class="input-width">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="每日结束时间：">
                    <el-time-picker v-model="flashSession.endTime" placeholder="请选择时间" class="input-width">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-radio-group v-model="flashSession.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, updateStatus, deleteSession, createSession, updateSession } from '@/api/flashSession';
import { formatDate } from '@/utils/date';
const defaultFlashSession = {
    name: null,
    startTime: null,
    endTime: null,
    status: 0
};
export default {
    name: 'flashPromotionSessionList',
    data() {
        return {
            list: null,
            listLoading: false,
            dialogVisible: false,
            isEdit: false,
            flashSession: Object.assign({}, defaultFlashSession)
        };
    },
    created() {
        this.getList();
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        formatTime_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'hh:mm:ss');
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.flashSession = Object.assign({}, defaultFlashSession);
        },
        handleStatusChange(index, row) {
            this.$confirm('确定要修改该状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    updateStatus(row.id, { status: row.status }).then((response) => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                    this.getList();
                });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.flashSession = Object.assign({}, row);
            this.flashSession.startTime = new Date(row.startTime);
            this.flashSession.endTime = new Date(row.endTime);
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该时间段?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSession(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleDialogConfirm() {
            this.$confirm('确定要添加/修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateSession(this.flashSession.id, this.flashSession).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createSession(this.flashSession).then((response) => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                }
            });
        },
        getList() {
            this.listLoading = true;
            fetchList({}).then((response) => {
                this.listLoading = false;
                this.list = response.data;
            });
        }
    }
};
</script>
