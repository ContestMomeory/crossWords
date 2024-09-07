let crossWords = [];
let words;
let canvas;
let gridSize = 40;
let hintParas = [];
let crossWordLastClicked = [];
let answerSquence = 0;
let leftColumn;
let isolatedWord = [];
let topic;
let score = 0;
let reward;
let wordInput;

class CrossWordGrids
{
    constructor()
    {
        this.SitsWordsDic = {};
        this.Sits = [];
        this.SitLetters = [];
        this.sitXMin = 0;
        this.sitYMin = 1;
        this.overlapCount = 0;
        this.sitWords = [];
        this.sitXMax = 0;
        this.sitYMax = 1;
    }

    resetGrids()
    {
        console.log("resetGrids");
        let count = 0;
        for(let i = 0; i < this.sitWords.length; i++)
        {
            console.log(this.sitWords[i]);
            let sitWord = this.sitWords[i];
            for(let k = 0; k < crossWords.length; k++)
            {
                let crossword = crossWords[k];
                console.log(crossword);
                if(crossword.wordString == sitWord)
                {
                    for(let j = 0; j < sitWord.length; j++)
                    {
                        let gridX = this.Sits[count].x - this.sitXMin;
                        let gridY = this.Sits[count].y - this.sitYMin;
                        this.Sits[count].x = this.Sits[count].x - this.sitXMin;
                        this.Sits[count].y = this.Sits[count].y - this.sitYMin;
                        crossword.gridPositions.push({x:gridX, y: gridY});
                        count++;
                        console.log(sitWord[j], {gridX, gridY}, count);
                    }
                    break;
                }
            }
        } 
        this.sitXMax -= this.sitXMin;
        this.sitXMin = 0;
        this.sitYMax -= this.sitYMin;
        this.sitYMin = 0;
    }
}

class CrossWord
{
    constructor(wordString, answerSqu)
    {
        this.wordString = wordString;
        this.gridPositions = [];
        this.answerSqu = answerSqu;
        this.clickedNum = 0;
        this.userAnswer = "";
    }

}

let crossWordGrids;



function setup()
{
    wordInput = select("#wordInput");
    words = new Set([]);
    wordsSubmmit = select("#wordsSubmmit");
    wordsSubmmit.mouseClicked(createGame);
    canvas = createCanvas(windowWidth , windowHeight * 2);
    
    rightColumn = select("#rightColumn");
    canvas.parent(rightColumn);
    canvas.mouseClicked(highlightCrossWord);
    userAnswer = select("#userAnswer");
    userAnswer.changed(drawUserAnswer);
    getScore = select("#getScore");
    getScore.mouseClicked(calculateScore);
    getScore.hide();
    userAnswer.hide();
    leftColumn = select("#leftColumn");
    topicInput = select("#topicInput");
    topicInput.changed(updateTopic);
    answerList = select("#answerList");
}

function updateTopic()
{
    topic = this.value();
    let h1 = select("#header");
    h1.html(topic +"主题  填字游戏");
}


function hideWordList()
{
    wordsSubmmit.hide();
    wordInput.hide();
}

function createGame()
{
    hideWordList();
    getScore.show();
    userAnswer.show();
    background(255, 255, 255);
    let wordInputs = wordInput.value().split("\n");
    for(let i = 0; i < wordInputs.length; i++)
    {
        if(wordInputs[i] != "")
        {
            words.add(wordInputs[i]);
        }
    }
    for(let word of words){
        let crossword = new CrossWord(word, answerSquence);
        answerSquence += 1;
        crossWords.push(crossword);
    }
    crossWordGrids = new CrossWordGrids();
    console.log(crossWordGrids);
    placeWords();
    crossWordGrids.resetGrids();
    drawGrid(crossWordGrids);


    
}


