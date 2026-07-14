// 科目映射关系
const SUBJECT_MAP = {
  "circuit-principle": "电路原理",
  "electrical-machine": "电机学",
  "power-electronics": "电力电子技术",
  "high-voltage": "高电压技术",
  "relay-protection": "继电保护",
  "power-system-analysis": "电力系统分析",
  "electrical-equipment": "电气设备(发电厂)",
  "general-ability": "一般能力"
};

// 加载单个科目的题库
async function loadSubjectQuestions(subjectKey) {
  const res = await fetch(`questions/${subjectKey}/data.json`);
  return await res.json();
}

// 加载所有科目全部题目
async function loadAllQuestions() {
  let allQuestionList = [];
  for (let key in SUBJECT_MAP) {
    const list = await loadSubjectQuestions(key);
    allQuestionList = allQuestionList.concat(list);
  }
  return allQuestionList;
}

// 本地存储封装
const Storage = {
  get(key) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// 错题本操作工具
const WrongBook = {
  add(question) {
    const list = Storage.get("wrongList");
    const exists = list.find(item => item.id === question.id);
    if (!exists) list.push(question);
    Storage.set("wrongList", list);
  },
  getAll() {
    return Storage.get("wrongList");
  },
  remove(qid) {
    let list = Storage.get("wrongList");
    list = list.filter(item => item.id !== qid);
    Storage.set("wrongList", list);
  }
};

// 收藏题目操作工具
const CollectBook = {
  add(question) {
    const list = Storage.get("collectList");
    const exists = list.find(item => item.id === question.id);
    if (!exists) list.push(question);
    Storage.set("collectList", list);
  },
  getAll() {
    return Storage.get("collectList");
  },
  remove(qid) {
    let list = Storage.get("collectList");
    list = list.filter(item => item.id !== qid);
    Storage.set("collectList", list);
  },
  isCollect(qid) {
    const list = Storage.get("collectList");
    return list.some(item => item.id === qid);
  }
};

// 数组随机打乱（随机刷题用）
function shuffleArr(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 单题倒计时类（60秒计时）
class QuestionTimer {
  constructor(time = 60, callback) {
    this.totalTime = time;
    this.leftTime = time;
    this.callback = callback;
    this.timerId = null;
  }
  start() {
    this.timerId = setInterval(() => {
      this.leftTime--;
      this.callback(this.leftTime);
      if (this.leftTime <= 0) this.stop();
    }, 1000);
  }
  stop() {
    clearInterval(this.timerId);
  }
  reset() {
    this.leftTime = this.totalTime;
  }
}
