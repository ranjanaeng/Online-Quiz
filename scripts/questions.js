/* questions.js
   Question bank with multiple types:
   - type: "mcq" | "boolean" | "text"
   - question: string
   - options: array (for mcq/boolean)
   - answer: string (text answers compared case-insensitively)
   - explanation: string
*/

/* global window */
(function (win) {
  'use strict';
  var questions = [
    {
      type: 'mcq',
      question: 'Which HTML element is used to define important text?',
      options: ['<strong>', '<em>', '<mark>', '<small>'],
      answer: '<strong>',
      explanation: '<strong> indicates strong importance, typically rendered in bold.'
    },
    {
      type: 'mcq',
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
      answer: 'Mars',
      explanation: 'Mars appears reddish due to iron oxide (rust) on its surface.'
    },
    {
      type: 'mcq',
      question: 'The capital of France is:',
      options: ['Paris', 'Berlin', 'Madrid', 'Lisbon'],
      answer: 'Paris',
      explanation: 'Paris is the capital and most populous city of France.'
    },
    {
      type: 'boolean',
      question: 'The boiling point of water at sea level is 100°C.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: 'At standard atmospheric pressure (1 atm), water boils at 100°C.'
    },
    {
      type: 'boolean',
      question: 'Light travels slower than sound in air.',
      options: ['True', 'False'],
      answer: 'False',
      explanation: 'Light travels much faster (~300,000 km/s) than sound (~0.34 km/s) in air.'
    },
    {
      type: 'text',
      question: 'Fill in the blank: CSS stands for Cascading ______ Sheets.',
      answer: 'Style',
      explanation: 'CSS = Cascading Style Sheets.'
    },
    {
      type: 'text',
      question: 'Fill in the blank: In JavaScript, arrays are zero-_____.',
      answer: 'indexed',
      explanation: 'Array indexes start at 0 (zero-indexed).'
    },
    {
      type: 'mcq',
      question: 'Which tag is used to include JavaScript in HTML?',
      options: ['<css>', '<javascript>', '<script>', '<code>'],
      answer: '<script>',
      explanation: 'The <script> tag embeds or loads JavaScript.'
    },
    {
      type: 'boolean',
      question: 'Accessibility only benefits users with permanent disabilities.',
      options: ['True', 'False'],
      answer: 'False',
      explanation: 'Accessibility benefits everyone, including situational and temporary impairments.'
    },
    {
      type: 'mcq',
      question: 'Which method adds an item to the end of a JavaScript array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      answer: 'push()',
      explanation: 'push() appends to the end; pop() removes from the end.'
    },
    {
      type: 'mcq',
      question: 'Which CSS property controls the text size?',
      options: ['font-size', 'text-size', 'font-style', 'text-style'],
      answer: 'font-size',
      explanation: 'font-size sets the size of text in CSS.'
    },
    {
      type: 'boolean',
      question: 'The <img> tag is used to embed images in HTML.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<img> embeds images; it has no closing tag.'
      },
    {
      type: 'mcq',
      question: 'Which HTML element is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      answer: '<a>',
      explanation: '<a> defines a hyperlink; href attribute specifies the URL.'
    },
    {
      type: 'text',
      question: 'What does the acronym "HTML" stand for?',
      answer: 'HyperText Markup Language',
      explanation: 'HTML = HyperText Markup Language, used for structuring web content.'
    },
    {
      type: 'mcq',
      question: 'Which CSS property is used to change the background color of an element?',
      options: ['color', 'background-color', 'bgcolor', 'background'],
      answer: 'background-color',
      explanation: 'background-color sets the background color of an element.'
    },
    { type: 'boolean',
      question: 'The <div> element is a block-level element in HTML.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<div> is a block-level element used for grouping content.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a table row?',
      options: ['<tr>', '<td>', '<th>', '<table>'],
      answer: '<tr>',
      explanation: '<tr> defines a row in an HTML table; <td> defines a cell.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a table header?',
      options: ['<th>', '<tr>', '<td>', '<table>'],
      answer: '<th>',
      explanation: '<th> defines a header cell in an HTML table.'
    },
    { type: 'boolean',
      question: 'The <footer> element is used to define the footer of a document or section.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<footer> defines the footer, typically containing copyright and links.'
    },
    { type: 'mcq',
      question: 'Which CSS property is used to change the text color?',
      options: ['color', 'text-color', 'font-color', 'bg-color'],
      answer: 'color',
      explanation: 'color sets the text color in CSS.'
      },
    { type: 'mcq',
      question: 'Which HTML element is used to define an unordered list?',
      options: ['<ul>', '<ol>', '<li>', '<list>'],
      answer: '<ul>',
      explanation: '<ul> defines an unordered list; <ol> defines an ordered list.'
    },
    { type: 'boolean',
      question: 'The <section> element is used to define a standalone section in a document.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<section> defines a thematic grouping of content, often with a heading.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a form for user input?',
      options: ['<form>', '<input>', '<textarea>', '<button>'],
      answer: '<form>',
      explanation: '<form> defines a form for user input; <input> is used for individual fields.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a line break?',
      options: ['<br>', '<hr>', '<break>', '<line>'],
      answer: '<br>',
      explanation: '<br> defines a line break in HTML; <hr> defines a horizontal rule.'
    },
    { type: 'boolean',
      question: 'The <nav> element is used to define navigation links in a document.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<nav> defines a section of navigation links, typically a menu.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a block of code?',
      options: ['<code>', '<pre>', '<block>', '<script>'],
      answer: '<pre>',
      explanation: '<pre> defines preformatted text, preserving whitespace and line breaks; <code > is used for inline code snippets.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a block of text that is quoted from another source?',
      options: ['<blockquote>', '<cite>', '<q>', '<quote>'],
      answer: '<blockquote>',
      explanation: '<blockquote> is used for longer quotations, while <q> is for shorter, inline quotes.'
    },
    { type: 'boolean',
      question: 'The <aside> element is used to define content that is tangentially related to the main content.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<aside> defines content aside from the main content, like sidebars or pull quotes.'
    },
    { type: 'mcq',
      question: 'Which HTML element is used to define a caption for a table?',
      options: ['<caption>', '<title>', '<header>', '<footer>'],
      answer: '<caption>',
      explanation: '<caption> defines a title or caption for a table, typically displayed above it.'
    },  
    { type: 'boolean',
      question: 'The <header> element is used to define the header of a document or section.',
      options: ['True', 'False'],
      answer: 'True',
      explanation: '<header> defines the header, typically containing introductory content or navigation links.'
    } 
  ];

  // Expose to window in a controlled name
  win.QUIZ_QUESTIONS = questions;
}(window));