function drawGrid(crossWordGrids) {
    stroke(0);
    strokeWeight(2);

    fill(0, 0, 0);
    for (let i = crossWordGrids.sitYMin; i <= crossWordGrids.sitYMax; i++) 
    {
      for (let j = crossWordGrids.sitXMin; j <= crossWordGrids.sitXMax; j++) 
      {
        let x = j * gridSize;
        let y = i * gridSize;
        rect(x, y, gridSize, gridSize);
      }
    }
    for (let i = 0; i < crossWordGrids.Sits.length; i++)
    {
        fill(255, 255, 255);
        let gridUsedX = crossWordGrids.Sits[i].x * gridSize;
        let gridUsedY = crossWordGrids.Sits[i].y * gridSize;
        rect(gridUsedX, gridUsedY, gridSize, gridSize);
    }
  }

  function calculateGridClicked()
  {
    let x = floor(mouseX / gridSize);
    let y = floor(mouseY / gridSize);
    return {gridX: x, gridY: y};
  }

  


  function highlightCrossWord()
  {
    reverseHightlight();
    let crossWordClicked = [];
    let {gridX, gridY} = calculateGridClicked();
    let gridClicked = {x: gridX, y: gridY};
    for(let i = 0; i < crossWords.length; i++){
        let crossword = crossWords[i];
        let gridPositions = crossword.gridPositions;
        for(let j = 0; j < gridPositions.length; j++)
        {
            if(gridClicked.x == gridPositions[j].x && gridClicked.y == gridPositions[j].y)
            {
                crossWordClicked.push(crossword);
                break;
            }
        }
    }
    crossWordLastClicked = crossWordClicked;
    highlightGrids(crossWordClicked);
    drawUserAnswers();
    giveHint(crossWordClicked);
  }

  function reverseHightlight()
  {
    for(let i = 0; i < crossWordLastClicked.length; i++)
    {
        let crossword = crossWordLastClicked[i];
        let gridPositions = crossword.gridPositions;
        for(let j = 0; j < gridPositions.length; j++)
        {
            let gridPosition = gridPositions[j];
            fill(255, 255, 255);
            rect(gridPosition.x * gridSize, gridPosition.y * gridSize, gridSize, gridSize);
        }
    }
  }

  function highlightGrids(crossWordClicked)
  {
    for(let i = 0; i < crossWordClicked.length; i++)
    {
        let crossword = crossWordClicked[i];
        let gridPositions = crossword.gridPositions;
        let r = 100;
        let g = random(255);
        let b = random(255);
        for(let j = 0; j < gridPositions.length; j++)
        {
            let gridPosition = gridPositions[j];
            fill(r, g, b, 50);
            rect(gridPosition.x * gridSize, gridPosition.y * gridSize, gridSize, gridSize);
        }
    }
  }

  function giveHint(crossWordClicked)
  {
    for(let i = 0; i < hintParas.length; i++)
    {
        hintParas[i].remove();
    }
    hintParas = [];
    for(let i = 0; i < crossWordClicked.length; i++)
    {
        let crossWord = crossWordClicked[i];
        accessChatGpt(crossWord).catch(error =>
            {console.log("error!"+error);}
        );
    }
  }

  async function accessChatGpt(crossWord)
  {
    let word = crossWord.wordString;
    let prompt = "这是一个填字游戏，你的角色是生成单词的提示，帮助用户回答出正确的单词。";
    prompt += "用户要猜的单词是:" + word + ",请你生成一条提示。提示中不能出现这个单词";
    if(topic != "")
    {
        prompt += "单词和" + topic + "相关，你必须从" + topic + "的角度解释这个单词";
    }
    if(crossWord.ClickedNum % 2 == 1)
    {
        prompt += "用户已经得到" + crossWord.clickedNum + "次提示了，但是仍然回答不出来。";
        prompt += "请你给用户更加明显的提示。";
    }
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer sk-UifxoAFD92gjpoAcnGrSCj3CMrFnxgXUnjCyCVkU05zYJX0S");
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ]
        });

        let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        let response = await fetch("https://api.chatanywhere.tech/v1/chat/completions", requestOptions);
        let content = await response.json();
        let hint = content.choices[0].message.content;
        let hintPara = createP(hint);
        hintPara.parent(leftColumn);
        hintParas.push(hintPara);
        crossWord.ClickedNum += 1;
}

