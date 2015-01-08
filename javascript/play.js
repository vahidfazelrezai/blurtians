"use strict";

/*jslint browser:true */


// TIMER
var timePassed; // in milliseconds
var timeTotal; // in milliseconds
var timerID;
var timerInterval = 100; // in milliseconds
var timerDisplayText;
var giveFiveWarning;

// QUESTION
// array of questions
var curRound;
// index (1 to 50) of current question
var questionIndex;
//question information
var roundNum; // string
var questionNum; // integer
var questionLevel; // "toss_up" or "bonus"
var questionSubject; // "biology", "chemistry", "earth_space", "energy", "general", "physics", or "math"
var questionType; // "short_answer" or "multiple_choice"
var questionText; // text
// SA answer
var answer;
// MC answer
var choiceW;
var choiceX;
var choiceY;
var choiceZ;
var choiceCorrect;
// text determined in updateQuestion
var questionInfo;
var choicesEnabled;
var isInterrupt;





/* **********STATS********** */

function recordResult(result) {
//    document.getElementById("title").innerHTML = result;
}



/* **********SOUND********** */
// Note: The function soundPlay is copied from http://stackoverflow.com/a/187415.

var soundEmbed = null;

function soundPlay(sound_name) {
    
    if (!soundEmbed) {
        soundEmbed = document.createElement("embed");
        soundEmbed.setAttribute("src", "/mp3/"+sound_name+".mp3");
        soundEmbed.setAttribute("hidden", true);
        soundEmbed.setAttribute("autostart", true);
    } else {
        document.body.removeChild(soundEmbed);
        soundEmbed.removed = true;
        soundEmbed = null;
        soundEmbed = document.createElement("embed");
        soundEmbed.setAttribute("src", "/mp3/"+sound_name+".mp3");
        soundEmbed.setAttribute("hidden", true);
        soundEmbed.setAttribute("autostart", true);
    }
    
    soundEmbed.removed = false;
    document.body.appendChild(soundEmbed);
}





/* **********TIMER********** */


function timerUpdateDisplay() {
    timerDisplayText = (timeTotal - timePassed) / 1000;

    // Adds .0 if necessary (ONLY WORKS FOR INTERVAL=100ms !!)
    if ((timeTotal - timePassed) % 1000 === 0) {
        timerDisplayText += ".0";
    }

    document.getElementById("timer_display").innerHTML = timerDisplayText;
}

function timerStop() {
    clearInterval(timerID);

    document.getElementById("timer_display").style.display = "none";
    document.getElementById("timer_prompt").style.display = "block";

}

function timerTick() {
    timePassed += timerInterval;
    timerUpdateDisplay();

    if ((timePassed >= timeTotal - 5600) && (giveFiveWarning === true)) {
        soundPlay("fiveseconds");
        giveFiveWarning = false;
    }

    if (timePassed >= timeTotal) {
        soundPlay("time");
        timerStop();
    }
}

function timerStart() {
    if (questionLevel === "toss_up") {
        giveFiveWarning = false;
        timeTotal = 5000;
    } else {
        giveFiveWarning = true;
        timeTotal = 20000;
    }

    document.getElementById("timer_display").innerHTML = (timeTotal / 1000) + ".0";
    timerID = setInterval(function () { timerTick(); }, timerInterval);
    timePassed = 0;

    document.getElementById("timer_display").style.display = "block";
    document.getElementById("timer_button").style.display = "none";
    document.getElementById("timer_prompt").style.display = "none";
}





/* **********QUESTION********** */



