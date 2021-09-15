"use strict";

/** Linear Equation in McCool Math app */

/** Linear Equation class. */

class LinearEquation {
  constructor(percFracM, maxM, maxB) {
    const slope = getSlope(percFracM, maxM);
    this.m = slope.m;
    this.rise = slope.rise;
    this.run = slope.run;

    this.b = getStart(maxB);

    this.exp = getLatexExpression(this.m, this.rise, this.run, this.b);

    this.eq = `y=${this.exp}`;
  }
}

/** Determines if a numerator and denominator create a simplified fraction.
 * 
 * A simplified fraction means the numerator and denominator do share a common factor.
 */

function isSimplifiedFraction(num, den) {
  if (den === 1 || num === 0) {
    return false;
  }
  if (num === 1) {
    return true;
  }
  if (num === den || num % den === 0 || den % num === 0) {
    return false;
  }
  for (let i=2; i < Math.max(num, den); i++) {
    if (num % i === 0 && den % i === 0) {
      return false;
    }
  }
  return true;
}

/** Get a random slope.
 * 
 * percFracM : percentage probability that the slope is a fraction (not a whole number)
 * maxM: largest slope (or rise or run)
 */

function getSlope(percFracM, maxM) {
  const randNum = Math.floor(Math.random() * 100);

  let rise = 1;
  let run = 1;
  let m;

  // Fractional slope
  if (randNum < percFracM) {

    while (!isSimplifiedFraction(rise, run)) {
      rise = Math.floor(Math.random() * maxM) + 1; 
      run = Math.floor(Math.random() * maxM) + 1; 
    }

    if (Math.random() < 0.5) {
      rise = rise * -1;
    }

    m = rise / run;
  }
  // Whole number slope
  else {
    m = Math.floor(Math.random() * (maxM + 1)); 

    if (Math.random() < 0.5 && m !== 0) {
      m = m * -1;
    }
    rise = m;
    run = 1;
  }

  return {m, rise, run};
}
  
/** Get a random start value.
 * 
 * maxB: largest start value
 */

function getStart(maxB) {
  let b =  Math.floor(Math.random() * (maxB + 1)); 

  if (Math.random() < 0.5 && b !== 0) {
    b = b * -1;
  }
  return b;
}

/** Get the Latex Expression given m, rise, run, and b  */
function getLatexExpression(m, rise, run, b) {
  let eq = "";
  let variable = "x";

  let b_str, m_str;

  if (b === 0) {
    b_str = "";
  } else if (b < 0) {
    b_str = `${b}`;
  } else if (b > 0) {
    b_str = `+${b}`;
  }

  if (run === 1) {
    m_str = `${m}`;

    if (m === 0) {
      m_str = "";
      variable = "";

      if (b >= 0) {
        b_str = `${b}`;
      }
    } else if (m === 1) {
      m_str = "";
    } else if (m === -1) {
      m_str = "-";
    }
  } else {
    m_str = `\\frac{${Math.abs(rise)}}{${run}}`
    if (rise < 0) {
      m_str = `-${m_str}`;
    }
  }
  return `${m_str}${variable}${b_str}`;
}

module.exports = LinearEquation;
