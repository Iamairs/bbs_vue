<template>
    <div id="mainContent">
        <div id="navbar">
            <el-menu :default-active="activeIndex" class="el-nav-menu" mode="horizontal" @select="handleSelect" v-show="showNavbar">
                <el-menu-item :index="1">全部</el-menu-item>
                <el-menu-item  v-for="(item, index) in boardList" :key="index" :index="item.boardId+1">{{ item.boardName }}</el-menu-item>
            </el-menu>

            <el-button type="primary" @click="choosePostDialog">发帖</el-button>
            <el-dialog title="发帖" :visible.sync="postDialogVisible" @close="resetPostForm">
                <el-form ref="postForm" :model="postForm" label-width="100px">
                    <el-form-item label="板块" required>
                        <el-select v-model="postForm.boardId" placeholder="请选择板块" :disabled="isModify">
                            <el-option v-for="(boardId, index) in boardOptions" :key="index" :label="boardId.boardName" :value="boardId.boardId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="悬赏积分" required>
                        <el-input v-model.number="postForm.credit" placeholder="请输入悬赏积分(非必须)"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" required>
                        <el-input v-model="postForm.postTitle" placeholder="请输入标题"></el-input>
                    </el-form-item>
                        <el-form-item label="内容" required>
                    <el-input v-model="postForm.postContent" type="textarea" rows="4" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="postDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitPostForm">发布</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 帖子列表 -->
        <div class="post_item_list" v-if="postItemList.length">
            <div class="post_item" v-for="(item, index) in postItemList" :key="index">
                <div class="post_item_left" @click="showUserInfo(item.postUserName)">
                    <el-avatar icon="el-icon-user-solid" :size="60"></el-avatar>
                    <div class="post_item_userName">{{item.postUserName}}</div>
                </div>
                <div class="post_item_mid">
                <div class="post_item_mid_top">
                    <el-tag size="small">{{item.boardName}}</el-tag>
                    <el-tag size="small" type="warning" v-if="item.credit != 0">{{item.credit}}积分</el-tag>
                    <el-tag size="small" type="success" :closable="myInfo.userType == 0" @close="handleCloseSticky(item.postId)" v-if="item.top">置顶</el-tag>
                    <el-tag size="small" type="danger" :closable="myInfo.userType == 0" @close="handleCloseFeature(item.postId)" v-if="item.refinement">加精</el-tag>
                    <span class="post_item_time">发表时间：{{formattedDate(item.postUpdateTime)}}</span>
                </div>
                <div class="post_item_mid_bottem">
                    <div class="post_item_topic" @click="jumpToPostDetail(item.postId)">{{item.postTitle}}</div>
                    <div class="post_item_content">{{item.postContent}}</div>
                </div>
                </div>
                <div class="post_item_right">
                    <el-dropdown trigger="click" v-if="myInfo.userName == item.postUserName || myInfo.userType == '0'" @command="handleCommand">
                        <span class="el-dropdown-link" @click="handleClick(item.postId)">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" class="item_dropdown">
                            <el-dropdown-item command="1">删除</el-dropdown-item>
                            <el-dropdown-item command="2">修改</el-dropdown-item>
                            <el-dropdown-item v-if="myInfo.userType == 0" command="3">置顶</el-dropdown-item>
                            <el-dropdown-item v-if="myInfo.userType == 0" command="4">加精</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div v-else> </div>
                    <div class="item_icons">
                    <i class="el-icon-view">{{item.postViewCount}}</i>
                    <i class="el-icon-chat-dot-round">{{item.postReplyCount}}</i>
                    </div>
                </div>
            </div>
            <!-- 个人资料对话框 -->
            <el-dialog :visible="dialogProfileVisible" title="个人资料" @close="closeUserProfile">
                <el-form :model="userProfile" label-position="left">
                    <el-form-item label="头像">
                        <el-avatar icon="el-icon-user-solid" :size="60"></el-avatar>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="userProfile.userName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="积分">
                        <el-input v-model="userProfile.credit" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作性质">
                        <el-input v-model="userProfile.work_nature" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="工作地点">
                        <el-input v-model="userProfile.work_place" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <div v-else>
            <el-empty description="空空如也~"></el-empty>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name:'MainContent',
    components: {},
    data() {
      return {
        showNavbar: true,
        boardList: [],
        activeIndex: '1',
        postDialogVisible: false,
        // 板块选择
        postForm: {},
        boardOptions: [],
        isModify: false,
        // 帖子列表
        postItemList:[],
        myInfo: {},
        currentPostId: 0,
        currentBoardKey: 1,
        dialogProfileVisible: false,
        // 用户个人资料
        userProfile: {},
      };
    },
    created() {
        // 获取所有板块
        this.getBoards();

        // 获取所有帖子
        this.getAllPosts();

        const haveLogined = this.$store.state.haveLogined;
        console.log("mainContent是否登录: ", haveLogined);
        if(haveLogined) {
            this.myInfo = this.$store.state.userInfo;
            console.log("mainContent下的myInfo: ", this.myInfo);
        }

        
    },
    mounted() {
      this.$bus.$on('updateBoardList',()=>{    //为全局事件总线绑定自定义事件updateBoardList
        this.getBoards();
      })
      
    },

    beforeUpdate() {
        // 如果是管理员，将boardList存入vuex
        if(this.$store.state.userInfo.userType == "0") {
            this.$store.state.boardList = this.boardList;
            console.log("板块：", this.boardList);
        }
    },
    
    methods: {
        // 获取板块内容
        getBoards() {
            this.$http.getBoards().then(res => {
                console.log("获取板块：", res);
                this.boardList = res.data;
                this.boardOptions = this.boardList.map(item => {
                    return {
                        boardName: item.boardName,
                        boardId: item.boardId
                    };
                });
            }).catch(err => {
                console.log(err);
            })
        },

        // 点击板块事件
        handleSelect(key, keyPath) {
            this.currentBoardKey = key;
            if(key == 1) {
                this.getAllPosts();
            } else {
                let boardId = parseInt(key) - 1;
                this.$http.getPostListByBoardId(boardId).then(res => {
                    this.postItemList = [];
                    console.log("当前页面的ID为: ", key);
                    console.log("当前页面的postList为: ", res.data);
                    const posts = res.data.posts;
                    const boardName = res.data.boardName;
                    posts.forEach(post => {
                        const postObject = { ...post, boardName };
                        this.postItemList.push(postObject);
                    });
                    // 按postUpdateTime排序（升序）
                    this.postItemList.sort((a, b) => {
                        return new Date(b.postUpdateTime) - new Date(a.postUpdateTime);
                    });
                    this.toTop();

                }).catch(err => {
                    console.log("获取板块post失败:", err);
                })
            }
            
        },

        choosePostDialog(havePostId) {
            console.log("havePostId:", havePostId);
            if(!isNaN(parseInt(havePostId))) {
                this.isModify = true;
                const foundPost = this.postItemList.find(post => post.postId == this.currentPostId);
                this.postForm.boardId = foundPost.postBoardId;
                this.postForm.credit = foundPost.credit;
                this.postForm.postTitle = foundPost.postTitle;
                this.postForm.postContent = foundPost.postContent;
            } else {
                this.isModify = false;
            }
            this.showPostDialog()
        },

        // 显示发布帖子对话框
        showPostDialog() {
            if(this.$store.state.haveLogined) {
                this.postDialogVisible = true;
            } else {
                this.$message({
                    type: 'error',
                    message: '登录后才可发帖'
                })
            }
        },

        // 验证帖子内容
        validatePost() {
            let flag = false;
            if(this.postForm.boardId == "") {
                this.$message({
                    type: 'warning',
                    message: '帖子板块不能为空'
                });
            } else if(this.postForm.postTitle.length == 0){
                this.$message({
                    type: 'warning',
                    message: '帖子标题不能为空'
                });
            } else if(this.postForm.postContent.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '帖子内容不能为空'
                });
            } else if(this.postForm.postTitle.length > 10) {
                this.$message({
                    type: 'warning',
                    message: '帖子标题不能超过10个字'
                });
            } else if(this.postForm.postContent.length > 500) {
                this.$message({
                    type: 'warning',
                    message: '帖子内容不能超过800字'
                });
            } else {
                flag = true;
            }
            return flag;
        },

        // 提交帖子
        submitPostForm() {
            if(this.validatePost()) {
                // 获取表单数据
                const postData = {
                    // postBoardId: ,
                    credit: this.postForm.credit,
                    postTitle: this.postForm.postTitle,
                    postContent: this.postForm.postContent,
                    // postUserName: this.myInfo.userName,
                };
                if(this.isModify) {
                    this.$set(postData, 'postId', this.currentPostId);
                    // 修改帖子
                    this.$http.modifyPostByPostId(postData).then(res => {
                        // 发布成功后的提示信息
                        this.$notify({
                            title: '通知',
                            message: '帖子发布成功！积分 +10',
                            type: 'success'
                        });
                        // 刷新页面，从而更新帖子列表
                        this.$router.go(0)
                    }).catch(err => {
                        console.log("发布帖子出错：\n", err);
                    })
                } else {
                    this.$set(postData, 'postUserName', this.myInfo.userName);
                    this.$set(postData, 'postBoardId', this.postForm.boardId);
                    // 执行发布逻辑，发送数据到后端等
                    this.$http.createPost(postData).then(res => {
                        // 发布成功后的提示信息
                        this.$notify({
                            title: '通知',
                            message: '帖子发布成功！积分 +10',
                            type: 'success'
                        });
                        // 刷新页面，从而更新帖子列表
                        this.$router.go(0)
                    }).catch(err => {
                        console.log("发布帖子出错：\n", err);
                    })
                }
                // 关闭对话框并重置表单
                this.postDialogVisible = false;
                this.resetPostForm();
            }
        },

        // 重置表单数据
        resetPostForm() {
            this.$refs.postForm.resetFields();
            this.postForm = {
                boardId: '',
                postTitle: '',
                postContent: ''
            };
        },

        // 置顶
        toTop() {
            // 查找top属性为1的项
            const topItems = this.postItemList.filter(item => item.top === 1);
            console.log("Home置顶: ", topItems);
            // 查找top属性不为1的项
            const nonTopItems = this.postItemList.filter(item => item.top !== 1);
            // 将top属性为1的项放在数组前面
            const sortedArray = [...topItems, ...nonTopItems];
            this.postItemList = sortedArray;
            console.log("this.postItemList:", this.postItemList);
        },


        // 获取所有帖子
        getAllPosts() {
            this.$http.getAllPostsData().then(res => {
                this.postItemList = [];
                console.log("AllPost: ", res);
                // 提取每个对象中的posts属性
                // this.postItemList = res.data.map(item => item.posts).flat();
                // console.log("this.postItemList:", this.postItemList);

                res.data.forEach(item => {
                    const { boardName, posts } = item;
                    posts.forEach(post => {
                    const postObject = { ...post, boardName };
                    this.postItemList.push(postObject);
                    });
                });
                // 按postUpdateTime排序（升序）
                this.postItemList.sort((a, b) => {
                    return new Date(b.postUpdateTime) - new Date(a.postUpdateTime);
                });
                this.toTop();

            }).catch(err => {
            console.log("Home: ", err);
            })
        },

        // 格式化时间
        formattedDate(time) {
          const date = moment(time).add(8, 'hours');
          return date.format('YYYY-MM-DD HH:mm:ss');
        },

        // 关闭个人资料对话框
        closeUserProfile() {
            this.dialogProfileVisible = false;
        },

        // 展示用户信息
        showUserInfo(userName) {
            // 打开个人资料对话框
            this.dialogProfileVisible = true;
            this.$http.getUserInfoById({userName: userName}).then(res => {
                console.log("个人资料：", res.data);
                this.userProfile = res.data;
            }).catch(err => {
                console.log(err);
            })
        },

        // 跳转到详情页
        jumpToPostDetail(postId) {
            this.showNavbar = false;
            this.$router.push({name: "postInfo", params: {postId: postId}})
            // this.$router.push('/post_info' + postId);
        },

        // 获取点击的postId
        handleClick(postId) {
          this.currentPostId = postId;
          console.log("this.currentPostId: ", this.currentPostId);
        }, 

        // 处理操作
        handleCommand(command) {
          if(this.currentPostId != 0) {
            switch(command) {
              case "1" : 
                this.deletePostByPostId(this.currentPostId);
                break;
              case "2" : 
                this.choosePostDialog(this.currentPostId);
                break;
              case "3":
                this.stickyPostByPostId(this.currentPostId);
                break;
              case "4":
                this.featuredPostByPostId(this.currentPostId);
                break;
              default:
                break;
            }
          }
        },
        // 删除帖子
        deletePostByPostId(postId) {
          this.$http.deletePostByPostId(postId).then(res => {
            this.$message({
                type: 'success',
                message: '删除成功'
            })
            this.handleSelect(this.currentBoardKey);
            console.log("删除帖子：", res);
          }).catch(err => {
            console.log("删除帖子：", err);
          })
        },

        modifyPostByPostId(postId) {
            this.showPostDialog();
        },

        // 置顶帖子
        stickyPostByPostId(postId) {
          // 查找具有特定ID的对象的索引
          let index = this.postItemList.findIndex(obj => obj.postId == postId);
          if(this.postItemList[index].top) {
            this.$message.success("该帖子已经置顶~");
          } else {
            this.$http.stickyPostByPostId(postId).then(res => {
              this.handleSelect(this.currentBoardKey);
              this.$message({
                  type: 'success',
                  message: '置顶成功'
              })
            }).catch(err => {
              console.log("置顶失败：", err);
            })
          }
        },
        // 取消置顶
        handleCloseSticky(postId) {
          this.$http.cancelStickyByPostId(postId).then(res => {
            this.handleSelect(this.currentBoardKey);
            this.$message({
                type: 'success',
                message: '取消置顶成功'
            })
          }).catch(err => {
            console.log("取消置顶失败：", err);
          })
        },

        // 加精帖子
        featuredPostByPostId(postId) {
          // 查找具有特定ID的对象的索引
          let index = this.postItemList.findIndex(obj => obj.postId == postId);
          if(this.postItemList[index].refinement) {
            this.$message.success("该帖子已经加精~");
          } else {
            this.$http.featuredPostByPostId(postId).then(res => {
              this.handleSelect(this.currentBoardKey);
              this.$message({
                  type: 'success',
                  message: '加精成功'
              })
            }).catch(err => {
              console.log("加精失败：", err);
            })
          }
        },

        // 取消加精
        handleCloseFeature(postId) {
          this.$http.cancelFeaturedByPostId(postId).then(res => {
            this.handleSelect(this.currentBoardKey);
            this.$message({
                type: 'success',
                message: '取消加精成功'
            })
          }).catch(err => {
            console.log("取消加精失败：", err);
          })
        }
    },
  };
</script>

<style scoped>
#navbar {
    display: flex;
}
.el-nav-menu {
    flex: 1;
}

.post_item {
  background-color: #fff;
  height: 100px;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.post_item_left {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.post_item_mid {
  padding: 0 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.post_item_mid_top{
  margin-top: 5px;
}
.post_item_mid_bottem {
  margin-bottom: 5px;
}
.post_item_userName {
  margin-top: 5px;
  font-size: 14px;
  color: #444;
}
.post_item_time {
  margin-left: 10px;
  font-size: 14px;
  color: #999;
}
.post_item_topic {
  line-height: 30px;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
  cursor: pointer;
}
.post_item_content {
  width: 750px;
  font-size: 14px;
  color: #888;
  /* 省略号 */
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post_item_right {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item_icons {
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  color: #aaa;
  width: 100px;
  align-self: flex-end;
}
.item_dropdown {
  margin-right: -50px;
}
.el-dropdown-link {
  margin-right: 10px;
  float: right;
}
</style>
