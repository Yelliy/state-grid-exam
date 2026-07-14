const paper = Storage.get("currentExamPaper");
const config = Storage.get("examConfig");
let currentIndex = 0;
let timer = null;
let selectedAnswer = "";

const timerText = document.getElementById("timerText");
const qTitle = document.getElementById("qTitle");
const optsWrap = document.getElementById("optsWrap");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const resultWrap = document.getElementById("resultWrap");
const collectBtn = document.getElementById("collectBtn");

// 渲染当前题目
function renderQuestion(){
  resultWrap.style.display = "none";
  selectedAnswer = "";
  if(timer) timer.stop();
  const q = paper[currentIndex];
  qTitle.innerText = `${currentIndex+1}. ${q.title}`;
  optsWrap.innerHTML = "";
  // 渲染选项
  for(let key in q.options){
    const div = document.createElement("label");
    div.className = "opt-item";
    div.innerHTML = `<input type="radio" name="ans" value="${key}"> ${key}. ${q.options[key]}`;
    optsWrap.appendChild(div);
  }
  // 收藏状态切换文字
  collectBtn.innerText = CollectBook.isCollect(q.id) ? "已收藏" : "收藏本题";
  // 启动倒计时
  if(config.openTimer){
    timer = new QuestionTimer(60, (left)=>{
      timerText.innerText = `剩余${left}秒`;
      if(left === 0){
        autoSubmit();
      }
    });
    timer.start();
  }else{
    timerText.innerText = "未开启计时";
  }
}

// 答题超时自动提交
function autoSubmit(){
  const q = paper[currentIndex];
  resultWrap.style.display = "block";
  resultWrap.innerHTML = `<div class="wrong">答题超时，判定错误</div><div class="all-ana">`;
  for(let k in q.analysis){
    resultWrap.innerHTML += `<p>${k}：${q.analysis[k]}</p>`;
  }
  resultWrap.innerHTML += `</div>`;
  WrongBook.add(q);
  submitBtn.disabled = true;
}

// 手动提交答案
submitBtn.onclick = ()=>{
  const radios = document.querySelectorAll("input[name=ans]");
  selectedAnswer = "";
  radios.forEach(r=>{if(r.checked) selectedAnswer = r.value;});
  if(!selectedAnswer){
    alert("请选择一个选项");
    return;
  }
  if(timer) timer.stop();
  submitBtn.disabled = true;
  const q = paper[currentIndex];
  resultWrap.style.display = "block";
  if(selectedAnswer === q.correctAnswer){
    // 答对：只展示考点
    resultWrap.innerHTML = `<div class="right">回答正确！</div><div class="point">考点知识：${q.knowledgePoint}</div>`;
  }else{
    // 答错：展示全部选项解析，加入错题本
    resultWrap.innerHTML = `<div class="wrong">回答错误，正确答案：${q.correctAnswer}</div><div class="all-ana">`;
    for(let k in q.analysis){
      resultWrap.innerHTML += `<p>${k}：${q.analysis[k]}</p>`;
    }
    resultWrap.innerHTML += `</div>`;
    WrongBook.add(q);
  }
};

// 切换下一题
nextBtn.onclick = ()=>{
  submitBtn.disabled = false;
  currentIndex++;
  if(currentIndex >= paper.length){
    alert("本套题目已全部完成，返回首页");
    location.href = "index.html";
    return;
  }
  renderQuestion();
};

// 收藏/取消收藏
collectBtn.onclick = ()=>{
  const q = paper[currentIndex];
  if(CollectBook.isCollect(q.id)){
    CollectBook.remove(q.id);
    collectBtn.innerText = "收藏本题";
  }else{
    CollectBook.add(q);
    collectBtn.innerText = "已收藏";
  }
};

// 页面初始化渲染第一题
renderQuestion();