function loadRound() {
    var xmlhttp, xmlDoc, fileURL;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    fileURL = "xml/round" + roundNum + ".xml";
    xmlhttp.open("GET", fileURL, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    curRound = xmlDoc.getElementsByTagName("fullq");
}


function loadQuestion() {

    questionIndex += 1;

    questionNum = (questionIndex - (questionIndex % 2)) / 2 + 1;

    if ((questionIndex % 2) === 0) {
        questionLevel = "toss_up";
    } else {
        questionLevel = "bonus";
    }

    questionSubject = curRound[questionIndex].getElementsByTagName("subject")[0].childNodes[0].nodeValue;
    questionType = curRound[questionIndex].getElementsByTagName("type")[0].childNodes[0].nodeValue;
    questionText = curRound[questionIndex].getElementsByTagName("question")[0].childNodes[0].nodeValue;
    if (questionType === "short_answer") {
        answer = curRound[questionIndex].getElementsByTagName("answer")[0].childNodes[0].nodeValue;
    } else {
        choiceW = curRound[questionIndex].getElementsByTagName("w_choice")[0].childNodes[0].nodeValue;
        choiceX = curRound[questionIndex].getElementsByTagName("x_choice")[0].childNodes[0].nodeValue;
        choiceY = curRound[questionIndex].getElementsByTagName("y_choice")[0].childNodes[0].nodeValue;
        choiceZ = curRound[questionIndex].getElementsByTagName("z_choice")[0].childNodes[0].nodeValue;
        choiceCorrect = curRound[questionIndex].getElementsByTagName("answer_choice")[0].childNodes[0].nodeValue;
    }
}

// updates question display
function updateQuestion() {

    questionInfo = "<i>Set " + roundNum.charAt(0) + ", Round " + roundNum.substring(1) + ", Question #" + questionNum + "</i><br><b>";


    if (questionLevel === "toss_up") {
        questionInfo += "Toss Up";
        document.getElementById("blurt_button").style.display = "block";
        document.getElementById("interrupt_button").style.display = "block";
    } else if (questionLevel === "bonus") {
        questionInfo += "Bonus";
    }

    questionInfo +=  " &mdash; ";

    if (questionSubject === "biology") {
        questionInfo += "Biology";
    } else if (questionSubject === "chemistry") {
        questionInfo += "Chemistry";
    } else if (questionSubject === "earth_space") {
        questionInfo += "Earth and Space Science";
    } else if (questionSubject === "energy") {
        questionInfo += "Energy";
    } else if (questionSubject === "general") {
        questionInfo += "General Science";
    } else if (questionSubject === "physics") {
        questionInfo += "Physics";
    } else if (questionSubject === "math") {
        questionInfo += "Math";
    }

    questionInfo += " &mdash; ";

    if (questionType === "multiple_choice") {
        questionInfo += "Multiple Choice";

        document.getElementById("SA_answer").style.display = "none";
        document.getElementById("MC_answer").style.display = "inline-block";

        document.getElementById("choice_w").innerHTML = "<pre>W) </pre>" + choiceW;
        document.getElementById("choice_x").innerHTML = "<pre>X) </pre>" + choiceX;
        document.getElementById("choice_y").innerHTML = "<pre>Y) </pre>" + choiceY;
        document.getElementById("choice_z").innerHTML = "<pre>Z) </pre>" + choiceZ;
    } else if (questionType === "short_answer") {
        questionInfo += "Short Answer";
        document.getElementById("SA_answer").style.display = "block";
        document.getElementById("show_button").style.display = "block";

        document.getElementById("MC_answer").style.display = "none";

        document.getElementById("answer_display").innerHTML = "<i>Answer:</i> " + answer;
    }

    questionInfo += "</b>";

    document.getElementById("question_info").innerHTML = questionInfo;
    document.getElementById("question_text").innerHTML = questionText;

    isInterrupt = false;
}

function nextQuestion() {
    if (questionIndex === 49) {
        document.getElementById("play_button").style.display = "block";
        document.getElementById("select_prompt").style.display = "block";
        document.getElementById("select_round").style.display = "block";
        document.getElementById("instructions").style.display = "block";

        document.getElementById("timer").style.visibility = "hidden";
        document.getElementById("question_info").style.visibility = "hidden";
        document.getElementById("question_text").style.visibility = "hidden";
        document.getElementById("result").style.display = "none";

        return;
    }

    loadQuestion();
    updateQuestion();

    choicesEnabled = true;

    document.getElementById("choice_w").style.backgroundColor = "#EEEEEE";
    document.getElementById("choice_x").style.backgroundColor = "#EEEEEE";
    document.getElementById("choice_y").style.backgroundColor = "#EEEEEE";
    document.getElementById("choice_z").style.backgroundColor = "#EEEEEE";

    document.getElementById("timer").style.visibility = "visible";
    document.getElementById("question_info").style.visibility = "visible";
    document.getElementById("question_text").style.visibility = "visible";
    document.getElementById("result").style.display = "none";

    document.getElementById("timer_button").style.display = "block";
    document.getElementById("timer_display").style.display = "none";
    document.getElementById("timer_prompt").style.display = "none";

    document.getElementById("interrupt_display").style.display = "none";

}


function startPlay() {
    document.getElementById("play_button").style.display = "none";
    document.getElementById("select_prompt").style.display = "none";
    document.getElementById("select_round").style.display = "none";
    document.getElementById("instructions").style.display = "none";

    roundNum = document.getElementById("select_round").options[document.getElementById("select_round").selectedIndex].value;
    questionIndex = -1;
    loadRound(roundNum);
    nextQuestion();
}


function choiceOver(choice_id) {
    if (choicesEnabled) {
        document.getElementById(choice_id).style.backgroundColor = "#FEE6CC";
        document.getElementById(choice_id).style.borderColor = "#990000";
        document.getElementById(choice_id).style.cursor = "pointer";
    }
}

function choiceOut(choice_id) {
    if (choicesEnabled) {
        document.getElementById(choice_id).style.backgroundColor = "#EEEEEE";
        document.getElementById(choice_id).style.borderColor = "#EEEEEE";
        document.getElementById(choice_id).style.cursor = "default";
    }
}



function showAnswer() {
    document.getElementById("SA_answer").style.display = "block";
    document.getElementById("show_button").style.display = "none";
    document.getElementById("answer_display").style.display = "block";
    document.getElementById("correct_button").style.display = "block";
    document.getElementById("incorrect_button").style.display = "block";
}


function interruptClick() {
    isInterrupt = true;
    document.getElementById("interrupt_display").style.display = "block";
    document.getElementById("timer").style.visibility = "hidden";
    document.getElementById("interrupt_button").style.display = "none";
    clearInterval(timerID);
}



function endQuestion(result) {

    clearInterval(timerID);
    choicesEnabled = false;

    document.getElementById("SA_answer").style.display = "none";
    document.getElementById("show_button").style.display = "none";
    document.getElementById("answer_display").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("correct_button").style.display = "none";
    document.getElementById("incorrect_button").style.display = "none";
    document.getElementById("timer").style.visibility = "hidden";
    document.getElementById("blurt_button").style.display = "none";
    document.getElementById("interrupt_button").style.display = "none";
    document.getElementById("next_button").style.display = "block";
    document.getElementById("interrupt_display").style.display = "none";

    if (result === "time") {
        document.getElementById("result_display").innerHTML = "Answered too slowly!";
    } else if (result === "correct") {
        soundPlay("thatiscorrect");
        document.getElementById("result_display").innerHTML = "That is correct!";
    } else if (result === "incorrect") {
        soundPlay("thatisincorrect");
        document.getElementById("result_display").innerHTML = "That is incorrect.";
    } else if (result === "blurt") {
        document.getElementById("result_display").innerHTML = "Four points for the other team...";
    }

    if (isInterrupt === true) {
        recordResult("interrupt-" + result);
    } else {
        recordResult(result);
    }


}

function checkAnswer(choice) {

    if (choiceCorrect === "W") {
        document.getElementById("choice_w").style.backgroundColor = "#88FF88";
        document.getElementById("choice_w").style.borderColor = "#EEEEEE";
        document.getElementById("choice_w").style.cursor = "default";
    } else if (choiceCorrect === "X") {
        document.getElementById("choice_x").style.backgroundColor = "#88FF88";
        document.getElementById("choice_x").style.borderColor = "#EEEEEE";
        document.getElementById("choice_x").style.cursor = "default";
    } else if (choiceCorrect === "Y") {
        document.getElementById("choice_y").style.backgroundColor = "#88FF88";
        document.getElementById("choice_y").style.borderColor = "#EEEEEE";
        document.getElementById("choice_y").style.cursor = "default";
    } else if (choiceCorrect === "Z") {
        document.getElementById("choice_z").style.backgroundColor = "#88FF88";
        document.getElementById("choice_z").style.borderColor = "#EEEEEE";
        document.getElementById("choice_z").style.cursor = "default";
    }

    if (choice === choiceCorrect) {
        endQuestion("correct");
    } else {
        endQuestion("incorrect");
        if (choice === "W") {
            document.getElementById("choice_w").style.backgroundColor = "#FF8888";
            document.getElementById("choice_w").style.borderColor = "#EEEEEE";
            document.getElementById("choice_w").style.cursor = "default";
        } else if (choice === "X") {
            document.getElementById("choice_x").style.backgroundColor = "#FF8888";
            document.getElementById("choice_x").style.borderColor = "#EEEEEE";
            document.getElementById("choice_x").style.cursor = "default";
        } else if (choice === "Y") {
            document.getElementById("choice_y").style.backgroundColor = "#FF8888";
            document.getElementById("choice_y").style.borderColor = "#EEEEEE";
            document.getElementById("choice_y").style.cursor = "default";
        } else if (choice === "Z") {
            document.getElementById("choice_z").style.backgroundColor = "#FF8888";
            document.getElementById("choice_z").style.borderColor = "#EEEEEE";
            document.getElementById("choice_z").style.cursor = "default";
        }
    }
}


function choiceClick(choice) {
    if (choicesEnabled) {
        checkAnswer(choice);
    }
}