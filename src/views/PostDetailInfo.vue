<template>
    <div id="post_detail_info">
        <div class="post_info">
            <div class="post_info_top">
                <div class="post_title_tag">
                    <div class="post_title">{{ postInfo.postTitle }}</div>
                    <!-- <el-tag size="small">{{postInfo.tag}}</el-tag> -->
                    <el-tag size="small" type="warning" v-if="postInfo.credit != 0">{{postInfo.credit}}积分</el-tag>
                    <el-tag type="success" v-if="postInfo.top">置顶</el-tag>
                    <el-tag type="danger" v-if="postInfo.refinement">加精</el-tag>
                </div>
                <div class="post_time_view_comment">
                    <div class="post_time">{{formattedDate(postInfo.postUpdateTime)}}</div>
                    <div class="post_view_comment">
                        <i class="el-icon-view">{{postInfo.postViewCount}}次阅读</i>
                        <i class="el-icon-chat-dot-round">{{postInfo.postReplyCount}}个评论</i>
                    </div>
                </div>
            </div>
            <div class="post_info_bottom">
                <div class="post_content">
                    {{postInfo.postContent}}
                </div>
            </div>
        </div>
        
        <div class="comment_list">
            <div class="post_comment">
                <el-input class="comment_textarea" type="textarea" v-model="myComment" placeholder="与其赞同别人的话语，不如自己畅所欲言。"></el-input>
                <el-button type="primary" @click="submitComment">快速回复</el-button>
            </div>
            <div class="comment_item" v-for="(item, index) in replyList" :key="index">
                <div class="comment_left">
                    <el-avatar icon="el-icon-user-solid" :size="60"></el-avatar>
                </div>
                <div class="comment_mid">
                    <div class="comment_user_info">
                        <div class="comment_userName">{{ item.replyUserName }}</div>
                        <div class="comment_post_time">{{ formattedDate(item.replyCreateTime) }}</div>
                    </div>
                    <div class="comment_content">
                        {{ item.replyContent }}
                    </div>
                </div>
                <div class="comment_right">
                  <div class="comment_right_top">
                    <div class="reply_floor">{{ index+1 }}楼</div>
                    <div class="delete_reply" v-if="myInfo.userId && (myInfo.userName == item.replyUserName || myInfo.userType == '0')" @click="deleteReply(item.replyId)">X</div>
                    <div v-else style="width: 13px"></div>
                  </div>
                  <div v-if="postInfo.credit != 0">
                    <div class="comment_right_bottom" v-if="postInfo.isadopt && item.isadopt">
                      已采纳
                    </div>
                    <div v-else-if="postInfo.postUserName == myInfo.userName && !postInfo.isadopt" >
                      <el-button type="primary" size="small" plain @click="adoptReply(item.replyId)">采纳</el-button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name:'PostDetailInfo',
    components: { },
    data() {
      return {
        myInfo: {},
        postId: "1",

        postInfo: {},
        myComment: "",
        replyList: [],
        isAdopt: false,
      };
    },
    created() {
      // 获取帖子内容
      this.postId = this.$route.params.postId;
      console.log("postId: ", this.postId);
      if(this.$store.state.haveLogined) {
        this.myInfo = this.$store.state.userInfo;
      }
      
      this.getPostAndReplyBypostId();
      console.log("myInfo: ", this.myInfo);
    },
    methods: {
      // 格式化时间
      formattedDate(time) {
        const date = moment(time);
        return date.format('YYYY-MM-DD HH:mm:ss');
      },

      // 获取帖子内容
      getPostAndReplyBypostId() {
        this.$http.getPostAndReplyBypostId(this.postId).then(res => {
          console.log("获取帖子内容和回复：", res.data);
          this.postInfo = res.data.post;
          this.replyList = res.data.reply;
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '评论详情获取失败！'
          })
        })
      },

      // 提交评论
      submitComment() {
        if(this.$store.state.haveLogined) {
            if(this.myComment.length == 0) {
              this.$message({
                type: 'warning',
                message: '评论内容不能为空~'
              })
            } else if (this.myComment.length > 400) {
              this.$message({
                type: 'warning',
                message: '评论内容不能超过400字~'
              })
            } else {
              let params = {
                replyUserName: this.$store.state.userInfo.userName,
                replyContent: this.myComment,
                replyPostId: this.postInfo.postId
              }
              this.$http.submitComment(params).then(res => {
                this.myComment = "";
                console.log("发布评论: ", res.data);
                this.getPostAndReplyBypostId(this.postInfo.postId);
                this.$notify({
                  title: '通知',
                  message: '评论发布成功！积分 +5',
                  type: 'success'
                });
              }).catch(err => {
                this.$message({
                  type: 'error',
                  message: '发布评论出错~'
                })
                console.log("发布评论出错：\n", err);
              })
            }
          } else {
              this.$message({
                  type: 'error',
                  message: '登录后才可评论~'
              })
          }
      },

      // 删除评论
      deleteReply(replyId) {
        this.$http.deleteReplyByReplyId(replyId).then(res => {
            this.getPostAndReplyBypostId();
            this.$message({
              type: 'success',
              message: '评论删除成功'
            })
          }).catch(err => {
            console.log("评论删除失败：", err);
        })
      },
      // 采纳评论
      adoptReply(replyId) {
        this.$http.adoptReply({replyId: replyId}).then(res => {
          console.log("采纳评论：", res);
          this.postInfo = res.data.post;
          this.replyList = res.data.reply;

          // 查找isadopt为1的项
          const adoptedReply = replyList.find(reply => reply.isadopt == 1);
          // 如果找到了被采纳的回复，则将其从数组中移除，并添加到数组的前面
          if (adoptedReply) {
            replyList.splice(replyList.indexOf(adoptedReply), 1);  // 从数组中移除被采纳的回复
            replyList.unshift(adoptedReply);  // 将被采纳的回复添加到数组的前面
          }
        }).catch(err => {
          console.log("采纳评论出错", err);
        })
      }
    },
  };
