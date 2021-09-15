class GraphingProblem {
  constructor(calc, expression) {
    this.calculator = calc;
    this.calcDiv = calcDiv;
    this.expression = expression;
    this.equation = "y=" + expression;

    this.setupCalc();

    this.userTable = this.calculator.getExpressions().find(obj => obj['id'] === 'userTable');
    this.xArray = this.userTable.columns[0].values;
    this.yArray = this.userTable.columns[1].values;

    this.solutionTable = this.calculator.getExpressions().find(obj => obj['id'] == 'solutionTable');
  }
  
  setupCalc() {
    this.calculator.setBlank();
    
    let expWithCond = this.expression.replace('x', 'x_2')
    expWithCond += `\\{\\mod(${expWithCond},1)=0\\}`

    this.calculator.setExpression({
      id: 'solutionTable',
      type: 'table',
      columns: [
        {
          latex: 'x_2',
          values: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          pointSize: 15,
        },
        {
          latex: expWithCond,
          values: [],
          pointSize: 15,
          color: Desmos.Colors.ORANGE,
          hidden: true,
        }
      ]
    });
      
    this.calculator.setExpression({
      id: 'userTable',
      type: 'table',
      hidden: false,
      columns: [
        {
          latex: 'x_1',
          values: [],
          pointSize: 15,
        },
        {
          latex: 'y_1',
          values: [],
          pointSize: 15,
          color: Desmos.Colors.BLUE
        },
      ]
    });

  }

  showPoints() {
    this.solutionTable.columns[1].hidden = false;
    this.solutionTable.columns[1].color = Desmos.Colors.PURPLE;
    this.calculator.setExpression(this.solutionTable);
  }
  
  graphLine() {
    this.calculator.setExpression({id: 'line', latex: this.equation, color: Desmos.Colors.PURPLE});
  }

  plotPoint(evt) {
    const calculatorRect = this.calculator.domChangeDetector.elt.getBoundingClientRect();

    const pixel_x = evt.clientX - calculatorRect.left;
    const pixel_y = evt.clientY - calculatorRect.top;

    if (pixel_x >= 0 && pixel_x <= calculatorRect.width && pixel_y >= 0 && pixel_y <= calculatorRect.height) {
      const point = this.calculator.pixelsToMath({x : pixel_x, y: pixel_y});

      point.x = Math.round(point.x);
      point.y = Math.round(point.y);

      let newPoint = true

      for (let i = 0; i < this.xArray.length; i++) {
        if (this.xArray[i] == point.x && this.yArray[i] == point.y) {
          this.xArray.splice(i, 1);
          this.yArray.splice(i, 1);
          newPoint = false;
        } 
      }

      if (newPoint == true) {
        this.xArray.push(point.x);
        this.yArray.push(point.y);
      }

      this.calculator.setExpression(this.userTable);
  }
  }

  getUserPoints() {
    const points = [];
    for (let i = 0; i < this.xArray.length; i++) {
      points.push([this.xArray[i], this.yArray[i]])
    }
    return points;
  }

  getUserLine() {
    if (this.xArray.length > 1) {
      let slopesEq = true;
      const userM = (this.yArray[1] - this.yArray[0]) / (this.xArray[1] - this.xArray[0]);

      for (let i = 2; i < this.xArray.length; i++) {
        let slope = (this.yArray[i] - this.yArray[0]) / (this.xArray[i] - this.xArray[0]);
        if (slope !== userM) {
          slopesEq = false;
          break;
        }
      }

      if (slopesEq) {
        const userRise = this.yArray[1] - this.yArray[0];
        const userRun = this.xArray[1] - this.xArray[0];
        const userB = this.yArray[0] - userM * this.xArray[0];
        return getLatexEq(userRise, userRun, userB);
      } else {
        return "noLine";
      }
    }
  }

  graphUserLine() {
    if (this.xArray.length <= 2) {
      return "needMorePoints"
    }

    if (this.xArray.length > 2) {
      let slopesEq = true;
      const userM = (this.yArray[1] - this.yArray[0]) / (this.xArray[1] - this.xArray[0]);

      for (let i = 2; i < this.xArray.length; i++) {
        let newM = (this.yArray[i] - this.yArray[0]) / (this.xArray[i] - this.xArray[0]);
        if (newM !== userM) {
          slopesEq = false;
          break;
        }
      }

      if (slopesEq) {
        const userB = this.yArray[0] - userM * this.xArray[0];

        this.calculator.setExpression({id: 'userLine', latex: `y = ${userM}x+${userB}`, color: Desmos.Colors.BLUE});
        return "lineDrawn";
      } else {
        return "fixLine";
      }
    }
  }

}


function getGCF(num, den) {
  let gcf = 1;
  if (num == den) {
    return num;
  }
  for (i = 2; i <= Math.max(num, den) / 2; i++) {
    if (num % i == 0 && den % i == 0) {
      gcf = i;
    }
  }
  return gcf;
}

function getLatexEq(rise, run, b) {
  let eq = "";
  let variable = "x";
  let b_str;
  let m_str;

  if (b == 0) {
    b_str = "";
  } else if (b < 0) {
    b_str = b;
  } else if (b > 0) {
    b_str = `+${b}`;
  } 

  if (rise == 0) {
    m_str = "";
    variable = "";
    if (b >= 0) {
      b_str = b;
    }
  } else {
    let simp_rise = rise;
    let simp_run = run;

    if (rise < 0 && run < 0) {
      simp_rise = Math.abs(rise);
      simp_run = Math.abs(run);
    } else if (run < 0) {
      simp_rise = -1 * rise;
      simp_run = Math.abs(run);
    }

    let pos_rise = Math.abs(simp_rise);

    const gcf = getGCF(pos_rise, simp_run);
    simp_rise = simp_rise / gcf;
    simp_run = simp_run / gcf;
    
    // Whole number slope
    if (simp_run == 1) {
      m_str = simp_rise;
      if (simp_rise == 1) {
        m_str = "";
      } else if (simp_rise == -1) {
        m_str = "-";
      } 
    // Fraction slope
    } else {
      if (simp_rise < 0) {
        m_str = `-\\frac{${Math.abs(simp_rise)}}{${simp_run}}`;
      } else {
        m_str = `\\frac{${simp_rise}}{${simp_run}}`
      }
    }
  }
  return "y=" + m_str + variable + b_str;
}
