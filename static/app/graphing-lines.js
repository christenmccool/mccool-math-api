const correctTxt = document.getElementById('correct-text');
const incorrectTxt = document.getElementById('incorrect-text');
const drawLineBtn = document.getElementById('draw-line');
const checkBtn = document.getElementById('check-button');
const message = document.getElementById('message');
const newLineBtn = document.getElementById('new-line-button');

const linearEq = document.getElementById('linear-eq');
const MQ = MathQuill.getInterface(2);

const calcDiv = document.getElementById('calculator');

let saved_skill_data = JSON.parse(sessionStorage.getItem('graphing-lines'));
let skill_data = {
  "correct" : saved_skill_data ? saved_skill_data["correct"] : 0,
  "incorrect" : saved_skill_data? saved_skill_data["incorrect"] : 0
}
correctTxt.innerText = `Correct: ${skill_data.correct}`;
incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;

const calc = Desmos.GraphingCalculator(calcDiv, {expressions : false, lockViewport : true, settingsMenu: false});

async function setUpProblem() {
  const response = await axios.get('http://localhost:3000/skills/lineareq');
  linearEq.innerText = response.data.equation;
  MQ.StaticMath(linearEq);

  problem = new GraphingProblem(calc, response.data.expression);
  return problem;
}

let problem = setUpProblem();

function plotPoint(evt) {
  problem.plotPoint(evt);
}
document.addEventListener('click', plotPoint);

drawLineBtn.addEventListener('click', () => {
  let response = problem.graphUserLine();
  if (response == "lineDrawn") {
    message.innerText = "";
    drawLineBtn.classList.add('d-none');
    checkBtn.classList.remove('d-none');
    document.removeEventListener('click', plotPoint);
  } else if (response == "fixLine"){
    message.innerText = "Your points don't form a straight line. Please adjust.";
  } else if (response == "needMorePoints"){
    message.innerText = "Please plot more points before drawing the line.";
  }
});

checkBtn.addEventListener("click", async () => {
  const userLine = problem.getUserLine();

  const checkAnswer = userLine === problem.equation;

  if (checkAnswer) {
    skill_data.correct++;
    correctTxt.innerText = `Correct: ${skill_data.correct}`;
    message.innerText = "Your line is correct! Please check for any additional points.";
  } else {
    problem.graphLine();
    skill_data.incorrect++;
    incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;
    message.innerText = "Your line is not correct. Please compare to the correct line.";
  }    

  // const response = await axios.post("/equation", {userEquation: userLine})

  // if (response.data === true) {
  //     skill_data.correct++;
  //     correctTxt.innerText = `Correct: ${skill_data.correct}`;
  //     message.innerText = "Your line is correct! Please check for any additional points.";
  // } else {
  //     problem.graphLine();
  //     skill_data.incorrect++;
  //     incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;
  //     message.innerText = "Your line is not correct. Please compare to the correct line.";
  // }    

  problem.showPoints();
  sessionStorage.setItem('graphing-lines', JSON.stringify(skill_data));

  checkBtn.classList.add('d-none');
  newLineBtn.classList.remove('d-none');
});


newLineBtn.addEventListener("click", async () => {
  problem = await setUpProblem();

  newLineBtn.classList.add('d-none');
  message.innerText = "";
  drawLineBtn.classList.remove('d-none');
  document.addEventListener('click', plotPoint);
}
)


