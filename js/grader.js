$(function(){
		/*
		 * DOM
		 */
	var sourceText = $('#source-text'),
		resultText = $('#result'),
		breakdownList = $('#breakdown'),
		gradeButton = $('#grade-btn'),
		sample1Button = $('#sample-1-btn'),
		sample2Button = $('#sample-2-btn'),
		sample3Button = $('#sample-3-btn'),
		explainButton = $('#explain-btn'),
		explanation = $('#explanation'),
		wordListList = $('#word-lists'),
		decomposedText = $('#decomposed-text'),
		ungradedList = $('#ungraded-list'),

		/*
		 * Parameters
		 */
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
		},

		explain = false,

		/*
		 * Configuration
		 */
		sampleTexts = [
			"The boy is playing with his dog. You can see it run towards this tree. Look now it is jumping! How does it always manage to scare me?",
			"I am both amazed and frightened by your ability to make me feel lonely. It certainly makes me develop a feeling that I am daunted by. I considered there to be a kinship with you. Instead I feel like that was just a delusion. I feel such isolation as though an inept blight befalls me.",
			"Oh what galore! Such a visible, momentous occasion. You have chosen to exonerate me! The acrid stench which once caused nausea, not from mere molecules, but from that truly zany situation."
		],

		/*
		 * Data
		 */
		wordRegex = /\w+/g;

	/*
	 * Event Handlers
	 */
	gradeButton.on("click", gradeSourceText);

	[sample1Button, sample2Button, sample3Button].map(
		function(btn, i){
			btn.on("click", function() {
				sourceText.val(sampleTexts[i]);

				gradeSourceText();
			});
		}
	);

	explainButton.on("click", function(){

		explain = !explain;

		if(explain){
			gradeSourceText();
		}

		explanation.toggle(explain);
	});

	ungradedList.on("change", function(e){
		var sel = $(e.target),
			grade = sel.val(),
			word = sel.parent().find('label').text();

		if(wordLists[grade]){
			wordLists[grade].push(word);

			wordLists[grade].sort();

			gradeSourceText();
		}
	});

	/*
	 * Init
	 */
	sortWordLists();

	/*
	 * Functions
	 */
	function gradeSourceText(){
		var text = sourceText.val(),
			breakdown,
			decomposed;

		if(!text || !text.length){
			return;
		}

		breakdown = gradeText(text);

		showGrade(breakdown);
		showBreakdown(breakdown);

		if(explain){
			decomposed = decomposeText(text);
			showWordLists(decomposed);
			showDecomposedText(decomposed);
		}
	}

	function gradeText(text){
		var decomposed = decomposeText(text),
			grades = {},
			totalWords = getTotalWords(decomposed),
			currentGrade,
			grade,
			wordList;

		for(grade in wordLists){
			if(wordLists.hasOwnProperty(grade)){

				wordList = wordLists[grade];

				currentGrade = 0;

				wordList.forEach(function(word){
					if(decomposed[word]){
						currentGrade++;
					}
				});

				grades[grade] = currentGrade / totalWords;
			}
		}

		return grades;
	}

	function sortWordLists(){
		for(grade in wordLists){
			if(wordLists.hasOwnProperty(grade)){
				wordLists[grade].sort();
			}
		}
	}

	function decomposeText(text){
		var words = text.match(wordRegex),
			hash = {};
		words.forEach(function(word){
			word = word.toLowerCase();
			if(hash[word]){
				hash[word]++;
			} else {
				hash[word] = 1;
			}
		});
		return hash;
	}

	function getTotalWords(hash){
		var word,
			count = 0;

		for(word in hash){
			if(hash.hasOwnProperty(word)){
				count++;
			}
		}
		return count;
	}

	function calculateGrade(grades){
		return calculatePeakGrade(grades);
	}

	function calculatePeakGrade(grades){
		var max = 0,
			grade,
			value,
			peaks = {};

		for(grade in grades){
			if(grades.hasOwnProperty(grade)){
				value = grades[grade];

				max = Math.max(max, value);
			}
		}

		for(grade in grades){
			if(grades.hasOwnProperty(grade)){
				value = grades[grade];

				if(value == max){
					peaks[grade] = value;
				}
			}
		}

		return calculateAverageGrade(peaks);
	}

	function calculateAverageGrade(grades){
		var grade,
			value,
			i = 1,
			sum = 0,
			total = 0,
			index = [];

		for(grade in grades){
			if(grades.hasOwnProperty(grade)){
				index.push(grade);

				value = grades[grade];

				sum += i * value;
				total += value;

				i++;
			}
		}

		avg = sum / total;

		return index[Math.floor(avg-1)];
	}

	function showGrade(grades){
		var grade = calculateGrade(grades);

		resultText.text(grade);
		resultText.show();
	}

	function showBreakdown(grades){
		var grade,
			value,
			r,
			g,
			b,
			calcGrade = calculateGrade(grades);

		breakdownList.empty();

		for(grade in grades){
			if(grades.hasOwnProperty(grade)){
				value = grades[grade];
				r = 255*(1-value);
				g = 255*Math.sin(value*Math.PI*2);
				b = 128;
				$('<li title="'+grade+'">'+(value*100).toFixed()+'%</li>')
					.css({
						'height': value*200,
						'background': 'rgba('+r.toFixed()+', '+g.toFixed()+', '+b.toFixed()+', 1)',
						'box-shadow': (grade==calcGrade)?'0 0 5px 5px yellow':''
					})
					.appendTo(breakdownList);
			}
		}

		breakdownList.show();
	}

	function showWordLists(hash){
		var grade,
			list,
			listList,
			wordItem;

		wordListList.empty();

		for(grade in wordLists){
			if(wordLists.hasOwnProperty(grade)){

				listList = $('<ul>');

				wordLists[grade].forEach(function(word){
					wordItem = $('<li>'+word+'</li>');
					if(hash[word]){
						wordItem.addClass("used");
					}
					listList.append(wordItem);
				});

				list = $('<li>'+grade+'</li>');
				list.append(listList);

				wordListList.append(list);
			}
		}
	}

	function showDecomposedText(text){
		var inWords = keys(text),
			outWords = [],
			unusedWords = [],
			graderString;

		inWords.sort();

		// This is a slow algorithm
		// Do not use! Only for explaining
		inWords.forEach(function(word){
			var grade,
				wordList;

			for(grade in wordLists){
				if(wordLists.hasOwnProperty(grade)){

					wordList = wordLists[grade];

					if(wordList.indexOf(word) != -1){
						outWords.push('<span class="used">'+word+'</span>');
						return;
					}
				}
			}

			outWords.push(word);
			unusedWords.push(word);
		});

		decomposedText.html(outWords.join(" "));

		graderString = '<select><option></option>' + keys(wordLists).map(function(word){
			return '<option>' + word + '</option>';
		}).join("") + '</select>';

		ungradedList.empty();
		ungradedList.append(
			unusedWords.map(function(word){
				return '<li><label>' + word + '</label>' + graderString + '</li>';
			}).join('')
		);
	}

	function keys(hash){
		var out = [],
			key;

		for(key in hash){
			if(hash.hasOwnProperty(key)){
				out.push(key);
			}
		}

		return out;
	}
});
