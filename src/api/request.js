import {Get,Post,Put,Patch,Delete} from "./axios";

export default {
    // 测试
    testRequest: () => {
        return Get('/test');
    },
    // 用户登录
    userLogin: (params) => {
        return Post('/user/userLogin', params);
    },

    // 用户注册
    userRegister: (params) => {
        return Post('user/register', params);
    },

    // 更改用户信息
    editUserInformation: (params) => {
        return Put('user/userUpdateInfo', params);
    },

    // 获取所有板块
    getBoards: () => {
        return Get('/board/findAllBoard');
    },

    // 发布帖子
    createPost: (params) => {
        return Post('/post/addPost', params);
    },

    // 通过postId删除帖子
    deletePostByPostId: (params) => {
        return Delete('/post/deletePostContent-' + params);
    },

    // 获取所有帖子
    getAllPostsData: () => {
        return Get('/board/findAllBoard');
    },

    // 根据boardId获取帖子列表
    getPostListByBoardId: (id) => {
        return Get('board/listPosts-' + id);
    },

    // 通过postId获取帖子和评论
    getPostAndReplyBypostId(params) {
        return Get("/post/postContent-" + params);
    },

    // 通过postId获取帖子评论
    // getCommentsByPostId(params) {
    //     return Get("/reply/get_reply_by_postId", params);
    // },

    // 发布评论
    submitComment(params) {
        return Post("/reply/addReply", params);
    },

    // 删除评论
    deleteReplyByReplyId(params) {
        return Delete("/reply/deleteReplyContent-" + params)
    },

    // 采纳评论
    adoptReply(params) {
        return Put("/reply/adopt", params)
    },

    // 通过UID查询用户信息
    getUserInfoById: (params) => {
        return Get('/user/listUserInfo', params);
    },

    // 通过postId修改帖子
    modifyPostByPostId: (params) => {
        return Put('post/putPost', params);
    },

    // 通过postId置顶帖子
    stickyPostByPostId: (params) => {
        return Put('post/topPost-' + params);
    },

    // 通过postId取消置顶帖子
    cancelStickyByPostId: (params) => {
        return Put('post/UnTopPost-' + params);
    },

    // 通过postId加精帖子
    featuredPostByPostId: (params) => {
        return Put('post/refinePost-' + params);
    },

    // 通过postId取消加精帖子
    cancelFeaturedByPostId: (params) => {
        return Put('post/UnRefinePost-' + params)
    },
    
    // 创建新板块
    createNewBoard(params) {
        return Post('/admin/addBoard', params);
    },

    // 编辑板块
    editBoardByBoardId(params) {
        return Put('/admin/updateBoard', params);
    },

    // 删除板块
    deleteBoardByBoardId(params) {
        return Delete('/admin/deleteBoard-' + params);
    },
}








// import {Get,Post,Put,Patch,Delete} from "./axios";

// export default {
//     // 测试
//     testRequest: () => {
//         return Get('/bbs/test');
//     },
//     // 用户登录
//     userLogin: (params) => {
//         return Post('/bbs/user/userLogin', params);
//     },

//     // 用户注册
//     userRegister: (params) => {
//         return Post('/bbs/user/register', params);
//     },

//     // 更改用户信息
//     editUserInformation: (params) => {
//         return Put('/bbs/user/userUpdateInfo', params);
//     },

//     // 获取所有板块
//     getBoards: () => {
//         return Get('/bbs/board/findAllBoard');
//     },

//     // 发布帖子
//     createPost: (params) => {
//         return Post('/bbs/post/addPost', params);
//     },

//     // 通过postId删除帖子
//     deletePostByPostId: (params) => {
//         return Delete('/bbs/post/deletePostContent-' + params);
//     },

//     // 获取所有帖子
//     getAllPostsData: () => {
//         return Get('/bbs/board/findAllBoard');
//     },

//     // 根据boardId获取帖子列表
//     getPostListByBoardId: (id) => {
//         return Get('/bbs/board/listPosts-' + id);
//     },

//     // 通过postId获取帖子和评论
//     getPostAndReplyBypostId(params) {
//         return Get('/bbs/post/postContent-' + params);
//     },

//     // 通过postId获取帖子评论
//     // getCommentsByPostId(params) {
//     //     return Get("/reply/get_reply_by_postId", params);
//     // },

//     // 发布评论
//     submitComment(params) {
//         return Post('/bbs/reply/addReply', params);
//     },

//     // 删除评论
//     deleteReplyByReplyId(params) {
//         return Delete('/bbs/reply/deleteReplyContent-' + params)
//     },

//     // 采纳评论
//     adoptReply(params) {
//         return Put('/bbs/reply/adopt', params)
//     },

//     // 通过UID查询用户信息
//     getUserInfoById: (params) => {
//         return Get('/bbs/user/listUserInfo', params);
//     },

//     // 通过postId修改帖子
//     modifyPostByPostId: (params) => {
//         return Put('/bbs/post/putPost', params);
//     },

//     // 通过postId置顶帖子
//     stickyPostByPostId: (params) => {
//         return Put('/bbs/post/topPost-' + params);
//     },

//     // 通过postId取消置顶帖子
//     cancelStickyByPostId: (params) => {
//         return Put('/bbs/post/UnTopPost-' + params);
//     },

//     // 通过postId加精帖子
//     featuredPostByPostId: (params) => {
//         return Put('/bbs/post/refinePost-' + params);
//     },

//     // 通过postId取消加精帖子
//     cancelFeaturedByPostId: (params) => {
//         return Put('/bbs/post/UnRefinePost-' + params)
//     },
    
//     // 创建新板块
//     createNewBoard(params) {
//         return Post('/bbs/admin/addBoard', params);
//     },

//     // 编辑板块
//     editBoardByBoardId(params) {
//         return Put('/bbs/admin/updateBoard', params);
//     },

//     // 删除板块
//     deleteBoardByBoardId(params) {
//         return Delete('/bbs/admin/deleteBoard-' + params);
//     },
// }
