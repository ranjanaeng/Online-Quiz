// quiz.js
// Handles quiz logic, user navigation, scoring


/* global document, window, localStorage, QUIZ_QUESTIONS */

(function () {
  'use strict';
  
  // Load questions from global variable set in questions.js
  var allQuestions = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS.slice() : [];
  if (!allQuestions.length) {
    // if questions failed to load, show message.
    var qText = document.getElementById('question-text');
    if (qText) { qText.textContent = 'No questions available. Please try again later.'; }
    var nextBtn = document.getElementById('next-btn');
    if (nextBtn) { nextBtn.disabled = true; }
    return;
  }

  // Shuffle question array
  // Using Fisher-Yates (Knuth) Shuffle
 function shuffle(arr) {
    var shuffledArray = arr.slice();
    for (var currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1));
      var tmp = shuffledArray[currentIndex];
      shuffledArray[currentIndex] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = tmp;
    }
    return shuffledArray;
  }

  // Randomize question order once per session
  var questions = shuffle(allQuestions);
  var currentIndex = 0;
  var QUIZ_LENGTH = 10; // Number of questions to show in quiz

  // Store user answers and correctness details for results page
  var answers = []; // {question, correctAnswer, userAnswer, correct, explanation}

  // Elements
  var progressTextEl = document.getElementById('progress-text');
  var questionTextEl = document.getElementById('question-text');
  var optionsContainer = document.getElementById('options-container');
  var nextBtnEl = document.getElementById('next-btn');
  var submitBtnEl = document.getElementById('submit-btn');
  var liveFeedbackEl = document.getElementById('live-feedback');
  var formEl = document.getElementById('answer-form');

  // Initialize first render
  renderQuestion();

  // Next and Submit handlers
  nextBtnEl.addEventListener('click', function () {
    recordAnswer();
    currentIndex += 1;
    renderQuestion();
  });

  submitBtnEl.addEventListener('click', function () {
    recordAnswer();
    finishQuiz();
  });

  // Enable keyboard submit on Enter for text questions
  formEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var isText = getCurrent().type === 'text';
      if (isText) {
        e.preventDefault();
        if (!nextBtnEl.hidden) {
          recordAnswer();
          currentIndex += 1;
          renderQuestion();
          announce('Answer captured. Moved to next question.');
        } else {
          recordAnswer();
          finishQuiz();
        }
      }
    }
  });

  function getCurrent() {
    return questions[currentIndex];
  }

  function renderQuestion() {
    var total = QUIZ_LENGTH;
    
    // Check if we've reached the quiz length limit
    if (currentIndex >= QUIZ_LENGTH) {
      finishQuiz();
      return;
    }

    var currentQuestion = getCurrent();

    if (!currentQuestion) {
      // No more questions in the pool
      finishQuiz();
      return;
    }

    // Progress
    progressTextEl.textContent = 'Question ' + (currentIndex + 1) + ' of ' + total;

    // Question text
    questionTextEl.textContent = currentQuestion.question;

    // Reset controls
    optionsContainer.innerHTML = '';
    nextBtnEl.disabled = false;
    submitBtnEl.disabled = true;

    // Show correct controls
    var isLast = currentIndex === total - 1;
    nextBtnEl.hidden = isLast;
    submitBtnEl.hidden = !isLast;
    
    // Keep Next button disabled on last question
    if (isLast) {
      nextBtnEl.disabled = true;
      submitBtnEl.disabled = false;
    }

    // Render input based on type
    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'boolean') {
      renderOptions(shuffle(currentQuestion.options || []));
    } else if (currentQuestion.type === 'text') {
      renderTextInput();
    } else {
      // Fallback: treat as text
      renderTextInput();
    }
  }

  function renderOptions(options) {
    var groupName = 'q' + currentIndex;
    var isLast = currentIndex === QUIZ_LENGTH - 1;

   function handleOptionChange() {
      if (!isLast) {
        nextBtnEl.disabled = false;
      } else {
        submitBtnEl.disabled = false;
      }
    }

    for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
      var id = groupName + '-opt-' + optionIndex;
      var wrapper = document.createElement('label');
      wrapper.className = 'option';
      wrapper.setAttribute('for', id);

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = groupName;
      input.id = id;
      input.value = options[optionIndex];
      input.required = true;

      input.addEventListener('change', handleOptionChange);

      var text = document.createElement('span');
      text.textContent = options[optionIndex];

      wrapper.appendChild(input);
      wrapper.appendChild(text);
      optionsContainer.appendChild(wrapper);
    }
  }

  function renderTextInput() {
    var isLast = currentIndex === QUIZ_LENGTH - 1;
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'text-answer';
    input.className = 'text-answer';
    input.setAttribute('aria-label', 'Type your answer');
    input.autocomplete = 'off';
    input.addEventListener('input', function () {
      if (!isLast) {
          nextBtnEl.disabled = false;
        }
    });
    optionsContainer.appendChild(input);
    // Ensure buttons are enabled appropriately
    if (!isLast) {
          nextBtnEl.disabled = false;
        }
  }

  function recordAnswer() {
    var currentQuestion = getCurrent();
    if (!currentQuestion) { return; }

    var userAnswer = '';

    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'boolean') {
      var selected = optionsContainer.querySelector('input[type="radio"]:checked');
      userAnswer = selected ? selected.value : '';
    } else {
      var input = optionsContainer.querySelector('#text-answer');
      userAnswer = input ? input.value.trim() : '';
    }

    var correctAnswer = currentQuestion.answer;
    var correct;

    if (currentQuestion.type === 'text') {
      correct = userAnswer.toLowerCase() === String(correctAnswer).toLowerCase();
    } else {
      correct = userAnswer === correctAnswer;
    }

    answers.push({
      question: currentQuestion.question,
      correctAnswer: String(correctAnswer),
      userAnswer: String(userAnswer),
      correct: correct,
      explanation: currentQuestion.explanation || ''
    });
  }

  function finishQuiz() {
    // Calculate score
    var score = 0;
    for (var currentIndex = 0; currentIndex < answers.length; currentIndex++) {
      if (answers[currentIndex].correct) { score += 1; }
    }

    var result = {
      score: score,
      total: QUIZ_LENGTH, 
      detail: answers
    };

    try {
      localStorage.setItem('quizResults', JSON.stringify(result));
    } catch (e) { /* ignore quota errors */ }

    window.location.href = 'results.html';
  }

  function announce(msg) {
    if (liveFeedbackEl) {
      liveFeedbackEl.textContent = msg;
    }
  }
}());
