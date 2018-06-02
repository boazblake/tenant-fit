export const AuthConfig = () => {
  session : {
    userId: '',
    userName: '',
    adminId: ''
  },

  auth: () => (this.session.userId ? true : false),
  toAdmin: id => (this.session.adminId = id),
  isAdmin: () => (this.session.adminId == id ? true : false),
  toUserId: id => (this.session.userId = id),
  userId: () => this.session.userId,
  adminId: () => this.session.admin,
  toUserName: name => (this.session.userName = name),
  userName: () => this.session.userName,
  reset: () => (this.session = {}),

  return ({
    auth,
    toAdmin,
    isAdmin,
    toUserId,
    userId,
    adminId,
    toUserName,
    userName,
    reset
  })
}