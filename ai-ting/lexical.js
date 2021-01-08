// swapping the “le” at the ends of words like “able”, “fable”, “table”, etc with “el”
var commonMistakes = {
"abel": "able",
"fabel": "fable",
"tabel": "table"
}

var connectives = ['therefore', 'and', 'also', 'furthermore', 'moreover', 'because']
  connectiveCounter = 0
  consonants = 'bcdfghjklmnpqrstvwxz'

var suggestions = document.getElementsByClassName('navitem')
// get the text box
var text = document.getElementById('w3review')
    textHistory = []
    keypressCounter = 0



var aiDetectedMistakes = {}
var backspaceBool = false
var pressedSpace = false
var misspelledWord = ''
var correctWord = ''
// on every keypress 
text.addEventListener('keyup', (e) => {
    // the split creates an array every time there is a space bar
    var textArray = text.value.split(' ') 
        index = text.value.split('')
        i = 1
        word = ''
    textHistory.push(textArray[textArray.length - 1])
    keypressCounter++
    console.log(keypressCounter)
    // every time the keypress is a blankspace    
    if (index[index.length-1] == ' ') {
        // backwards iteration loop to get the last written word
        while (index[index.length-i-1] != ' ' && index.length > 0) {
            console.log('pass')
            word += index[index.length-i-1] 
            if (index[index.length-i-1] == ' ') break
            i++
            if (i == 100) break
        }
        // reverse the reversed word
        word = word.split('').reverse().join('') 
        // api takes the word and finds suggestions
        fetch('https://api.languagetoolplus.com/v2/check?data=%7B%22annotation%22%3A%5B%20%20%7B%22text%22%3A%20%22' + word + '%22%7D%20%5D%7D&language=en-US&enabledOnly=false')
          .then(response => response.json())
          .then(data => {
            suggestions[0].innerHTML = data.matches[0].replacements[0].value
            suggestions[1].innerHTML = data.matches[0].replacements[1].value
            suggestions[2].innerHTML = data.matches[0].replacements[2].value
        })  
        // when user clicks suggestion, change the text      
    }

    // if user presses enter
    if (e.keyCode == 13) {
        // inspect element to see how it works
        for (i = 0; i < textArray.length; i++) {
            // you dont have to know what line 104 does...
            if (i + 1 == textArray.length) textArray[i] = textArray[i].slice(0, -1)
            if (commonMistakes[textArray[i]] != null) {
              // replace the misspelled word (e.g abel with able)
              textArray[i] = commonMistakes[textArray[i]]
            }
        }

        ///////////////////////// checks if sentence is too long /////////////////////////
        var sentences = text.value.split('.').slice(0, -1)
        for (i = 0; i < connectives.length; i++) {
            for (j = 0; j < sentences.length; j++) {
                if (sentences[j].includes(connectives[i])) {
                    connectiveCounter++
                    if (connectiveCounter > 2 && sentences[j].length <= 75) {
                        console.log('Suggestion: you might have too many connectives')
                    }
                    else if (connectiveCounter > 2 && sentences[j].length > 75) {
                        // show which connective to split on
                        console.log('Suggestion: you might want to split this sentence into 2 sentences')
                    }
                }
            }
        }

        ///////////////////////// check if a pararaph is too long (not that important) /////////////////////////





        ///////////////////////// past tense verbs fixing (lookt -> looked) /////////////////////////

        var exceptionList = ['meant', 'thought', 'built', 'first']     
        for (i = 0; i < textArray.length; i++) {
            // looks at last two characters of each word
            let wordEnding = textArray[i].substring(textArray[i].length-2, textArray[i].length)
            if (consonants.includes(wordEnding.charAt(0)) && 
                wordEnding.charAt(1).toLowerCase() == 't' && 
                !exceptionList.includes(textArray[i])) {
                textArray[i] = textArray[i].slice(0, -1) + 'ed'
            }
        }


        ///////////////////////// Capitalize first letter /////////////////////////

        // cap the first letter of each sentence\
        for (i = 0; i < textArray.length; i++) {
            if (textArray[i].includes('.')) {
                let index = textArray[i].indexOf('.')
                console.log(index)
                // the index of the full stop is at the end of the word
                if (textArray[i].length == index + 1) {
                    console.log('pass 1')
                    textArray[i+1] = textArray[i+1].substring(0, 1).toUpperCase() + textArray[i+1].substring(1)                        
                } else if (index == 0) {
                    console.log('pass 2')
                    textArray[i] = textArray[i].substring(1, 2).toUpperCase() + textArray[i].substring(2)
                }
            }
        }

        // cap the first letter of the whole text
        let joinedText = textArray.join(' ')
        text.value = joinedText.substring(0, 1).toUpperCase() + joinedText.substring(1)
    }
    // if the user pressed backspace 
    // block arrow keys
    if (e.keyCode == 8) {
        misspelledWord = textHistory[textHistory.length - 2]
        backspaceBool = true
    }
    if (e.keyCode == 32 && backspaceBool) {
 
        correctWord = textHistory[textHistory.length-1]
        aiDetectedMistakes[misspelledWord] = correctWord
        backspaceBool = false
        pressedSpace = true
        console.log(aiDetectedMistakes)
    }
    console.log(textHistory)
})