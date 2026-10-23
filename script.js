
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. USERNAME AND STORAGE
    // ==========================================

    const usernameForm = document.getElementById("usernameForm");
    const usernameInput = document.getElementById("usernameInput");
    const submitButton = document.querySelector(".submit-btn");

    let username = localStorage.getItem("username") || "";


    // ==========================================
    // 2. TYPING EFFECT
    // Works on both HTML pages
    // ==========================================

    let typingTimer;

    function typeText(element, text, speed = 80) {
        if (!element) return;

        clearTimeout(typingTimer);

        let index = 0;
        element.textContent = "";

        function typeNextCharacter() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;

                typingTimer = setTimeout(
                    typeNextCharacter,
                    speed
                );
            }
        }

        typeNextCharacter();
    }

    // Typing effect for index.html
    const welcomeHeading = document.querySelector(".welcome");

    if (welcomeHeading) {
        typeText(welcomeHeading, "Welcome!!", 120);
    }


    // ==========================================
    // 3. SAVE USERNAME ON THE WELCOME PAGE
    // ==========================================

    function saveUsername() {
        if (!usernameInput) return false;

        const enteredName = usernameInput.value.trim();

        if (enteredName === "") {
            usernameInput.focus();
            usernameInput.placeholder = "Please enter your name!";
            return false;
        }

        username = enteredName;
        localStorage.setItem("username", username);

        return true;
    }

    // Handle clicking the Submit link
    if (submitButton && usernameInput) {
        submitButton.addEventListener("click", (event) => {
            if (!saveUsername()) {
                event.preventDefault();
            }
        });
    }

    // Also support pressing Enter in the form
    if (usernameForm && usernameInput) {
        usernameForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (saveUsername()) {
                window.location.href = "./memory-game.html";
            }
        });
    }


    // ==========================================
    // 4. QUIZ HTML ELEMENTS
    // ==========================================

    const introScreen = document.getElementById("intro-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");

    const typingText = document.getElementById("typing-text");
    const startButton = document.getElementById("start-button");

    const questionCounter = document.getElementById("question-counter");
    const scoreDisplay = document.getElementById("score-display");
    const progressBar = document.getElementById("progress-bar");
    const questionText = document.getElementById("question-text");

    const answerOptions = document.getElementById("answer-options");
    const writtenAnswerArea = document.getElementById("written-answer-area");
    const writtenAnswer = document.getElementById("written-answer");

    const feedback = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");

    const finalScore = document.getElementById("final-score");
    const resultMessage = document.getElementById("result-message");
    const restartButton = document.getElementById("restart-button");


    // ==========================================
    // 5. PERSONALIZED TYPING ON THE QUIZ PAGE
    // ==========================================

    if (typingText) {
        const savedName = localStorage.getItem("username") || "Theo";

        typeText(
            typingText,
            `Welcome, ${savedName}!!`,
            100
        );
    }


    // ==========================================
    // 6. QUIZ QUESTIONS
    // ==========================================

    const questions = [
        {
            question: "Which month was Luna born?",
            choices: ["May", "August", "December"],
            correct: "May"
        },

        {
            question: "What is Luna's favorite color?",
            choices: ["Blue", "Yellow", "Purple"],
            correct: "Yellow"
        },

        {
            question: "Which hobby does Luna love to do?",
            choices: ["Crochet", "Playing chess", "Gardening"],
            correct: "Crochet"
        },

        {
            question: "What word does Luna like to call Theo?",
            choices: ["Penguin", "Donkey", "Potato"],
            correct: "Donkey"
        },

        {
            question: "Which flower does Luna love the most?",
            choices: ["Rose", "Sunflower", "Lily flower"],
            correct: "Lily flower"
        },

        {
            question: "Which animal does Luna hate the most?",
            choices: ["Spiders", "Lizards", "Snakes"],
            correct: "Spiders"
        },

        {
            question: "What's Luna's favorite ice cream flavor?",
            choices: ["Strawberry", "Mint chocolate chips", "Cookie and cream"],
            correct: "Mint chocolate chips"
        },

        {
            question: "What is Luna's love language?",
            choices: [
                "Gift giving",
                "Words of affirmation",
                "Physical touch"
            ],
            correct: "Physical touch"
        },

        {
            question: "What was your first impression of me when we started talking?",
            type: "written"
        },

        {
            question: "What's one thing you'd like us to do together someday?",
            type: "written"
        }
    ];


    // ==========================================
    // 7. QUIZ VARIABLES
    // ==========================================

    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    let selectedAnswer = null;


    // If this is index.html, stop here.
    // The welcome page doesn't contain quiz elements.
    if (!startButton) return;


    // ==========================================
    // 8. CONFETTI CELEBRATION 🎉
    // ==========================================

    function launchConfetti() {
        const colors = [
            "#F4B6C2", // Baby pink
            "#FFFFFF", // White
            "#D9C2A3", // Beige
            "#E8A0BF", // Rose pink
            "#F5D6A7"  // Soft gold
        ];

        // Remove any previous confetti
        document.querySelectorAll(".confetti-piece")
            .forEach(piece => piece.remove());

        // Create 100 pieces of confetti
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement("div");

            piece.classList.add("confetti-piece");

            piece.style.left = Math.random() * 100 + "vw";
            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];

            piece.style.width = (Math.random() * 8 + 5) + "px";
            piece.style.height = (Math.random() * 10 + 6) + "px";

            piece.style.animationDuration =
                (Math.random() * 2 + 3) + "s";

            piece.style.animationDelay =
                (Math.random() * 0.8) + "s";

            document.body.appendChild(piece);

            // Remove each piece after its animation finishes
            piece.addEventListener("animationend", () => {
                piece.remove();
            });
        }
    }


    // ==========================================
    // 9. START THE QUIZ
    // ==========================================

    startButton.addEventListener("click", () => {
        username = localStorage.getItem("username") || "Theo";

        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        answered = false;

        // Clear old confetti if the quiz is restarted
        document.querySelectorAll(".confetti-piece")
            .forEach(piece => piece.remove());

        introScreen.hidden = true;
        resultsScreen.hidden = true;
        quizScreen.hidden = false;

        showQuestion();
    });


    // ==========================================
    // 10. DISPLAY A QUESTION
    // ==========================================

    function showQuestion() {
        const current = questions[currentQuestion];

        answered = false;
        selectedAnswer = null;

        questionCounter.textContent =
            `Question ${currentQuestion + 1} of ${questions.length}`;

        scoreDisplay.textContent = `Score: ${score}`;

        progressBar.style.width =
            `${(currentQuestion / questions.length) * 100}%`;

        progressBar.parentElement.setAttribute(
            "aria-valuenow",
            currentQuestion
        );

        questionText.textContent = current.question;
        feedback.textContent = "";

        answerOptions.replaceChildren();

        writtenAnswer.value = "";
        writtenAnswer.disabled = false;

        answerOptions.hidden = true;
        writtenAnswerArea.hidden = true;

        nextButton.disabled = false;
        nextButton.textContent = "Check answer >";

        // Questions 9 and 10: written answers
        if (current.type === "written") {
            writtenAnswerArea.hidden = false;
        }

        // Questions 1 to 8: multiple choice
        else {
            answerOptions.hidden = false;

            // Shuffle the answer choices
            const shuffledChoices = [...current.choices];

            for (let i = shuffledChoices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [shuffledChoices[i], shuffledChoices[j]] =
                    [shuffledChoices[j], shuffledChoices[i]];
            }

            shuffledChoices.forEach((choice, index) => {
                const label = document.createElement("label");
                label.className = "answer-option";

                const radio = document.createElement("input");

                radio.type = "radio";
                radio.name = "quiz-answer";
                radio.value = choice;
                radio.id = `answer-${index}`;

                const text = document.createElement("span");
                text.textContent = choice;

                radio.addEventListener("change", () => {
                    selectedAnswer = choice;
                });

                label.append(radio, text);
                answerOptions.appendChild(label);
            });
        }
    }


    // ==========================================
    // 11. CHECK ANSWERS
    // ==========================================

    nextButton.addEventListener("click", () => {

        // Move forward after an answer has been checked
        if (answered) {
            currentQuestion++;

            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                showResults();
            }

            return;
        }

        const current = questions[currentQuestion];

        // Written questions
        if (current.type === "written") {
            if (writtenAnswer.value.trim() === "") {
                feedback.textContent =
                    `${username}, write something first! `;

                writtenAnswer.focus();
                return;
            }

            score++;

            feedback.textContent =
                `Answer accepted, ${username}! `;
        }

        // Multiple-choice questions
        else {
            if (selectedAnswer === null) {
                feedback.textContent =
                    `Choose an answer first, ${username}! `;

                return;
            }

            if (selectedAnswer === current.correct) {
                score++;

                feedback.textContent =
                    `Correct, ${username}! You know her!`;
            } else {
                feedback.textContent =
                    `Not quite, ${username}! The correct answer was ${current.correct}. `;
            }
        }

        // Lock the answer after checking
        answered = true;

        answerOptions.querySelectorAll("input").forEach(input => {
            input.disabled = true;
        });

        writtenAnswer.disabled = true;

        scoreDisplay.textContent = `Score: ${score}`;

        progressBar.style.width =
            `${((currentQuestion + 1) / questions.length) * 100}%`;

        progressBar.parentElement.setAttribute(
            "aria-valuenow",
            currentQuestion + 1
        );

        nextButton.textContent =
            currentQuestion === questions.length - 1
                ? "See your results "
                : "Next question →";
    });


    // ==========================================
    // 12. RESULTS SCREEN + CONFETTI 🎉
    // ==========================================

    function showResults() {
        quizScreen.hidden = true;
        resultsScreen.hidden = false;

        // 🎉 LET THE CONFETTI RAIN BEGIN!
        launchConfetti();

        const percentage = Math.round(
            (score / questions.length) * 100
        );

        finalScore.textContent =
            `${username}, you scored ${percentage}%! `;

        if (percentage === 100) {
            resultMessage.textContent =
                `PERFECT SCORE, ${username}!! You really know her!! 👀👌🏻`;

        } else if (percentage >= 70) {
            resultMessage.textContent =
                `Pretty good, ${username}! Luna would be proud of you. 🎉`;

        } else if (percentage >= 40) {
            resultMessage.textContent =
                `Hmmmm, ${username}... someone needs to pay more attention to Monkeyy! 💢`;

        } else {
            resultMessage.textContent =
                `${username.toUpperCase()}!! HELLO?? ARE YOU SURE YOU KNOW WHO LUNA IS?? 😭 GET OUTTT!`;
        }
    }


    // ==========================================
    // 13. RESTART THE QUIZ
    // ==========================================

    if (restartButton) {
        restartButton.addEventListener("click", () => {
            currentQuestion = 0;
            score = 0;
            selectedAnswer = null;
            answered = false;

            // Clean up any remaining confetti
            document.querySelectorAll(".confetti-piece")
                .forEach(piece => piece.remove());

            resultsScreen.hidden = true;
            quizScreen.hidden = true;
            introScreen.hidden = false;

            typeText(
                typingText,
                `Welcome back, ${username}!!`,
                100
            );
        });
    }

});



const envelope = document.getElementById("envelopeScene");
const hint = document.getElementById("envelopeHint");
const instruction = document.getElementById("envelopeInstruction");

if (envelope) {
    envelope.addEventListener("click", function () {
        if (envelope.classList.contains("opened")) {
            return;
        }

        envelope.classList.add("opened");

        if (hint) {
            hint.textContent = "Your answer, Theo.";
        }

        if (instruction) {
            instruction.textContent = "Made just for you.";
        }
    });
}

