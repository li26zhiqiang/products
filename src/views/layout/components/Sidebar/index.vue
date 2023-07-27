<template>
    <div class="accordion-menu-container">
        <div class="top">
            <svg-icon :icon-class="'dashboard'"></svg-icon>
            <div class="app-title">产品管理</div>
        </div>

        <div class="center">
            <el-menu
                mode="vertical"
                :unique-opened="true"
                :show-timeout="200"
                :default-active="activePath"
                :collapse="isCollapse"
            >
                <sidebar-item :routes="routes"></sidebar-item>
            </el-menu>
        </div>

        <div class="bottom" @click="toggleSideBar">
            <el-icon v-if="sidebar.opened"><ElIconFold /></el-icon>
            <el-icon v-else><ElIconExpand /></el-icon>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import './index.less';

export default {
    components: {
        SidebarItem
    },
    data() {
        return { leafNodeIndexs: [] };
    },
    computed: {
        ...mapGetters(['sidebar', 'routers']),
        routes() {
            this.getLeafNodeIndexs(this.routers);
            return this.routers;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
        activePath() {
            let path = '';

            this.leafNodeIndexs?.forEach((item) => {
                if (this.$route.path.startsWith(item) && item.length > path.length) {
                    path = item;
                }
            });

            return path || this.$route.path;
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar');
        },
        getLeafNodeIndexs(routers, parentPath = '') {
            let indexs = [];

            routers.forEach((item) => {
                const { path, children, meta } = item;
                const url = parentPath + (path.startsWith('/') ? path : `/${path}`);

                if (children?.length && !meta?.isLeafNode) {
                    this.getLeafNodeIndexs(children, url);
                } else {
                    indexs.push(url);
                }
            });

            this.leafNodeIndexs = [...this.leafNodeIndexs, ...indexs];
        }
    }
};
</script>