function drawUserAnswer()
{
  let answer = this.value();
  this.value("");
  if(crossWordLastClicked.length == 1)
  {
      let crossWordClicked = crossWordLastClicked[0];
      if(answer.length == crossWordClicked.wordString.length)
      {
        if(crossWordClicked.userAnswer != "")
        {
            r = 100;
            g = random(0, 255);
            b = random(0, 255);
            for(let i = 0; i < crossWordClicked.gridPositions.length; i++)
            {
                fill(255, 255, 255);
                rect(crossWordClicked.gridPositions[i].x * gridSize, crossWordClicked.gridPositions[i].y * gridSize, gridSize, gridSize);
            }
        }
          crossWordClicked.userAnswer = answer;
          for(let i = 0; i < crossWords.length; i++)
          {
            if(crossWords[i].userAnswer != "" && crossWords[i].userAnswer != answer)
            {
              gridPositions = crossWords[i].gridPositions;
              for(let j = 0; j < gridPositions.length; j++)
              {
                  for(let k = 0; k < crossWordClicked.gridPositions.length; k++)
                  {
                      if(gridPositions[j].x == crossWordClicked.gridPositions[k].x && gridPositions[j].y == crossWordClicked.gridPositions[k].y)
                      {
                        crossWords[i].userAnswer = crossWords[i].userAnswer.substring(0, j) + answer[k] + crossWords[i].userAnswer.substring(j + 1);
                        fill(255, 255, 255);
                        rect(gridPositions[j].x * gridSize, gridPositions[j].y * gridSize, gridSize, gridSize);
                      }
                        
                  }
              }
            }
          }
          drawUserAnswers();
      }
      else
      {
          alert("答案的长度和选中的单词长度不一致");
      }
      
  }
  else
  {
      alert("选中一个方向的单词再填写答案");
  }
}



  function calculateScore()
  {
    let count = 0;
    for (let i = 0; i < crossWords.length; i++)
    {
        if(crossWords[i].wordString == crossWords[i].userAnswer)
        {
            count++;
        }
        else
        {
            let li = createElement("li", "正确答案: " + crossWords[i].wordString);
            li.parent(answerList);
            li = createElement("li", "用户输入: " + crossWords[i].userAnswer);
            li.parent(answerList);
        }
        
    }
    score = count * 100 / crossWords.length;
    let p = createP("你答对了" + count + "题，你获得了" + score + "分！");
    p.parent(leftColumn);
    if(score == 100)
    {
        reward = createImg("image/daiHaoYuan1.png");
        reward.position(windowWidth / 2, windowHeight / 2);
        reward.style("width", "50px");

    }
    getScore.hide();
  }

  function drawUserAnswers()
  {
    for(let i = 0; i < crossWords.length; i++)
    {
        let crossWord = crossWords[i];
        if( crossWord.userAnswer!= "")
        {
            let gridPositions = crossWord.gridPositions;
            for(let j = 0; j < gridPositions.length; j++)
            {
                fill(0, 0, 0);
                textFont("Arial");
                textAlign(CENTER, CENTER);
                textSize(gridSize * 0.7);
                strokeWeight(1);
                text(crossWord.userAnswer[j], (gridPositions[j].x + 0.5) * gridSize, (gridPositions[j].y + 0.5) * gridSize);
            }
        }
    }
  }




function placeWords()
{
    
    placeWordsOneShot();
    
}




function placeWordsOneShot()
{
    let isolatedWordCopy = [];
    let placeRound = 0;
    for(let i = 0; i < crossWords.length; i++)
    {
        isolatedWord[i] = crossWords[i].wordString;
    }

    while(isolatedWord.length > 0)
    {
        isolatedWordCopy = [];
        for (let i = 0; i < isolatedWord.length; i++)
        {
            isolatedWordCopy.push(isolatedWord[i]);
        }
        placeOneWordFromMinXY(isolatedWordCopy[0]);
        isolatedWord = [];
        for (let i = 1; i < isolatedWordCopy.length; i++)
        {
            
            placeOneWord(isolatedWordCopy[i]);
        }
        console.log("isolatedword", isolatedWord);
        console.log("copy", isolatedWordCopy);
        placeRound = 1;
        while((placeRound != 1 && isolatedWord.length < isolatedWordCopy.length && isolatedWord.length > 0) || (placeRound == 1 && isolatedWord.length < isolatedWordCopy.length - 1 && isolatedWord.length > 0))
        {
            placeRound++;
            isolatedWordCopy = [];
            for (let i = 0; i < isolatedWord.length; i++)
            {
                isolatedWordCopy.push(isolatedWord[i]);
            }
            isolatedWord = [];
            for (let i = 0; i < isolatedWordCopy.length; i++)
            {
                
                placeOneWord(isolatedWordCopy[i]);
            }
            console.log("isolatedword", isolatedWord);
            console.log("copy", isolatedWordCopy);

        }   
    }
}

function placeOneWordFromMinXY(word)
{
    console.log("placeOneWordFromMinXY");
    console.log(word);
    let randomNum = floor(random(0, 2));
    let direction = "v";
    if(randomNum == 0)
    {
        direction = "h";
    }
    let letter;
    letter = word[0];
    if (direction == "h")
    {
        startX = crossWordGrids.sitXMin;
        startY = crossWordGrids.sitYMin - 1;
        crossWordGrids.sitYMin -= 1;
        crossWordGrids.SitLetters.push(letter);
        crossWordGrids.SitsWordsDic[JSON.stringify([startX, startY])] = letter;
        crossWordGrids.Sits.push({x: startX, y: startY});
        console.log({x: startX, y : startY});
        for(let i = 1; i < word.length; i++)
        {
            letter = word[i];
            let x = startX + i;
            let y = startY;
            if (x > crossWordGrids.sitXMax)
            {
                crossWordGrids.sitXMax = x;
            }
            crossWordGrids.SitLetters.push(letter);
            crossWordGrids.SitsWordsDic[JSON.stringify([x, y])] = letter;
            crossWordGrids.Sits.push({x: x, y: y});
            console.log({x: x, y : y});
        }
        crossWordGrids.sitWords.push(word);
    }
    else
    {
        startX = crossWordGrids.sitXMin - 1;
        startY = crossWordGrids.sitYMin;
        crossWordGrids.sitXMin -= 1;
        crossWordGrids.SitLetters.push(letter);
        crossWordGrids.SitsWordsDic[JSON.stringify([startX, startY])] = letter;
        crossWordGrids.Sits.push({x: startX, y: startY});
        console.log({x: startX, y : startY});
        for(let i = 1; i < word.length; i++)
        {
            letter = word[i];
            let x = startX;
            let y = startY + i;
            if (y > crossWordGrids.sitYMax)
            {
                crossWordGrids.sitYMax = y;
            }
            crossWordGrids.SitLetters.push(letter);
            crossWordGrids.SitsWordsDic[JSON.stringify([x, y])] = letter;
            crossWordGrids.Sits.push({x: x, y: y});
            console.log({x: x, y : y});
        }
        crossWordGrids.sitWords.push(word);
    }
}

