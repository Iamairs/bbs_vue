<template>
    <div class="post_item_list">
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
                    <el-dropdown-item v-if="myInfo.userType == 0" command="2">置顶</el-dropdown-item>
                    <el-dropdown-item v-if="myInfo.userType == 0" command="3">加精</el-dropdown-item>
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
        <el-dialog :visible="dialogVisible" title="个人资料" @close="closeUserProfile">
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
                    <el-input v-model="userProfile.workNature" readonly></el-input>
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-input v-model="userProfile.workPlace" readonly></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
        
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name:'PostItemList',
    components: {},
    data() {
      return {
        myInfo: {},
        currentPostId: 0,
        dialogVisible: false,
        userProfile: {
            userId: 1,
            userName: 'xys',
            credit: 0,
            workNature: 'IT',
            workPlace: '南昌',
        },
      };
    },
    props: {
        postItemList: {
            type: Array,
            required: true
        }
    },
    created() {
      
      const haveLogined = this.$store.state.haveLogined;
      console.log("PostItemList的是否登录: ", haveLogined);
      if(haveLogined) {
        this.myInfo = this.$store.state.userInfo;
        console.log("PostItemList下的myInfo: ", this.myInfo);
      }
    },
    mounted() {
      this.topPosts();
    },
    methods: {
        // 置顶
        topPosts() {
          // 查找top属性为1的项
          const topItems = this.postItemList.filter(item => item.top === 1);
          console.log("置顶：", topItems);
          // 按时间降序排序
          topItems.sort((a, b) => new Date(b.postUpdateTime) - new Date(a.postUpdateTime));
          // 查找top属性不为1的项
          const nonTopItems = this.postItemList.filter(item => item.top !== 1);
          // 将top属性为1的项放在数组前面
          const sortedArray = [...topItems, ...nonTopItems];
          this.postItemList = sortedArray;
        },

        // 格式化时间
        formattedDate(time) {
          const date = moment(time).add(8, 'hours');
          return date.format('YYYY-MM-DD HH:mm:ss');
        },

        // 关闭个人资料对话框
        closeUserProfile() {
            this.dialogVisible = false;
        },

        // 展示用户信息
        showUserInfo(userName) {
            // 打开个人资料对话框
            this.dialogVisible = true;
            // this.$http.getUserInfoById({userName: userName}).then(res => {
            //     console.log(res.data);
            //     this.userProfile.userName = res.data.user.userName;
            //     this.userProfile.score = res.data.user.score;
            //     this.userProfile.workNature = res.data.user.workNature;
            //     this.userProfile.workPlace = res.data.user.workPlace;
            // }).catch(err => {
            //     console.log(err);
            // })
        },

        // 跳转到详情页
        jumpToPostDetail(postId) {
            this.$router.push({name: "postInfo", params: {postId: postId}})
            // this.$router.push('/post_info' + postId);
        },

        // 获取点击的postId
        handleClick(postId) {
          console.log("this.currentPostId: ", this.currentPostId);
          this.currentPostId = postId;
        }, 

        // 处理操作
        handleCommand(command) {
          if(this.currentPostId != 0) {
            switch(command) {
              case "1" : 
                this.deletePostByPostId(this.currentPostId);
                break;
              case "2":
                this.stickyPostByPostId(this.currentPostId);
                break;
              case "3":
                this.featuredPostByPostId(this.currentPostId);
                break;
              default:
                break;
            }
            this.currentPostId = 0;
          }
        },
        // 删除帖子
        deletePostByPostId(postId) {
          this.$message({
              type: 'success',
              message: '删除成功'
          })
          console.log("1111");
          // this.$http.deletePostByPostId({postId: postId}).then(res => {
          //   this.$message({
          //       type: 'success',
          //       message: '删除成功'
          //   })
          //   console.log("删除帖子：", res);
          // }).catch(err => {
          //   console.log("删除帖子：", err);
          // })
        },

        // 置顶帖子
        stickyPostByPostId(postId) {
          // 查找具有特定ID的对象的索引
          let index = this.postItemList.findIndex(obj => obj.postId == postId);
          if(this.postItemList[index].sticky) {
            this.$message.success("该帖子已经置顶~");
          } else {
            this.$http.stickyPostByPostId({postId: postId}).then(res => {
              // 将对象从原数组中删除，并将其插入到第一个位置
              this.postItemList.unshift(myArray.splice(index, 1)[0]);
              this.postItemList[index].sticky = true;
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
          this.$http.cancelStickyByPostId({postId: postId}).then(res => {
            // 将对象从原数组中删除，并将其插入到第一个位置
            this.postItemList.push(myArray.splice(index, 1)[0]);
            this.postItemList[index].sticky = false;
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
          if(this.postItemList[index].featured) {
            this.$message.success("该帖子已经加精~");
          } else {
            this.$http.featuredPostByPostId({postId: postId}).then(res => {
              // 查找具有特定ID的对象的索引
              let index = this.postItemList.findIndex(obj => obj.postId == postId);
              this.postItemList[index].featured = true;
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
          this.$http.cancelFeaturedByPostId({postId: postId}).then(res => {
            // 查找具有特定ID的对象的索引
            let index = this.postItemList.findIndex(obj => obj.postId == postId);
            this.postItemList[index].featured = false;
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
