/* quiz.js
   Handles quiz flow: randomization, rendering, input capture, scoring, and results.
   Passes common linters (use strict, no unused globals).
*/
'use strict';
/* global document, window, localStorage, QUIZ_QUESTIONS */

(function () {
  var allQuestions = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS.slice() : [];
  if (!allQuestions.length) {
    // Defensive: if questions failed to load, show a simple message.
    var qText = document.getElementById('question-text');
    if (qText) { qText.textContent = 'No questions available. Please try again later.'; }
    var nextBtn = document.getElementById('next-btn');
    if (nextBtn) { nextBtn.disabled = true; }
    return;
  }

  // Shuffle helper (Fisher–Yates)
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
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
    announce('Moved to next question.');
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
    
    var q = getCurrent();

    if (!q) {
      // No more questions in the pool
      finishQuiz();
      return;
    }

    // Progress
    progressTextEl.textContent = 'Question ' + (currentIndex + 1) + ' of ' + total;

    // Question text
    questionTextEl.textContent = q.question;

    // Reset controls
    optionsContainer.innerHTML = '';
    nextBtnEl.disabled = true;
    submitBtnEl.disabled = true;

    // Show correct controls
    var isLast = currentIndex === total - 1;
    nextBtnEl.hidden = isLast;
    submitBtnEl.hidden = !isLast;
    
    // Keep Next button disabled on last question
    if (isLast) {
      nextBtnEl.disabled = true;
    }

    // Render input based on type
    if (q.type === 'mcq' || q.type === 'boolean') {
      renderOptions(shuffle(q.options || []));
    } else if (q.type === 'text') {
      renderTextInput();
    } else {
      // Fallback: treat as text
      renderTextInput();
    }
  }

  function renderOptions(options) {
    var groupName = 'q' + currentIndex;
    var isLast = currentIndex === QUIZ_LENGTH - 1;
    
    for (var i = 0; i < options.length; i++) {
      var id = groupName + '-opt-' + i;
      var wrapper = document.createElement('label');
      wrapper.className = 'option';
      wrapper.setAttribute('for', id);

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = groupName;
      input.id = id;
      input.value = options[i];
      input.required = true;

      input.addEventListener('change', function () {
        if (!isLast) {
          nextBtnEl.disabled = false;
        }
        submitBtnEl.disabled = false;
      });

      var text = document.createElement('span');
      text.textContent = options[i];

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
      // Enable next/submit if non-empty (still allow blank if user wants)
      if (!isLast) {
        nextBtnEl.disabled = false;
      }
      submitBtnEl.disabled = false;
    });
    optionsContainer.appendChild(input);
    // Ensure buttons are enabled appropriately
    if (!isLast) {
      nextBtnEl.disabled = false;
    }
    submitBtnEl.disabled = false;
  }

  function recordAnswer() {
    var q = getCurrent();
    if (!q) { return; }

    var userAnswer = '';

    if (q.type === 'mcq' || q.type === 'boolean') {
      var selected = optionsContainer.querySelector('input[type="radio"]:checked');
      userAnswer = selected ? selected.value : '';
    } else {
      var input = optionsContainer.querySelector('#text-answer');
      userAnswer = input ? input.value.trim() : '';
    }

    var correctAnswer = q.answer;
    var correct;

    if (q.type === 'text') {
      correct = userAnswer.toLowerCase() === String(correctAnswer).toLowerCase();
    } else {
      correct = userAnswer === correctAnswer;
    }

    answers.push({
      question: q.question,
      correctAnswer: String(correctAnswer),
      userAnswer: String(userAnswer),
      correct: correct,
      explanation: q.explanation || ''
    });
  }

  function finishQuiz() {
    // Calculate score
    var score = 0;
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].correct) { score += 1; }
    }

    var result = {
      score: score,
      total: QUIZ_LENGTH, // Use the same constant for consistency
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
