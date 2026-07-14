// 渲染混合模式每科输入框
const mixWrap = document.querySelector("#mixInputs");
for(let key in SUBJECT_MAP){
  const div = document.createElement("div");
  div.innerHTML = `${SUBJECT_MAP[key]}：<input type="number" class="mix-num" data-sub="${key}" value="2" min="0">`;
  mixWrap.appendChild(div);
}

// 切换单科/混合模式显示
const modeRadios = document.querySelectorAll("input[name=mode]");
const singleBox = document.querySelector(".single-subject");
const mixBox = document.querySelector(".mix-setting");
modeRadios.forEach(radio=>{
  radio.onchange = ()=>{
    if(radio.value === "single"){
      singleBox.style.display = "block";
      mixBox.style.display = "none";
    }else{
      singleBox.style.display = "none";
      mixBox.style.display = "block";
    }
  }
});

// 开始刷题按钮逻辑
document.getElementById("startExamBtn").onclick = async ()=>{
  const mode = document.querySelector("input[name=mode]:checked").value;
  const totalNum = Number(document.getElementById("totalNum").value);
  const isOrder = document.getElementById("isOrder").checked;
  const openTimer = document.getElementById("openTimer").checked;
  let targetList = [];

  if(mode === "single"){
    const subKey = document.getElementById("subjectSelect").value;
    let list = await loadSubjectQuestions(subKey);
    if(!isOrder) list = shuffleArr(list);
    targetList = list.slice(0, totalNum);
  }else{
    // 混合模式抽取各科题目
    const mixInputs = document.querySelectorAll(".mix-num");
    for(let input of mixInputs){
      const subKey = input.dataset.sub;
      const takeNum = Number(input.value);
      if(takeNum <= 0) continue;
      let subList = await loadSubjectQuestions(subKey);
      subList = shuffleArr(subList).slice(0, takeNum);
      targetList = targetList.concat(subList);
    }
    if(!isOrder) targetList = shuffleArr(targetList);
    targetList = targetList.slice(0, totalNum);
  }

  // 把当前试卷存入本地存储，跳转刷题页面
  Storage.set("currentExamPaper", targetList);
  Storage.set("examConfig", {openTimer});
  location.href = "exam.html";
};
