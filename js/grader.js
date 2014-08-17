// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var breakdownList, calculateAverageGrade, calculateGrade, calculatePeakGrade, decomposeText, decomposedText, explain, explainButton, explanation, getTotalWords, gradeButton, gradeSourceText, gradeText, keys, resultText, sample1Button, sample2Button, sample3Button, sampleTexts, showBreakdown, showDecomposedText, showGrade, showWordLists, sortWordLists, sourceText, ungradedList, values, wordListList, wordLists, wordRegex;
    sourceText = $('#source-text');
    resultText = $('#result');
    breakdownList = $('#breakdown');
    gradeButton = $('#grade-btn');
    sample1Button = $('#sample-1-btn');
    sample2Button = $('#sample-2-btn');
    sample3Button = $('#sample-3-btn');
    explainButton = $('#explain-btn');
    explanation = $('#explanation');
    wordListList = $('#word-lists');
    decomposedText = $('#decomposed-text');
    ungradedList = $('#ungraded-list');
    wordLists = {
      "Pre": ["see", "play", "me", "at", "run", "go", "and", "look", "can", "here"],
      "Grade K": ["you", "come", "not", "with", "jump", "help", "is", "work", "are", "this"],
      "Grade 1": ["road", "live", "thank", "when", "bigger", "how", "always", "night", "spring", "today"],
      "Grade 2": ["our", "please", "myself", "town", "early", "send", "wide", "believe", "quietly", "carefully"],
      "Grade 3": ["city", "middle", "moment", "frightened", "exclaimed", "several", "lonely", "drew", "since", "straight"],
      "Grade 4": ["decided", "served", "amazed", "silent", "wrecked", "improved", "certainly", "entered", "realized", "interrupted"],
      "Grade 5": ["scanty", "business", "develop", "considered", "discussed", "behaved", "splendid", "acquainted", "escaped", "grim"],
      "Grade 6": ["bridge", "commercial", "abolish", "trucker", "apparatus", "elementary", "comment", "necessity", "gallery", "relativity"],
      "Grade 7": ["amber", "dominion", "sundry", "capillary", "impetuous", "blight", "wrest", "enumerate", "daunted", "condescend"],
      "Grade 8": ["capacious", "limitation", "pretext", "intrigue", "delusion", "immaculate", "ascent", "acrid", "binocular", "embankment"],
      "Grade 9": ["conscientious", "isolation", "molecule", "ritual", "momentous", "vulnerable", "kinship", "conservation", "jaunty", "inventive"],
      "Grade 10": ["zany", "jerkin", "nausea", "gratuitous", "linear", "inept", "legality", "aspen", "amnesty", "barometer"],
      "Grade 11": ["galore", "rotunda", "capitalism", "prevaricate", "visible", "exonerate", "superannuate", "luxuriate", "piebald", "crunch"]
    };
    explain = false;
    sampleTexts = ["The boy is playing with his dog. You can see it run towards this tree. Look now it is jumping! How does it always manage to scare me?", "I am both amazed and frightened by your ability to make me feel lonely. It certainly makes me develop a feeling that I am daunted by. I considered there to be a kinship with you. Instead I feel like that was just a delusion. I feel such isolation as though an inept blight befalls me.", "Oh what galore! Such a visible, momentous occasion. You have chosen to exonerate me! The acrid stench which once caused nausea, not from mere molecules, but from that truly zany situation."];
    wordRegex = /\w+/g;
    gradeSourceText = function() {
      var breakdown, decomposed, text;
      text = sourceText.val();
      if ((text == null) || text.length === 0) {
        return;
      }
      breakdown = gradeText(text);
      showGrade(breakdown);
      showBreakdown(breakdown);
      if (explain) {
        decomposed = decomposeText(text);
        showWordLists(decomposed);
        return showDecomposedText(decomposed);
      }
    };
    gradeText = function(text) {
      var currentGrade, decomposed, grade, grades, totalWords, word, wordList, _i, _len;
      decomposed = decomposeText(text);
      totalWords = getTotalWords(decomposed);
      grades = {};
      for (grade in wordLists) {
        if (!__hasProp.call(wordLists, grade)) continue;
        wordList = wordLists[grade];
        currentGrade = 0;
        for (_i = 0, _len = wordList.length; _i < _len; _i++) {
          word = wordList[_i];
          if (decomposed[word] != null) {
            currentGrade++;
          }
        }
        grades[grade] = currentGrade / totalWords;
      }
      return grades;
    };
    sortWordLists = function() {
      var grade, wordList, _results;
      _results = [];
      for (grade in wordLists) {
        if (!__hasProp.call(wordLists, grade)) continue;
        wordList = wordLists[grade];
        _results.push(wordList.sort());
      }
      return _results;
    };
    decomposeText = function(text) {
      var hash, word, words, _i, _len;
      words = text.match(wordRegex);
      hash = {};
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        word = word.toLowerCase();
        if (hash[word] != null) {
          hash[word]++;
        } else {
          hash[word] = 1;
        }
      }
      return hash;
    };
    getTotalWords = function(hash) {
      var count, word, wordCount;
      count = 0;
      for (word in hash) {
        if (!__hasProp.call(hash, word)) continue;
        wordCount = hash[word];
        count++;
      }
      return count;
    };
    calculateGrade = function(grades) {
      return calculatePeakGrade(grades);
    };
    calculatePeakGrade = function(grades) {
      var grade, max, peaks, value;
      max = Math.max.apply(Math, values(grades));
      peaks = {};
      for (grade in grades) {
        if (!__hasProp.call(grades, grade)) continue;
        value = grades[grade];
        if (value === max) {
          peaks[grade] = value;
        }
      }
      return calculateAverageGrade(peaks);
    };
    calculateAverageGrade = function(grades) {
      var avg, grade, i, index, sum, total, value;
      i = 1;
      sum = 0;
      total = 0;
      index = [];
      for (grade in grades) {
        if (!__hasProp.call(grades, grade)) continue;
        value = grades[grade];
        index.push(grade);
        sum += i * value;
        total += value;
        i++;
      }
      avg = sum / total;
      return index[Math.floor(avg - 1)];
    };
    showGrade = function(grades) {
      var grade;
      grade = calculateGrade(grades);
      resultText.text(grade);
      return resultText.show();
    };
    showBreakdown = function(grades) {
      var b, calcGrade, g, grade, r, value;
      calcGrade = calculateGrade(grades);
      breakdownList.empty();
      for (grade in grades) {
        if (!__hasProp.call(grades, grade)) continue;
        value = grades[grade];
        value = grades[grade];
        r = 255 * (1 - value);
        g = 255 * Math.sin(value * Math.PI * 2);
        b = 128;
        $('<li title="' + grade + '">' + (value * 100).toFixed() + '%</li>').css({
          'height': value * 200,
          'background': 'rgba(' + r.toFixed() + ', ' + g.toFixed() + ', ' + b.toFixed() + ', 1)',
          'box-shadow': grade === calcGrade ? '0 0 5px 5px yellow' : ''
        }).appendTo(breakdownList);
      }
      return breakdownList.show();
    };
    showWordLists = function(hash) {
      var grade, list, listList, word, wordItem, wordList, _i, _len, _results;
      wordListList.empty();
      _results = [];
      for (grade in wordLists) {
        if (!__hasProp.call(wordLists, grade)) continue;
        wordList = wordLists[grade];
        listList = $('<ul>');
        for (_i = 0, _len = wordList.length; _i < _len; _i++) {
          word = wordList[_i];
          wordItem = $('<li>' + word + '</li>');
          if (hash[word] != null) {
            wordItem.addClass("used");
          }
          listList.append(wordItem);
        }
        list = $('<li>' + grade + '</li>');
        list.append(listList);
        _results.push(wordListList.append(list));
      }
      return _results;
    };
    showDecomposedText = function(text) {
      var found, grade, graderString, inWords, outWords, unusedWords, word, wordList, _i, _len;
      inWords = keys(text);
      outWords = [];
      unusedWords = [];
      inWords.sort();
      for (_i = 0, _len = inWords.length; _i < _len; _i++) {
        word = inWords[_i];
        found = false;
        for (grade in wordLists) {
          if (!__hasProp.call(wordLists, grade)) continue;
          wordList = wordLists[grade];
          if (__indexOf.call(wordList, word) >= 0) {
            outWords.push('<span class="used">' + word + '</span>');
            found = true;
            break;
          }
        }
        if (!found) {
          outWords.push(word);
          unusedWords.push(word);
        }
      }
      decomposedText.html(outWords.join(" "));
      graderString = '<select><option></option>' + (keys(wordLists).map(function(word) {
        return '<option>' + word + '</option>';
      }).join("")) + '</select>';
      ungradedList.empty();
      return ungradedList.append(unusedWords.map(function(word) {
        return '<li><label>' + word + '</label>' + graderString + '</li>';
      }).join(''));
    };
    keys = function(hash) {
      var key, out, value;
      out = [];
      for (key in hash) {
        if (!__hasProp.call(hash, key)) continue;
        value = hash[key];
        out.push(key);
      }
      return out;
    };
    values = function(hash) {
      var key, out, value;
      out = [];
      for (key in hash) {
        if (!__hasProp.call(hash, key)) continue;
        value = hash[key];
        out.push(value);
      }
      return out;
    };
    sortWordLists();
    gradeButton.on("click", gradeSourceText);
    sample1Button.on("click", function() {
      sourceText.val(sampleTexts[0]);
      return gradeSourceText();
    });
    sample2Button.on("click", function() {
      sourceText.val(sampleTexts[1]);
      return gradeSourceText();
    });
    sample3Button.on("click", function() {
      sourceText.val(sampleTexts[2]);
      return gradeSourceText();
    });
    explainButton.on("click", function() {
      explain = !explain;
      if (explain) {
        gradeSourceText();
      }
      return explanation.toggle(explain);
    });
    return ungradedList.on("change", function(e) {
      var grade, sel, word, _ref;
      sel = $(e.target);
      grade = sel.val();
      word = (_ref = sel.parent().find('label')) != null ? _ref.text() : void 0;
      if (wordLists[grade] != null) {
        wordLists[grade].push(word);
        wordLists[grade].sort();
        return gradeSourceText();
      }
    });
  });

}).call(this);
