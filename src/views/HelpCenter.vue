<template>
    <div class="help-center">
      <post-item-list :postItemList="postItemList"></post-item-list>
    </div>
</template>

<script>

import PostItemList from '../components/PostItemList.vue'

export default {
    name:'HelpCenter',
    components: { PostItemList },
    data() {
      return {
        index: 0,
        postItemList: [
          {
            userName: "xys",
            userId: "1",
            postTime: "2023-06-06 08:23:00",
            tag: "求助",
            sticky: true,
            featured: true,
            credit: 10,
            topic: "这是一个标题",
            content: "这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
            postId: 2,
            views: 12,
            comments: 2,
          },
          {
            userName: "xys",
            userId: "1",
            postTime: "2023-06-06 08:23:00",
            tag: "求助",
            sticky: false,
            featured: false,
            credit: 10,
            topic: "这是一个标题",
            content: "这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容。",
            postId: 1,
            views: 12,
            comments: 2,
          },
          {
            userName: "xys",
            userId: "2",
            postTime: "2023-06-06 08:23:00",
            tag: "求助",
            sticky: false,
            featured: true,
            credit: 10,
            topic: "这是一个标题",
            content: "这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
            postId: 1,
            views: 12,
            comments: 2,
          }
        ],
      };
    },
    created() {
      this.index = this.$route.params.index;
      // this.getHelpPostsData();
    },
    methods: {
      // 获取所有帖子
      getHelpPostsData() {
        this.$http.getHelpPostsData(this.index).then(res => {
          // this.postItemList = res.data;
          console.log(res.data);
        }).catch(err => {
          console.log(err);
        })
      }
    },
  };
</script>

<style scoped>
.bbs_home {
  height: 1000px;
  /* background-color: aquamarine; */
}

.post_item {
  background-color: #fff;
  height: 100px;
  padding: 10px 0;
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
}
.post_item_content {
  width: 750px;
  font-size: 16px;
  color: #888;
  /* 省略号 */
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post_item_right {
  padding: 0 10px;
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  color: #aaa;
  width: 100px;
  align-self: flex-end;
}
</style>
