// ==========================================
// FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// YOUR FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDDvF-IToSSARRUYImRBh9X17jvxRt2Pug",
    authDomain: "royal-ambassador-quiz.firebaseapp.com",
    projectId: "royal-ambassador-quiz",
    storageBucket: "royal-ambassador-quiz.firebasestorage.app",
    messagingSenderId: "521624674056",
    appId: "1:521624674056:web:342b4271bf8cad7dd916bd",
    measurementId: "G-RKHWXP78CX"
};


// ==========================================
// CONNECT TO FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==========================================
// QUIZ VARIABLES
// ==========================================

let questions = [];

let currentQuestion = 0;

let score = 0;


// ==========================================
// GET ELEMENTS FROM index.html
// ==========================================

const startScreen =
    document.getElementById("start-screen");

const quizScreen =
    document.getElementById("quiz-screen");

const resultScreen =
    document.getElementById("result-screen");

const startButton =
    document.getElementById("start-btn");

const nextButton =
    document.getElementById("next-btn");

const restartButton =
    document.getElementById("restart-btn");

const questionText =
    document.getElementById("question");

const questionNumber =
    document.getElementById("question-number");

const scoreText =
    document.getElementById("score");

const finalScore =
    document.getElementById("final-score");

const progressBar =
    document.getElementById("progress-bar");

const answerButtons =
    document.querySelectorAll(".answer-btn");


// ==========================================
// LOAD QUESTIONS FROM FIRESTORE
// ==========================================

async function loadQuestions() {

    try {

        const questionsCollection =
            collection(db, "Royal Ambassador");

        const snapshot =
            await getDocs(questionsCollection);

        questions = [];

        snapshot.forEach((doc) => {

            questions.push({
                id: doc.id,
                ...doc.data()
            });

        });

        console.log(
            "Questions loaded:",
            questions
        );


        if (questions.length === 0) {

            alert(
                "No questions were found in Firebase."
            );

            return;
        }


        console.log(
            `Loaded ${questions.length} question(s).`
        );

    } catch (error) {

        console.error(
            "Firebase error:",
            error
        );

        alert(
            "Could not load questions from Firebase. Check your Firestore rules and collection name."
        );
    }
}


// ==========================================
// START QUIZ
// ==========================================

startButton.addEventListener(
    "click",
    function () {

        if (questions.length === 0) {

            alert(
                "Questions are still loading. Please wait."
            );

            return;
        }


        currentQuestion = 0;

        score = 0;


        scoreText.textContent =
            "Score: 0";


        startScreen.classList.add(
            "hidden"
        );


        resultScreen.classList.add(
            "hidden"
        );


        quizScreen.classList.remove(
            "hidden"
        );


        showQuestion();

    }
);


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    const question =
        questions[currentQuestion];


    questionText.textContent =
        question.question;


    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    scoreText.textContent =
        `Score: ${score}`;


    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    answerButtons.forEach(
        (button) => {

            const optionName =
                button.dataset.option;


            button.textContent =
                question[optionName];


            button.disabled = false;


            button.classList.remove(
                "correct"
            );


            button.classList.remove(
                "wrong"
            );

        }
    );


    nextButton.classList.add(
        "hidden"
    );
}


// ==========================================
// CHECK ANSWER
// ==========================================

answerButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            function () {

                const selectedAnswer =
                    this.textContent;


                const correctAnswer =
                    questions[currentQuestion].answer;


                answerButtons.forEach(
                    (btn) => {

                        btn.disabled = true;


                        if (
                            btn.textContent.trim() ===
                            correctAnswer.trim()
                        ) {

                            btn.classList.add(
                                "correct"
                            );

                        }

                    }
                );


                if (
                    selectedAnswer.trim() ===
                    correctAnswer.trim()
                ) {

                    score++;

                    this.classList.add(
                        "correct"
                    );

                } else {

                    this.classList.add(
                        "wrong"
                    );

                }


                scoreText.textContent =
                    `Score: ${score}`;


                nextButton.classList.remove(
                    "hidden"
                );

            }
        );

    }
);


// ==========================================
// NEXT QUESTION
// ==========================================

nextButton.addEventListener(
    "click",
    function () {

        currentQuestion++;


        if (
            currentQuestion <
            questions.length
        ) {

            showQuestion();

        } else {

            showResults();

        }

    }
);


// ==========================================
// SHOW FINAL SCORE
// ==========================================

function showResults() {

    quizScreen.classList.add(
        "hidden"
    );


    resultScreen.classList.remove(
        "hidden"
    );


    finalScore.textContent =
        `You scored ${score} out of ${questions.length}.`;

}


// ==========================================
// RESTART QUIZ
// ==========================================

restartButton.addEventListener(
    "click",
    function () {

        currentQuestion = 0;

        score = 0;


        resultScreen.classList.add(
            "hidden"
        );


        quizScreen.classList.remove(
            "hidden"
        );


        showQuestion();

    }
);


// ==========================================
// START LOADING QUESTIONS
// ==========================================

loadQuestions();
