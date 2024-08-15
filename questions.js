var questions = [];
var i = 0;
var count = 0;
var score = 0;
var Ansgiven = []; // Store answers given by the user
var previousQuestionIndex = null; // Track the previously displayed question
var topicName = ''; // Variable to store the topic name

const uniqueKey = 123;

// Helper function to save data in local storage under the unique key
function saveToLocalStorage(key, value) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  storageData[key] = value;
  localStorage.setItem(uniqueKey, JSON.stringify(storageData));
}

// Helper function to get data from local storage under the unique key
function getFromLocalStorage(key) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  return storageData[key];
}


// Fetch the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    // Get the selected topic from the URL
    const urlParams = new URLSearchParams(window.location.search);
    topicName = urlParams.get('topic'); // Store topic name for later use

    // Find the questions for the selected topic
    const selectedTopic = data.topics.find(t => t.heading === topicName);

    if (selectedTopic) {
      questions = selectedTopic.questions; // Access the questions array for the selected topic
      count = questions.length;

      // // Store total number of questions in localStorage
      // localStorage.setItem(topicName + '_totalQuestions', count);

      // Store total number of questions in localStorage
      saveToLocalStorage(topicName + '_totalQuestions', count);

      // Load the heading from the selected topic
      document.getElementById('heading').innerText = topicName || 'PS'; // Set default heading if not provided
      loadButtons();
      loadQuestion(i);

      // Store topics in local storage for the results page
      const topics = JSON.parse(localStorage.getItem('topics')) || [];
      if (!topics.find(t => t.heading === topicName)) {
        topics.push(selectedTopic);
        // localStorage.setItem('topics', JSON.stringify(topics));
        saveToLocalStorage('topics', topics);

      }
    } else {
      document.getElementById('heading').innerText = 'Topic not found';
      document.getElementById('buttonContainer').innerHTML = 'No questions available for this topic.';
    }
  });

function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = ""; // Clear previous buttons
  for (var j = 0; j < questions.length; j++) {
    var btn = document.createElement("button");
    btn.className = "btn btn-default smallbtn";
    btn.innerHTML = "Q" + (j + 1);
    btn.setAttribute("onclick", "abc(" + (j + 1) + ")");

    // // Check if the topic has been completed and disable the button if necessary
    // if (localStorage.getItem(topicName + '_completed')) {
    //   btn.classList.add("disabled-btn");
    //   btn.disabled = true;
    // }

       // Check if the topic has been completed and disable the button if necessary
       if (getFromLocalStorage(topicName + '_completed')) {
        btn.classList.add("disabled-btn");
        btn.disabled = true;
      }

    buttonContainer.appendChild(btn);
  }
  // Highlight the button for the current question
  highlightButton(i);
  // Update button styles based on answered questions
  updateButtonStyles();
}

// Load question function
function loadQuestion(index) {
  var randomQuestion = questions[index];

  // Set image source to either the provided image or the default image
  var imageElement = document.getElementById("math_ques");
  imageElement.src = randomQuestion.image || "./assests/images/dummy-img.png";

  document.getElementById("numdiv").innerHTML = randomQuestion.questionNo;
  document.getElementById("question").innerHTML = randomQuestion.question;
  document.getElementById("options").innerHTML = "";

  randomQuestion.options.forEach(function(option, idx) {
    var li = document.createElement("li");
    li.innerHTML = '<input type="radio" name="answer" value="' + idx + '" onchange="handleAnswerChange()"> ' + option;
    document.getElementById("options").appendChild(li);
  });

  // // Load the previously selected answer if available
  // var previouslySelected = Ansgiven[index] !== undefined ? Ansgiven[index] : null;
  // if (previouslySelected !== null) {
  //   document.querySelector('input[name="answer"][value="' + previouslySelected + '"]').checked = true;
  // }
   // Load the previously selected answer if available
   var previouslySelected = Ansgiven[index];
   if (previouslySelected !== null && previouslySelected !== undefined) {
     document.querySelector('input[name="answer"][value="' + questions[index].options[previouslySelected] + '"]').checked = true;
   }

  

  // Remove highlight from the previously displayed question
  if (previousQuestionIndex !== null) {
    document.getElementById("question").classList.remove("highlight");
  }

  // Highlight the current question
  document.getElementById("question").classList.add("highlight");

  // Save the current question index
  previousQuestionIndex = index;

  // Update button visibility based on whether an answer is selected
  updateButtonVisibility();
  // Highlight the button for the current question
  highlightButton(index);
  // Update button styles
  updateButtonStyles();

  // Update the Next button or Submit Answers button
  updateButtonText();

}


function handleAnswerChange() {
  // Show the Submit Answer button and hide the Next button when an answer is selected
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";
}

function newques() {
  // Save the answer for the current question
  saveCurrentAnswer();

  if (i === count - 1) {
    document.getElementById("questiondiv").style.textAlign = "center";
    
    // Display results
    displayResults();    
  
    // Hide buttonContainer
    document.getElementById("buttonContainer").style.display = "none";

// // window.location.href = "./graph.html";

  } else {
    // Move to the next question
    i++;
    loadQuestion(i);
    document.getElementById("result").innerHTML = "";
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
    
    // Update button visibility and styles
    updateButtonVisibility();
    updateButtonStyles();
  }
}


// Save the answer for the current question
function saveCurrentAnswer() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    Ansgiven[i] = parseInt(selectedAnswer.value); // Store answer as an index
  } else {
    Ansgiven[i] = null; // Mark as not answered
  }
  console.log("score", score);
  saveToLocalStorage('Ansgiven', Ansgiven); // Save the updated answers array to local storage

}

