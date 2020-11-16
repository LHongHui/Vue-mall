const storage = window.localStorage;

export default {
  set(key, val) { //存
    if (val === undefined) {
      return;
    }
    storage.setItem(key, serialize(val));
  },
  get(key, def) {// 获得  '{"username":"tom","age":18}' 但也可能是 'hello'转对象会错,
    const val = deserialize(storage.getItem(key));
    return val === undefined ? def : val;
  },
  remove(key) { //删除一个key
    storage.removeItem(key);
  },
  clear() { //删除整个
    storage.clear();
  }
};

function serialize(val) { // 存时转字符串
  return JSON.stringify(val);
}

function deserialize(val) {// 获得时转为对象

  try {
    return JSON.parse(val); //  '{"username":"tom","age":18}'
  } catch (e) {
    return val || undefined; //如果不是对象的字符串而是纯字符串'hello'，不用转对象了
  }
}
