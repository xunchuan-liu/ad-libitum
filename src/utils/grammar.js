// correct grammatically incorrect instances of articles 'a' and 'an'
function fixArticles(sentence) {
    let correctedSentence = sentence;

    const wrongA = /\sa\s[aeiou]|A\s[aeiou]/gi;        
    const wrongAn = /\san\s[^aeiou]|An\s[^aeiou]/gi;

    const instancesA = [...sentence.matchAll(wrongA)];
    const instancesAn = [...sentence.matchAll(wrongAn)];

    instancesA.forEach(instance => {
      let correctedInstance = instance[0].replace(' a ', ' an ');
      correctedInstance = correctedInstance.replace('A ', 'An ');
      correctedSentence = correctedSentence.replace(instance[0], correctedInstance);
    })
    instancesAn.forEach(instance => {
      let correctedInstance = instance[0].replace(' an ', ' a ');
      correctedInstance = correctedInstance.replace('An ', 'A ');
      correctedSentence = correctedSentence.replace(instance[0], correctedInstance);
    })

    return correctedSentence;
  }

  function customReplace(sentence, original, custom, offset) {
      let customSentence = sentence;            

      // word is at beginning of the sentence
      if (offset === 0) {
          custom = custom[0].toUpperCase() + custom.substring(1); //capitalize first word
          customSentence = sentence.replace(original, custom);                    
      }

      else {
          // ignore instances of matching a word inside of another word
          // i.e. ignore "man" inside of the word "many" or "woman"
          const regex = new RegExp(`[^0-9a-zA-Z]${original}[^0-9a-zA-Z]`);
          const [match] = sentence.match(regex) || [];
          if (match) {
              // first swap the original/custom word inside of the found match
              const replacement = match.replace(original, custom);
              // then perform the swap for entire sentence
              // this preserves any spaces or punctuation
              customSentence = sentence.replace(match, replacement);                           
          }
          else {
              customSentence = sentence.replace(original, custom);              
          }
      }

      return customSentence;
  }

  export { fixArticles, customReplace };