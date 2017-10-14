export const CheckAuth =
  { auth: () => sessionStorage.userId ? true : false
  , isAdmin: () => sessionStorage.isAdmin ? sessionStorage.isAdmin : sessionStorage.isAdmin //admin check
  , userId: () => sessionStorage.userId ? JSON.parse(sessionStorage.userId) : false //client side
  , adminId: () => sessionStorage.adminId ? JSON.parse(sessionStorage.adminId) : false //admin side - admin user
  }
