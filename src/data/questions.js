export const htmlQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Transfer Markup Language",
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Markup Language"
    ],
    answer: 1
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<link>", "<href>", "<a>", "<url>"],
    answer: 2
  },
  {
    question: "Which HTML tag is used to insert an image?",
    options: ["<picture>", "<image>", "<img>", "<src>"],
    answer: 2
  },
  {
    question: "Which tag is used for the largest heading?",
    options: ["<h6>", "<h4>", "<head>", "<h1>"],
    answer: 3
  },
  {
    question: "Which attribute is used to provide alternate text for an image?",
    options: ["title", "alt", "src", "href"],
    answer: 1
  },
  {
    question: "Which tag is used to create a table row?",
    options: ["<td>", "<th>", "<tr>", "<table>"],
    answer: 2
  },
  {
    question: "Which HTML element is used to create a checkbox?",
    options: ["<check>", '<input type="checkbox">', "<checkbox>", "<option>"],
    answer: 1
  },
  {
    question: "Which tag is used to create an ordered list?",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    answer: 1
  },
  {
    question: "Which tag is used to define a line break?",
    options: ["<break>", "<br>", "<lb>", "<hr>"],
    answer: 1
  },
  {
    question: "Which HTML tag is used to define a form?",
    options: ["<input>", "<textbox>", "<form>", "<fieldset>"],
    answer: 2
  }
]

export const cssQuestions = [
  {
    question: "What does CSS stand for?",
    options: [
      "Colorful Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets"
    ],
    answer: 2
  },
  {
    question: "Which property is used to change text color in CSS?",
    options: ["text-color", "font-color", "color", "foreground-color"],
    answer: 2
  },
  {
    question: "Which CSS property controls the size of text?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    answer: 2
  },
  {
    question: "Which symbol is used for class selector in CSS?",
    options: ["#", ".", "*", "$"],
    answer: 1
  },
  {
    question: "Which symbol is used for id selector in CSS?",
    options: [".", "*", "#", "@"],
    answer: 2
  },
  {
    question: "Which property is used to set background color?",
    options: ["color", "bgcolor", "background-color", "background"],
    answer: 2
  },
  {
    question: "Which CSS property is used to create space outside the border?",
    options: ["padding", "margin", "border", "spacing"],
    answer: 1
  },
  {
    question: "Which property is used to make text bold?",
    options: ["font-style", "font-weight", "text-decoration", "text-align"],
    answer: 1
  },
  {
    question: "Which CSS property controls element positioning?",
    options: ["float", "display", "position", "align"],
    answer: 2
  },
  {
    question: "Which value of display hides an element completely?",
    options: ["hidden", "none", "block", "inline"],
    answer: 1
  }
]

export const jsQuestions = [
  {
    question: "Which of the following is a correct way to declare a variable in JavaScript?",
    options: ["int x = 10;", "var x = 10;", "x := 10;", "declare x = 10;"],
    answer: 1
  },
  {
    question: "What will typeof null return?",
    options: ["null", "object", "undefined", "number"],
    answer: 1
  },
  {
    question: "Which operator is used for strict equality?",
    options: ["==", "=", "===", "!="],
    answer: 2
  },
  {
    question: 'What will be the output of: console.log(2 + "2");',
    options: ["4", "22", "NaN", "Error"],
    answer: 1
  },
  {
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.object()"],
    answer: 1
  },
  {
    question: "What will be the output of: let x; console.log(x);",
    options: ["null", "0", "undefined", "Error"],
    answer: 2
  },
  {
    question: "Which function is used to run code after a delay?",
    options: ["delay()", "wait()", "setTimeout()", "setInterval()"],
    answer: 2
  },
  {
    question: "Which keyword is used to declare a constant variable?",
    options: ["var", "let", "const", "static"],
    answer: 2
  },
  {
    question: "What will be the output of: console.log([] == []);",
    options: ["true", "false", "undefined", "Error"],
    answer: 1
  },
  {
    question: "Which loop is guaranteed to execute at least once?",
    options: ["for", "while", "do...while", "foreach"],
    answer: 2
  }
]

export const getQuestionsByCategory = (category) => {
  switch (category) {
    case 'html':
      return htmlQuestions
    case 'css':
      return cssQuestions
    case 'js':
      return jsQuestions
    default:
      return htmlQuestions
  }
}
