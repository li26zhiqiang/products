<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group tag="span" name="breadcrumb">
            <template v-for="(item, index) in levelList">
                <el-breadcrumb-item v-if="item.meta.title" :key="index">
                    <span v-if="item.redirect === 'noredirect' || index == levelList.length - 1" class="no-redirect">{{
                        item.meta.title
                    }}</span>

                    <router-link v-else :to="item.redirect || item.path">{{ item.meta.title }}</router-link>
                </el-breadcrumb-item>
            </template>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
export default {
    created() {
        this.getBreadcrumb();
    },
    data() {
        return {
            levelList: null
        };
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter((item) => item.name);
            const first = matched[0];
            if (first && first.name !== 'home') {
                matched = [{ path: '/pms', meta: { title: '产品管理' } }].concat(matched);
            }
            this.levelList = matched;
        }
    }
};
</script>

<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 12px;
    line-height: 32px;
    margin-left: 16px;
    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