</script>

<style scoped>
.post_info {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}

.post_info_top {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px #eee solid;
}

.post_title_tag {
  display: flex;
  align-items: center;
}

.post_title {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
}

.post_time_view_comment {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.post_time {
  font-size: 14px;
  color: #999;
  margin-right: 10px;
}

.post_view_comment i {
  margin-right: 10px;
  font-size: 14px;
  color: #999;
}

.post_info_bottom {
  margin-top: 10px;
}

.post_content {
  font-size: 16px;
  line-height: 1.5;
  min-height: 200px;
  overflow-wrap:break-word;
  overflow: auto;
}

/* 标签样式 */
.el-tag {
  margin-right: 5px;
}

.post_comment {
  display: flex;
  margin-bottom: 20px;
}

.comment_textarea {
  width: 100%;
}

.comment_item {
  min-height: 100px;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px #ddd solid;
  padding: 20px;
}

.comment_left {
  flex-shrink: 0;
  margin: 0 20px 0 0;
}

.comment_mid {
  width: 800px;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* flex-grow: 1; */
}

.comment_user_info {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 5px;
}

.comment_userName {
  font-weight: bold;
  margin-right: 10px;
}

.comment_post_time {
  font-size: 13px;
  color: #888;
}

.comment_content {
  word-wrap:break-word; 
  word-break:break-all;
  margin-top: 5px;
  overflow:visible;
}
.comment_right {
  width: 80px;
  align-self: flex-start;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
}

.comment_right_top {
  
  text-align: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: #999;

  

  display: flex;
  justify-content: end;
}
.reply_floor{
  margin-right: 10px;
}
.delete_reply {
  color: orange;
  cursor: pointer;
}

.comment_right_bottom {
  color: rgb(59, 165, 75);
  
  font-family: 'SuXinShi';
  font-size: 20px;
}
/* .post_comment {
    display: flex;
}
.comment_textarea {
    flex: 1;
} */

</style>
