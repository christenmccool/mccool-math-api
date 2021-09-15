const correctTxt = document.getElementById('correct-text');
const incorrectTxt = document.getElementById('incorrect-text');
const checkBtn = document.getElementById('check-button');
const message = document.getElementById('message');
const answer = document.getElementById('answer');
const newLineBtn = document.getElementById('new-line-button');

const userEq = document.getElementById('user-eq');
const MQ = MathQuill.getInterface(2);

const calcDiv = document.getElementById('calculator');

let saved_skill_data = JSON.parse(sessionStorage.getItem('eq-graphs'));
let skill_data = {
  "correct" : saved_skill_data ? saved_skill_data["correct"] : 0,
  "incorrect" : saved_skill_data? saved_skill_data["incorrect"] : 0
}
correctTxt.innerText = `Correct: ${skill_data.correct}`;
incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;

const calc = Desmos.GraphingCalculator(calcDiv, {expressions : false, lockViewport : true, settingsMenu: false});

async function setUpProblem() {
  const response = await axios.get('http://localhost:3000/skills/lineareq');
  answer.innerText = response.data.equation;
  MQ.StaticMath(answer);
  problem = new GraphingProblem(calc, response.data.expression);
  problem.graphLine();
  return problem;
}

let problem = setUpProblem();

let enteredMath;
const userEqMathField = MQ.MathField(userEq, {
  handlers: {
    edit: function() {
      enteredMath = userEqMathField.latex(); 
    }
  }
});

function plotPoint(evt) {
  problem.plotPoint(evt);
}
document.addEventListener('click', plotPoint);


checkBtn.addEventListener('click', async () => {
  const checkAnswer = enteredMath === problem.equation;

  if (checkAnswer) {
    skill_data.correct++;
    correctTxt.innerText = `Correct: ${skill_data.correct}`;
    message.innerText = "Correct!";
  } else {
    skill_data.incorrect++;
    incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;
    message.innerText = "Incorrect. The correct equation is:";
  }

  // const response = await axios.post("/equation", {userEquation: enteredMath})

  // if (response.data === true) {
  //     skill_data.correct++;
  //     correctTxt.innerText = `Correct: ${skill_data.correct}`;
  //     message.innerText = "Correct!"
  // } else {
  //     skill_data.incorrect++;
  //     incorrectTxt.innerText = `Incorrect: ${skill_data.incorrect}`;
  //     message.innerText = "Incorrect. The correct equation is:";
  // }

  sessionStorage.setItem('eq-graphs', JSON.stringify(skill_data));
  problem.showPoints();
  answer.classList.remove("d-none");
  checkBtn.classList.add("d-none");
  newLineBtn.classList.remove("d-none");
});


newLineBtn.addEventListener("click", async () => {
  problem = await setUpProblem();
  
  newLineBtn.classList.add('d-none');
  message.innerText = "";
  answer.classList.add("d-none");
  userEqMathField.latex("");
  checkBtn.classList.remove("d-none");
}
)



