// 主要用来存储多语言翻译
const storage = {};

const setItem = (key, value) => {
  storage[key] = value;
};

const getItem = key => {
  return storage[key];
};

const getAllItems = () => {
  return storage;
};

module.exports = {
  setItem,
  getItem,
  getAllItems,
};
