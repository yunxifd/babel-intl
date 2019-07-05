// 主要用来汇总错误信息
const storage = [];

const push = message => {
  storage.push(message);
};

const getAllItems = () => {
  return storage;
};

module.exports = {
  push,
  getAllItems,
};