function placeOneWord(crossWord)
{
    console.log("placeOneWord");
    let possiblePositions = [];
    let commonLetterIndexes = [];
    for(let j = 0; j < crossWord.length; j++)
    {
        let letter = crossWord[j];
        for(let i = 0; i < crossWordGrids.SitLetters.length; i++)
        {
            console.log("字符对比", letter, crossWordGrids.SitLetters[i]);
            if(crossWordGrids.SitLetters[i] == letter)
            {
                
                commonLetterIndexes.push({sitLetterIndex: i, crossWordIndex: j});
                break;
            }
        }
    }
    if(commonLetterIndexes.length > 0)
    {
        console.log(commonLetterIndexes);
        console.log("有共同的字符");
        for(let i = 0; i < commonLetterIndexes.length; i++)
        {
            let commonLetterIndex = commonLetterIndexes[i].sitLetterIndex;
            let j = commonLetterIndexes[i].crossWordIndex;
            let direction = "h";
            let commonLetterX = crossWordGrids.Sits[commonLetterIndex].x;
            let commonLetterY = crossWordGrids.Sits[commonLetterIndex].y;
            console.log(crossWordGrids.Sits[commonLetterIndex]);
            if (direction == "h")
            {
                console.log("水平方向");
                for(let k = 0; k < crossWord.length; k++)
                {
                    let x = commonLetterX - (j - k);
                    let y = commonLetterY;
                    console.log({x: x, y : y});
                    let key = JSON.stringify([x, y]);
                    if(crossWordGrids.SitsWordsDic.hasOwnProperty(key))
                    {
                        if(crossWordGrids.SitsWordsDic[key] != crossWord[k])
                        {
                            possiblePositions = [];
                            direction = "v";
                            break;
                        }
                    }
                    possiblePositions.push({x:x, y:y});
                    console.log({x : x, y : y});
        
                }
                if(possiblePositions.length > 0)
                {
                    break;
                }
            }

            if (direction == "v")
            {
                console.log("垂直方向");
                for(let k = 0; k < crossWord.length; k++)
                {
                    let x = commonLetterX;
                    let y = commonLetterY - (j - k);
                    let key = JSON.stringify([x, y]);
                    if(crossWordGrids.SitsWordsDic.hasOwnProperty(key))
                    {
                        if(crossWordGrids.SitsWordsDic[key] != crossWord[k])
                        {
                            possiblePositions = [];
                            break;
                        }
                    }
                    possiblePositions.push({x:x, y:y});
                    console.log({x:x, y: y});
        
                } 
                if(possiblePositions.length > 0)
                {
                    break;
                }
            }
        }
        if(possiblePositions.length > 0)
        {
            console.log("找到了可以摆放的位置");
            for(let i = 0; i < crossWord.length; i++)
            {
                let x = possiblePositions[i].x;
                let y = possiblePositions[i].y;
                if (x < crossWordGrids.sitXMin)
                {
                    crossWordGrids.sitXMin = x;
                }
                else if (x > crossWordGrids.sitXMax)
                {
                    crossWordGrids.sitXMax = x;
                }
                if (y < crossWordGrids.sitYMin)
                {
                    crossWordGrids.sitYMin = y;
                }
                else if (y > crossWordGrids.sitYMax)
                {
                    crossWordGrids.sitYMax = y;
                }
                crossWordGrids.SitLetters.push(crossWord[i]);
                crossWordGrids.SitsWordsDic[JSON.stringify([x, y])] = crossWord[i];
                crossWordGrids.Sits.push(possiblePositions[i]);
            }
            crossWordGrids.sitWords.push(crossWord);
            
        }
        else
        {
            isolatedWord.push(crossWord);
            console.log("有共同字母，但是横竖无法摆放");
        }
    }
    else
    {
        isolatedWord.push(crossWord);
    }
    

}

function mouseMoved()
{
    if(score == 100)
    {
        reward.position(mouseX % windowWidth, windowHeight - 50);
    }
}

