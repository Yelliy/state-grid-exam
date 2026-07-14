document.getElementById("saveBtn").onclick = ()=>{
  const sub = document.getElementById("subSelect").value;
  const title = document.getElementById("titleInput").value.trim();
  const A = document.getElementById("optA").value.trim();
  const B = document.getElementById("optB").value.trim();
  const C = document.getElementById("optC").value.trim();
  const D = document.getElementById("optD").value.trim();
  const correct = document.getElementById("correctInput").value.trim().toUpperCase();
  const point = document.getElementById("pointInput").value.trim();
  const anaA = document.getElementById("anaA").value.trim();
  const anaB = document.getElementById("anaB").value.trim();
  const anaC = document.getElementById("anaC").value.trim();
  const anaD = document.getElementById("anaD").value.trim();

  if(!title || !A || !B || !C || !D || !["A","B","C","D"].includes(correct)){
    alert("必填项不能为空，正确答案只能填A/B/C/D");
    return;
  }

  const tempQ = {
    "id": Date.now(),
    "subject": sub,
    "title": title,
    "options": {
      "A": A,
      "B": B,
      "C": C,
      "D": D
    },
    "correctAnswer": correct,
    "knowledgePoint": point,
    "analysis": {
      "A": anaA,
      "B": anaB,
      "C": anaC,
      "D": anaD
    }
  };
  document.getElementById("jsonResult").value = JSON.stringify(tempQ, null, 2);
};