function displayResults() {
  window.location.href = "./graph.html";

  score = Ansgiven.reduce((total, answer, index) => {
    return answer === questions[index].answer ? total + 1 : total;
  }, 0);

  // // Save the score and completion status in local storage
  // localStorage.setItem(topicName + '_score', score);
  // localStorage.setItem(topicName + '_completed', 'true'); // Mark topic as completed
 // Save the score and completion status in local storage
 saveToLocalStorage(topicName + '_score', score);
 saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

  // Hide certain elements
  // document.getElementById("math_ques").style.display = "none";
  // document.getElementById("numdiv").style.display = "none";
  // document.getElementById("question").style.display = "none";
  // document.getElementById("nextbtn").style.display = "none";
  // document.getElementById("result").style.display = "none";
  // document.getElementById("options").style.display = "none";
  // document.getElementById("head").innerHTML = "Check Your Answers";

  // Calculate percentage and feedback message
  var percentage = (score / count) * 100;
  var progressBarColor = "";
  var feedbackMessage = "";

  // if (percentage <= 40) {
  //   progressBarColor = "#F28D8D"; /* Dark Pastel Red */
  //   feedbackMessage = "You may need more practice.";
  // } else if (percentage > 40 && percentage <= 70) {
  //   progressBarColor = "#6C8EBF"; /* Dark Pastel Blue */
  //   feedbackMessage = "Well done!";
  // } else if (percentage > 70) {
  //   progressBarColor = "#B5E7A0"; /* Dark Pastel Green */
  //   feedbackMessage = "Excellent job!";
  // }

      //var Dis = "Thank you for participating.<br><br>Score: " + score + "/" + count + "<br><br>";
  var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
  var content = home;
    // localStorage.setItem(topicName + '_results_content', content);
    saveToLocalStorage(topicName + '_results_content', content);

  var questionsPerPage = 8;
  var numberOfPages = Math.ceil(questions.length / questionsPerPage);
  var questionContent = "";
  var paginationControls = "";

  for (var page = 0; page < numberOfPages; page++) {
    var start = page * questionsPerPage;
    var end = Math.min(start + questionsPerPage, questions.length);
    var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

    for (var j = start; j < end; j++) {
      var quesgroup = questions[j];
      var ques = quesgroup.question;
      var ans = quesgroup.options[quesgroup.answer];
      var given = Ansgiven[j] !== undefined ? (Ansgiven[j] !== null ? quesgroup.options[Ansgiven[j]] : "Not Answered") : "Not Answered";

      // var given = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : "Not Answered";
      var num = j + 1;
      pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ans + "<br>" + "Answer Given: " + given + "<br><br>";
    }

    pageDiv += "</div>";
    questionContent += pageDiv;
  }

  paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
  for (var page = 0; page < numberOfPages; page++) {
    paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
  }
  paginationControls += "</div>";

  // localStorage.setItem(topicName + '_question_content', questionContent);
  saveToLocalStorage(topicName + '_question_content', questionContent);

  document.getElementById("picdiv").innerHTML = "";
  document.getElementById("picdiv").style.display = "none";
  document.getElementById("questiondiv").style.display = "none";
  document.getElementById("nextbtn").style.textAlign = "center";

  // document.getElementById("questiondiv").innerHTML = home ;


  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });

  var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
  sound.play();

  
}

function showPage(page) {
  var pages = document.querySelectorAll('.question-page');
  pages.forEach((p, index) => {
    p.style.display = index === page ? 'block' : 'none';
  });
}

function checkAnswer() {
  saveCurrentAnswer();
  document.getElementById("subbtn").style.display = "none";
  document.getElementById("nextbtn").style.display = "inline-block";
}

function abc(x) {
  // Save the current answer before changing questions
  saveCurrentAnswer();
  i = x - 1;
  loadQuestion(i);
  document.getElementById("result").innerHTML = "";
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";

  // Update button styles and visibility
  highlightButton(i);
  updateButtonStyles();
}

function updateButtonVisibility() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
  } else {
    document.getElementById("subbtn").style.display = "none";
    document.getElementById("nextbtn").style.display = "none";
  }
}

function highlightButton(index) {
  var buttonContainer = document.getElementById("buttonContainer");
  var buttons = buttonContainer.getElementsByTagName("button");

  // Remove highlight from all buttons
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("highlighted-btn");
  }

  // Add highlight to the current button
  if (index >= 0 && index < buttons.length) {
    buttons[index].classList.add("highlighted-btn");
  }
}

function updateButtonStyles() {
  var buttonContainer = document.getElementById("buttonContainer");
  
  if (buttonContainer) {
    var buttons = buttonContainer.getElementsByTagName("button");

    // Remove "answered-btn" class from all buttons
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("answered-btn");
    }

    // Add "answered-btn" class to the button for the answered questions
    Ansgiven.forEach((answer, index) => {
      if (answer !== null && index >= 0 && index < buttons.length) {
        buttons[index].classList.add("answered-btn");
      }
    });
  } else {
    console.error("Button container not found");
  }
}


function updateButtonText() {
  var nextButton = document.getElementById("nextbtn");
  if (i === count - 1) {
    nextButton.innerHTML = "FINISH TEST";
    nextButton.onclick = function() {
      newques(); // Calls newques which will hide buttonContainer
    };

  } else {
    nextButton.innerHTML = "Next";
   
  }
}


