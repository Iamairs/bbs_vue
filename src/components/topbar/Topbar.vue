<template>
    <div id="navbar">
      <div class="nav-content">
        <div class="bbs-logo">
          <router-link to='/'>南大论坛</router-link>
        </div>
        <div class="log-reg-btn" v-if="!haveLogined">
          <el-row>
            <el-button type="primary" plain @click="showLogin()">登录</el-button>
            <el-dialog title="请输入用户名和密码" :visible.sync="loginDialogVisible">
              <el-form ref="form" :model="login_form" label-width="80px">
                <el-form-item label="用户名">
                  <el-input v-model="login_form.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="login_form.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户类型">
                  <el-radio v-model="login_form.userType" label="1">普通用户</el-radio>
                  <el-radio v-model="login_form.userType" label="0">管理员</el-radio>
                </el-form-item> -->
              </el-form>
              <div slot="footer">
                <el-button @click="loginDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="userLogin">确定</el-button>
              </div>
            </el-dialog>
            <el-button type="primary" plain @click="showRegisterDialog()">注册</el-button>
            <el-dialog title="注册" :visible.sync="registerDialogVisible">
              <el-form ref="registerForm" :rules="rules_register" :model="registerForm" label-width="100px">
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="registerForm.userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="工作性质" prop="work_nature">
                  <el-input v-model="registerForm.work_nature" placeholder="请输入工作性质"></el-input>
                </el-form-item>
                <el-form-item label="工作地点" prop="work_place">
                  <el-input v-model="registerForm.work_place" placeholder="请输入工作地点"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="registerForm.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password">
                  <el-input v-model="registerForm.confirmPassword" placeholder="请确认密码" type="password"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="registerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
              </div>
            </el-dialog>
          </el-row>
        </div>
        <div class="nav-user" v-else>
          <div class= "img-name" @click="showUserInfoDialog">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <div class="nav_userName">{{ userInfo.userName }}</div>
          </div>

          <!-- 用户个人信息对话框 -->
          <el-dialog
            title="用户个人信息"
            :visible="userInfoDialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleUserInfoDialogClose"
          >
            <el-form :model="userDetailedInfo" :rules="userInfoRules" ref="userInfoForm">
              <!-- 用户头像 -->
              <el-form-item label="头像">
                <el-avatar size="large"></el-avatar>
              </el-form-item>

              <!-- 用户名 -->
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="userDetailedInfo.userName" :disabled="!isEditing"></el-input>
              </el-form-item>

              <!-- 积分 -->
              <el-form-item label="积分">
                <el-input v-model="userDetailedInfo.credit" :disabled="true"></el-input>
              </el-form-item>

              <!-- 邮箱 -->
              <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model="userDetailedInfo.userEmail" :disabled="!isEditing"></el-input>
              </el-form-item>

              <!-- 工作性质 -->
              <el-form-item label="工作性质" prop="work_nature">
                <el-input v-model="userDetailedInfo.work_nature" :disabled="!isEditing"></el-input>
              </el-form-item>

              <!-- 工作地点 -->
              <el-form-item label="工作地点" prop="work_place">
                <el-input v-model="userDetailedInfo.work_place" :disabled="!isEditing"></el-input>
              </el-form-item>

              <!-- 密码 -->
              <el-form-item label="密码" prop="password" v-show="isEditing">
                <el-input v-model="userDetailedInfo.password" :disabled="!isEditing"></el-input>
              </el-form-item>

              <!-- 编辑按钮 -->
              <el-form-item>
                <el-button type="primary" @click="toggleEditing">{{ isEditing ? '保存' : '编辑' }}</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button type="primary" plain @click="showBoardDrawer" v-if="userInfo.userType == '0'">板块管理</el-button>
          <el-button type="danger" plain @click=userLogout>注销</el-button>
        </div>

        <el-drawer :visible.sync="drawerBoardView" size="50%" title="板块管理">
          <el-button type="primary" @click="addBlock">添加板块</el-button>
          <el-table :data="boardList" style="margin-top: 20px">
            <el-table-column prop="boardId" label="板块ID"></el-table-column>
            <el-table-column prop="boardName" label="板块名称"></el-table-column>
            <el-table-column prop="boardDesc" label="板块描述"></el-table-column>
            <el-table-column prop="boardPostNum" label="帖子数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="editBlock(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteBlock(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-drawer>

        <el-dialog :visible.sync="editDialogVisible" title="编辑板块">
          <el-form :model="editBoardForm" :rules="editBoardRules" label-position="top">
            <el-form-item label="板块名称" prop="boardName">
              <el-input v-model="editBoardForm.boardName"></el-input>
            </el-form-item>
            <el-form-item label="板块描述" prop="boardDesc">
              <el-input v-model="editBoardForm.boardDesc"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
// 导入vuex
import {
		mapMutations
	} from 'vuex';

export default {
    name:'Topbar',
    components: {},
    data() {
      // 验证邮箱的规则
      var validateEmail = (rules,value,cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      return {
        userInfo: {},
        haveLogined: false,
        userName: "小米",
        loginDialogVisible: false,
        boardList: [],
        drawerBoardView: false,
        editDialogVisible: false,
        dialogCreateBoard: false,
        editBoardForm: {
          boardName: '',
          boardDesc: '',
        },
        editBoardRules: {
          boardName: [
            { required: true, message: '请输入板块名称', trigger: 'blur' },
            { min: 1, max: 8, message: '板块名称长度在1到8个字之间', trigger: 'blur' },
          ],
          boardDesc: [
            { required: true, message: '请输入板块描述', trigger: 'blur' },
            { min: 1, max: 100, message: '板块描述长度在1到100个字之间', trigger: 'blur' },
          ],
        },
        newBoard: {
          name: ""
        },
        // 登录表单
        login_form: {
          userName: '',
          password: '',
        },
        registerDialogVisible: false,
        // 注册表单
        registerForm: {
          userName: '',
          userEmail: '',
          work_nature: '',
          work_place: '',
          password: '',
          confirmPassword: ''
        },
        // 用户注册规则
        rules_register: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator: validateEmail, trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          work_place: [
            { required: true, message: '请输入工作地点', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          work_nature: [
          { required: true, message: '请输入工作性质', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
        },
        // 用户详细信息
        userDetailedInfo: {},
        userInfoDialogVisible: false,
        isEditing: false,
        // 修改用户信息规则
        userInfoRules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          userEmail: [
            {validator: validateEmail, trigger: 'blur' },
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            
          ],
          work_nature: [
            { required: true, message: '请填写工作性质', trigger: 'blur' }
          ],
          work_place: [
            { required: true, message: '请填写工作地点', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      if(localStorage.getItem("userInfo") != "underfined" && localStorage.getItem("userInfo")) {
        this.haveLogined = true;
        this.userInfo = this.$store.state.userInfo;
        console.log("TopBar: ", this.userInfo);
      }
    },

    methods: {
      ...mapMutations(['saveUserInfo', 'logout', 'setToken']),
      showLogin() {
        this.loginDialogVisible = true;
      },

      // 用户登录
      userLogin() {
        const loginParam = {
          userName: this.login_form.userName,
          password: this.login_form.password
        }
        this.$http.userLogin(loginParam).then(res => {
          console.log("登录成功：", res);
          this.saveUserInfo(res.data.user);
          this.setToken(res.data.token);
          this.loginDialogVisible = false;
          this.$router.go(0);
          this.$message({
            type: 'success',
            message:"欢迎回来，" + this.userInfo.userName,
          });
        }).catch(err => {
          this.$message({
            type: 'error',
            message:"登录失败！！",
          });
          console.log("登录失败: ", err);
        })
      },

      // 点击注册按钮
      showRegisterDialog() {
        this.registerDialogVisible = true;
      },

      // 提交注册
      submitRegisterForm(registerFormRef) {
        // 在这里可以进行表单验证
        if (this.validateRegisterForm(registerFormRef)) {
          const registerForm = {
            userName: this.registerForm.userName,
            userEmail: this.registerForm.userEmail,
            work_nature: this.registerForm.work_nature,
            work_place: this.registerForm.work_place,
            password: this.registerForm.password,
          }
          this.$http.userRegister(registerForm).then(res => {
            console.log("userRegister:", res.data);
            this.haveLogined = true;        //隐藏登录注册按钮
            console.log("user: ", res.data.user);
            // 存入vuex和本地
            this.saveUserInfo(res.data.user);
            this.setToken(res.data.token);

            this.registerDialogVisible = false;
            this.$refs[registerFormRef].resetFields();
            this.$router.go(0);
            this.$message({
              type: 'success',
              message: '注册成功'
            });
            
          }).catch(err => {
            console.log("注册：", err);
          })
        }
      },

      // 验证注册表单
      validateRegisterForm(formName) {
        // 进行表单验证逻辑，如判断密码是否一致等
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          this.$message.error('两次输入的密码不一致');
          return false;
        }

        if (Object.values(this.registerForm).some(value => value === '')) {
          this.$message.error('请填写完整信息！');
          return false;
        }
        return true;
      },

      // 用户退出登录
      userLogout() {
        this.logout();
        this.haveLogined = false;
        this.$message({
          type: 'success',
          message: '退出登录'
        });
        this.$router.go(0);
      },

      // 显示用户信息
      showUserInfoDialog() {
        this.userInfoDialogVisible = true;
        this.$http.getUserInfoById({userName: this.userInfo.userName}).then(res => {
          this.userDetailedInfo = res.data;
          console.log("获取用户信息成功：", res.data);
          this.userInfoDialogVisible = true;
        }).catch(err => {
          console.log("获取用户信息失败：", err);
        })
      },

      // 保存对话框关闭后的处理逻辑
      handleUserInfoDialogClose() {
        this.userInfoDialogVisible = false;
      },

      // 切换到编辑或保存
      toggleEditing() {
        if (this.isEditing) {
          // 保存修改
          this.editUserInformation();
        }
        this.isEditing = !this.isEditing;
      },

      // 保存用户信息
      editUserInformation() {
        this.$http.editUserInformation(this.userDetailedInfo).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功！'
          });
          return this.$http.getUserInfoById({userName: this.userInfo.userName});
        }).then(res => {
          let userInfo = res.data;
          // 保存到vuex
          this.saveUserInfo(userInfo);
          this.userInfo = userInfo;
        }).catch(err => {
          console.log("保存修改失败：", err);
        })
      },

      // 显示创建板块对话框
      showBoardDrawer() {
        this.drawerBoardView = true;
        this.boardList = this.$store.state.boardList;
        console.log("板块管理：", this.boardList);
        if(this.boardList) {
          this.drawerBoardView = true;
        } else {
          console.log("板块获取失败！");
        }
        
      },
      // 添加板块
      addBlock() {
        this.editBoardForm = {};
        this.editDialogVisible = true;
      },
      // 展示编辑窗口的板块内容
      editBlock(block) {
        console.log("编辑板块block：", block);
        this.editBoardForm.boardId = block.boardId;
        this.editBoardForm.boardName = block.boardName;
        this.editBoardForm.boardDesc = block.boardDesc;
        this.editBoardForm.boardPostNum = block.boardPostNum;
        this.editDialogVisible = true;
      },
      // 删除板块
      deleteBlock(block) {
        const index = this.boardList.findIndex(item => item.boardId == block.boardId);
        if (index !== -1) {
          this.$http.deleteBoardByBoardId(block.boardId).then(res => {
            this.boardList = res.data;
            this.$bus.$emit('updateBoardList');   //触发自定义事件updateBoardList
            this.$message.success('删除成功');
          }).catch(err => {
            console.log("删除失败：", err);
          })
        }
      },
      // 取消编辑
      cancelEdit() {
        this.editDialogVisible = false;
        this.editBoardForm.id = {};
      },
      saveEdit() {
        if (this.editBoardForm.boardId) {
          // 编辑板块
          const index = this.boardList.findIndex(item => item.boardId == this.editBoardForm.boardId);
          if (index !== -1) {
            this.$http.editBoardByBoardId(this.editBoardForm).then(res => {
              console.log("编辑板块：", res.data);
              this.boardList = res.data;
              this.$bus.$emit('updateBoardList');   //触发自定义事件updateBoardList
              this.$message.success('编辑板块成功');
            }).catch(err => {
              console.log("编辑失败：", err);
            })
          }
        } else {
          // 添加板块
          this.$http.createNewBoard(this.editBoardForm).then(res => {
            this.boardList = res.data;
            console.log("添加板块：", res);
            this.$bus.$emit('updateBoardList')   //触发自定义事件updateBoardList
            this.$message({
              type: 'success',
              message: '创建新板块成功！'
            });
          }).catch(err => {
            console.log("创建新板块失败：", err);
          })
        }

        this.editDialogVisible = false;
        this.editBoardForm.id = null;
        this.editBoardForm.boardName = '';
      },
      // 取消发布板块
      cancelCreateBoard() {
        this.dialogCreateBoard = false;
        // 重置表单
        this.editBoardForm = {};
      },
      
    },
  };
</script>

<style scoped>
  /* 整个导航栏 */
  #navbar {
    width: 100%;
    height: 100px;

    z-index: 999;

    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
  }

  .nav-content {
    width: 1000px;
    height: 100%;

    /* 悬浮并居中 */
    margin: 0 auto;
    
    display: flex;
    /* 设置位置 */
    align-items: center;
    justify-content: center;
  }

  /* logo标题 */
  .bbs-logo {
    flex: 1;
    /* 改成小手 */
    cursor: pointer;
    /* 字体 */
    font-family: 'SuXinShi';
    font-size: 38px;
  }
  .nav-user {
    width: 300px;
    display: flex;
    justify-content: end;
    align-items: center;
    /* justify-content: space-between; */
  }

  .img-name {
    width: 130px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  .nav_userName {

    font-size: 13px;
    color: #666;
    text-align: center;
  }


</style>
