const bcrypt = require('bcrypt');
const { db } = require('../../utils/db');

const UserRole = {
  administrator: 'administrator',
  developer: 'developer',
  manager: 'manager',
  support: 'support',
  user: 'user',
}

const UserStatus = {
  active: "active",
  inactive: "inactive"
}

async function findUserByEmail(email) {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUser(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  user.role = UserRole.user;
  user.status = UserStatus.active;

  return await db.user.create({
    data: user,
  });
}

async function findUserById(id) {
  //console.log(id)
  return await db.user.findUnique({
    where: {
      id:id,
    },
  });
}

async function updateUserById(user) {
  return await db.user.update({
      where: {
          id : user.id,
      },
      data: user,
  });
}

async function getAllUsersToken() {
  return await db.user.findMany({
    select: {token:true}
  });
}


module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  getAllUsersToken
};