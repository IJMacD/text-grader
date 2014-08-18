$ ->

  #
  # DOM
  #
  sourceText = $('#source-text')
  resultText = $('#result')
  breakdownList = $('#breakdown')
  gradeButton = $('#grade-btn')
  sample1Button = $('#sample-1-btn')
  sample2Button = $('#sample-2-btn')
  sample3Button = $('#sample-3-btn')
  explainButton = $('#explain-btn')
  explanation = $('#explanation')
  wordListList = $('#word-lists')
  decomposedText = $('#decomposed-text')
  ungradedList = $('#ungraded-list')

  #
  # Parameters
  #
  wordLists =
    "Pre": ["see", "play", "me", "at", "run", "go", "and", "look", "can",
      "here"]
    "Grade K": ["you", "come", "not", "with", "jump", "help", "is", "work",
      "are", "this"]
    "Grade 1": ["road", "live", "thank", "when", "bigger", "how", "always",
      "night", "spring", "today"]
    "Grade 2": ["our", "please", "myself", "town", "early", "send", "wide",
      "believe", "quietly", "carefully"]
    "Grade 3": ["city", "middle", "moment", "frightened", "exclaimed",
      "several", "lonely", "drew", "since", "straight"]
    "Grade 4": ["decided", "served", "amazed", "silent", "wrecked", "improved",
      "certainly", "entered", "realized", "interrupted"]
    "Grade 5": ["scanty", "business", "develop", "considered", "discussed",
      "behaved", "splendid", "acquainted", "escaped", "grim"]
    "Grade 6": ["bridge", "commercial", "abolish", "trucker", "apparatus",
      "elementary", "comment", "necessity", "gallery", "relativity"]
    "Grade 7": ["amber", "dominion", "sundry", "capillary", "impetuous",
      "blight", "wrest", "enumerate", "daunted", "condescend"]
    "Grade 8": ["capacious", "limitation", "pretext", "intrigue", "delusion",
      "immaculate", "ascent", "acrid", "binocular", "embankment"]
    "Grade 9": ["conscientious", "isolation", "molecule", "ritual", "momentous",
      "vulnerable", "kinship", "conservation", "jaunty", "inventive"]
    "Grade 10": ["zany", "jerkin", "nausea", "gratuitous", "linear", "inept",
      "legality", "aspen", "amnesty", "barometer"]
    "Grade 11": ["galore", "rotunda", "capitalism", "prevaricate", "visible",
      "exonerate", "superannuate", "luxuriate", "piebald", "crunch"]

  explain = false

  #
  # Configuration
  #
  sampleTexts = [
    "The boy is playing with his dog. You can see it run towards this tree.
    Look now it is jumping! How does it always manage to scare me?"

    "I am both amazed and frightened by your ability to make me feel lonely.
    It certainly makes me develop a feeling that I am daunted by. I considered
    there to be a kinship with you. Instead I feel like that was just a
    delusion. I feel such isolation as though an inept blight befalls me."

    "Oh what galore! Such a visible, momentous occasion. You have chosen to
    exonerate me! The acrid stench which once caused nausea, not from mere
    molecules, but from that truly zany situation."
  ]

  #
  # Data
  #
  wordRegex = /\w+/g

  #
  # Functions
  #

  gradeSourceText = ->
    text = sourceText.val()

    if not text? or text.length is 0
      return

    breakdown = gradeText text

    showGrade breakdown
    showBreakdown breakdown

    if explain
      decomposed = decomposeText text
      showWordLists decomposed
      showDecomposedText decomposed

  gradeText = (text) ->
    decomposed = decomposeText text
    totalWords = countUniqueWords decomposed
    grades = {}

    for own grade, wordList of wordLists

      currentGrade = 0

      for word in wordList
        if decomposed[word]?
          currentGrade++

      grades[grade] = currentGrade / totalWords

    grades

  sortWordLists = ->
    for own grade, wordList of wordLists
      wordList.sort()

  decomposeText = (text) ->
    words = text.match wordRegex
    hash = {}

    for word in words

      word = word.toLowerCase()

      hash[word] = (hash[word] or 0) + 1

    hash

  countTotalWords = (hash) ->
    count = 0

    for own word, wordCount of hash
      count += wordCount

    count

  countUniqueWords = (hash) ->
    count = 0

    for own word, wordCount of hash
      count++

    count

  calculateGrade = (grades) ->
    calculatePeakGrade grades

  calculatePeakGrade = (grades) ->
    max = Math.max values(grades)...
    peaks = {}

    peaks[grade] = value for own grade, value of grades when value is max

    calculateAverageGrade peaks

  calculateAverageGrade = (grades) ->
    i = 1
    sum = 0
    total = 0
    index = []

    for own grade, value of grades
      index.push grade

      sum += i * value
      total += value

      i++

    avg = sum / total

    index[Math.floor avg-1]

  showGrade = (grades) ->
    grade = calculateGrade grades

    resultText.text grade
    resultText.show()

  showBreakdown = (grades) ->
    calcGrade = calculateGrade grades

    breakdownList.empty()

    for own grade, value of grades
      value = grades[grade]
      r = 255 * (1-value)
      g = 255 * Math.sin value * Math.PI * 2
      b = 128
      $ '<li title="' + grade + '">' + (value*100).toFixed() + '%</li>'
      .css
        'height': value * 200
        'background': 'rgba(' + r.toFixed() + ', ' + g.toFixed() + ', ' +
          b.toFixed() + ', 1)'
        'box-shadow': if grade is calcGrade then '0 0 5px 5px yellow' else ''
      .appendTo breakdownList

    breakdownList.show()

  showWordLists = (hash) ->

    wordListList.empty()

    for own grade, wordList of wordLists
      listList = $ '<ul>'

      for word in wordList
        wordItem = $ '<li>' + word + '</li>'
        if hash[word]?
          wordItem.addClass "used"

        listList.append wordItem

      list = $ '<li>' + grade + '</li>'
      list.append listList

      wordListList.append list

  showDecomposedText = (text) ->
    inWords = keys text
    outWords = []
    unusedWords = []

    inWords.sort()

    # This is a slow algorithm
    # Do not use! Only for explaining
    for word in inWords
      found = false

      for own grade, wordList of wordLists

        if word in wordList
          outWords.push '<span class="used">' + word + '</span>'
          found = true
          break

      if not found
        outWords.push word
        unusedWords.push word

    decomposedText.html( outWords.join " " )

    graderString = '<select><option></option>' + (keys( wordLists ).map(
      (word) ->
        return '<option>' + word + '</option>'
    ).join "") + '</select>'

    ungradedList.empty()
    ungradedList.append unusedWords.map(
      (word) ->
        return '<li><label>' + word + '</label>' + graderString + '</li>'
    ).join ''

  keys = (hash) ->
    out = []

    for own key, value of hash
      out.push key

    out

  values = (hash) ->
    out = []

    for own key, value of hash
      out.push value

    out

  #
  # Init
  #
  sortWordLists()

  #
  # Event Handlers
  #
  gradeButton.on "click", gradeSourceText

  sample1Button.on "click", ->
    sourceText.val sampleTexts[0]

    gradeSourceText()

  sample2Button.on "click", ->
    sourceText.val sampleTexts[1]

    gradeSourceText()

  sample3Button.on "click", ->
    sourceText.val sampleTexts[2]

    gradeSourceText()

  explainButton.on "click", ->

    explain = not explain

    if explain
      gradeSourceText()

    explanation.toggle explain

  ungradedList.on "change", (e) ->
    sel = $ e.target
    grade = sel.val()
    word = sel.parent().find('label')?.text()

    if wordLists[grade]?
      wordLists[grade].push word

      wordLists[grade].sort()

      gradeSourceText()
