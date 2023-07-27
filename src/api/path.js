export default {
    userInfo: '/tytech-account/account/info',
    userInfoById: '/tytech-account/account/{id}',

    // 角色
    roleList: '/tytech-account/role/list',
    roleAllList: '/tytech-account/role/listAll',
    updateRoleStatus: '/tytech-account/role/updateStatus/{id}',
    updateRole: '/tytech-account/role/update/{id}',
    createRole: '/tytech-account/role/create',
    deleteRole: '/tytech-account/role/delete',
    roleListMenu: '/tytech-account/role/listMenu/{roleId}',
    roleAllocMenu: '/tytech-account/role/allocMenu',

    // 菜单
    menuList: '/tytech-account/menu/list/{parentId}',
    menuInfo: '/tytech-account/menu/{id}',
    menuTreeList: '/tytech-account/menu/treeList'
};

export function getRealPath(url = '', params = {}) {
    let path = url;

    Object.entries(params).forEach(([key, value]) => {
        const reg = new RegExp(`{${key}}`, 'g');
        path = path.replace(reg, value);
    });

    return path;
}
