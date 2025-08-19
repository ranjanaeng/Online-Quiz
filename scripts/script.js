 /*    'use strict';
    (function () {
      var y = document.getElementById('year');
      if (y) { y.textContent = new Date().getFullYear(); }
    }()); */

    'use strict';
    (function () {
      var y = document.getElementById('year');
      if (y) { y.textContent = new Date().getFullYear(); }
      
      // Render results from localStorage - only if we're on the results page
      var summary = document.getElementById('summary');
      var list = document.getElementById('breakdown-list');
      
      // Only run results code if we're on a page that has these elements
      if (!summary || !list) {
        return; // Not on results page, exit early
      }
      
      var dataRaw = localStorage.getItem('quizResults');

      if (!dataRaw) {
        summary.textContent = 'No results found. Please take the quiz first.';
        list.innerHTML = '';
        return;
      }

      var data;
      try {
        data = JSON.parse(dataRaw);
      } catch (e) {
        summary.textContent = 'Could not parse results.';
        return;
      }

      var percent = Math.round((data.score / data.total) * 100);
      summary.innerHTML = '<p><strong>Score:</strong> ' + data.score + ' / ' + data.total + ' (' + percent + '%)</p>';

      // Helper function to escape HTML
      function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      list.innerHTML = '';
      for (var i = 0; i < data.detail.length; i++) {
        var item = data.detail[i];
        var li = document.createElement('li');
        var correctness = item.correct ? 'Correct' : 'Incorrect';
        var userAnswerDisplay = item.userAnswer === '' ? '<em>Blank</em>' : escapeHtml(item.userAnswer);
        var correctAnswerDisplay = escapeHtml(item.correctAnswer);
        
        li.innerHTML =
          '<h3 class="q-text">' + escapeHtml((i + 1) + '. ' + item.question) + '</h3>' +
          '<p><strong>Your answer:</strong> ' + userAnswerDisplay + '</p>' +
          '<p><strong>Correct answer:</strong> ' + correctAnswerDisplay + ' — <span class="tag ' + (item.correct ? 'ok' : 'bad') + '">' + correctness + '</span></p>' +
          (item.explanation ? '<p class="explain"><strong>Why:</strong> ' + escapeHtml(item.explanation) + '</p>' : '');
        list.appendChild(li);
      }
    }());
 
