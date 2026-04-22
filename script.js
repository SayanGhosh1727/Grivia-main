// Grivia Platform JavaScript

// Global Variables
let currentUser = null;
let quizData = [
  {
    question: "What percentage of plastic waste is actually recycled globally?",
    options: ["A) 50%", "B) 25%", "C) 9%", "D) 75%"],
    correct: 2,
  },
  {
    question: "Which activity saves the most water?",
    options: [
      "A) Taking shorter showers",
      "B) Fixing leaky faucets",
      "C) Using dishwasher",
      "D) Washing car less",
    ],
    correct: 1,
  },
];

let currentQuizQuestion = 0;
let quizScore = 0;
let userAnswers = [];

// Task data
const taskData = {
  tree: {
    title: "Plant a Tree",
    description:
      "Plant a sapling in your community. Take photos of the planting process, including before, during, and after shots. Provide location details and the type of tree planted.",
    points: 50,
  },
  waste: {
    title: "Waste Segregation",
    description:
      "Implement proper waste segregation for one week. Document your daily segregation process with photos showing different waste categories (organic, recyclable, non-recyclable).",
    points: 30,
  },
  energy: {
    title: "Energy Conservation",
    description:
      "Implement energy-saving practices in your home/school for one week. Track your energy usage reduction and document the methods you used (LED bulbs, turning off devices, etc.).",
    points: 40,
  },
};

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const quizContent = document.getElementById("quiz-content");
const quizPrevBtn = document.getElementById("quiz-prev");
const quizNextBtn = document.getElementById("quiz-next");
const quizSubmitBtn = document.getElementById("quiz-submit");
const quizResults = document.getElementById("quiz-results");
const quizScoreSpan = document.getElementById("quiz-score");
const taskModal = document.getElementById("taskModal");
const taskModalTitle = document.getElementById("taskModalTitle");
const taskDescription = document.getElementById("taskDescription");
const submitTaskBtn = document.getElementById("submitTask");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  checkUserSession();
});

// Initialize application
function initializeApp() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Initialize quiz
  initializeQuiz();

  // Initialize animations
  initializeAnimations();
}

// Setup event listeners
function setupEventListeners() {
  // Login form
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Signup form
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  // Quiz navigation
  if (quizPrevBtn) {
    quizPrevBtn.addEventListener("click", previousQuestion);
  }
  if (quizNextBtn) {
    quizNextBtn.addEventListener("click", nextQuestion);
  }
  if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener("click", submitQuiz);
  }

  // Task modal
  if (taskModal) {
    taskModal.addEventListener("show.bs.modal", handleTaskModalShow);
  }
  if (submitTaskBtn) {
    submitTaskBtn.addEventListener("click", handleTaskSubmit);
  }

  // Quiz options
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("quiz-option")) {
      selectQuizOption(e.target);
    }
  });

  // Navbar scroll effect
  window.addEventListener("scroll", handleNavbarScroll);
}

// Check user session
function checkUserSession() {
  // Simulate checking if user is logged in
  const userData = JSON.parse(
    sessionStorage.getItem("ecolearn_user") || "null"
  );
  if (userData) {
    currentUser = userData;
    updateNavbarForLoggedInUser();
  }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  }
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Animate cards on scroll
  document
    .querySelectorAll(".feature-card, .problem-card, .task-card, .process-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
}

// Login functionality
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Logging in...";
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // In a real app, validate credentials with backend
    if (email && password) {
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split("@")[0],
        role: "student",
        ecoPoints: 0,
        badges: [],
        tasksCompleted: 0,
      };

      currentUser = userData;
      sessionStorage.setItem("ecolearn_user", JSON.stringify(userData));

      // Close modal and redirect to dashboard
      bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
      showSuccessMessage("Login successful! Welcome to EcoLearn!");
      updateNavbarForLoggedInUser();

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showErrorMessage("Please enter valid credentials.");
    }

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1000);
}

// Signup functionality
function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const role = document.getElementById("signupRole").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;

  // Validation
  if (password !== confirmPassword) {
    showErrorMessage("Passwords do not match!");
    return;
  }

  if (password.length < 6) {
    showErrorMessage("Password must be at least 6 characters long!");
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Creating Account...";
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    const userData = {
      id: Date.now(),
      name: name,
      email: email,
      role: role,
      ecoPoints: 0,
      badges: [],
      tasksCompleted: 0,
      joinDate: new Date().toISOString(),
    };

    currentUser = userData;
    sessionStorage.setItem("ecolearn_user", JSON.stringify(userData));

    // Close modal and show success
    bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
    showSuccessMessage("Account created successfully! Welcome to EcoLearn!");
    updateNavbarForLoggedInUser();

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

    // Reset form
    signupForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

// Update navbar for logged in user
function updateNavbarForLoggedInUser() {
  const navbarNav = document.querySelector(".navbar-nav:last-child");
  if (navbarNav && currentUser) {
    navbarNav.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    ${currentUser.name} (${currentUser.ecoPoints} points)
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="dashboard.html">Dashboard</a></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                </ul>
            </div>
        `;
  }
}

// Logout functionality
function logout() {
  currentUser = null;
  sessionStorage.removeItem("ecolearn_user");
  location.reload();
}

// Quiz functionality
function initializeQuiz() {
  displayQuestion(0);
  updateQuizNavigation();
}

function displayQuestion(index) {
  const questions = document.querySelectorAll(".quiz-question");
  questions.forEach((q, i) => {
    q.classList.toggle("active", i === index);
  });

  // Update question content if needed
  const currentQ = questions[index];
  if (currentQ) {
    const options = currentQ.querySelectorAll(".quiz-option");
    options.forEach((option, i) => {
      option.classList.remove("selected", "correct", "incorrect");
      if (userAnswers[index] === i) {
        option.classList.add("selected");
      }
    });
  }
}

function selectQuizOption(option) {
  const question = option.closest(".quiz-question");
  const questionIndex = parseInt(question.dataset.question);
  const optionIndex = Array.from(option.parentNode.children).indexOf(option);

  // Clear previous selection
  question.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.classList.remove("selected");
  });

  // Select current option
  option.classList.add("selected");
  userAnswers[questionIndex] = optionIndex;

  updateQuizNavigation();
}

function previousQuestion() {
  if (currentQuizQuestion > 0) {
    currentQuizQuestion--;
    displayQuestion(currentQuizQuestion);
    updateQuizNavigation();
  }
}

function nextQuestion() {
  if (currentQuizQuestion < quizData.length - 1) {
    currentQuizQuestion++;
    displayQuestion(currentQuizQuestion);
    updateQuizNavigation();
  }
}

function updateQuizNavigation() {
  quizPrevBtn.disabled = currentQuizQuestion === 0;

  if (currentQuizQuestion === quizData.length - 1) {
    quizNextBtn.style.display = "none";
    quizSubmitBtn.style.display = "inline-block";
  } else {
    quizNextBtn.style.display = "inline-block";
    quizSubmitBtn.style.display = "none";
  }
}

function submitQuiz() {
  // Calculate score
  quizScore = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizData[index].correct) {
      quizScore++;
    }
  });

  // Show results
  quizScoreSpan.textContent = quizScore;
  quizResults.style.display = "block";
  document.getElementById("quiz-content").style.display = "none";
  document.querySelector(".quiz-controls").style.display = "none";

  // Update user points if logged in
  if (currentUser) {
    currentUser.ecoPoints += 25;
    sessionStorage.setItem("ecolearn_user", JSON.stringify(currentUser));
    updateNavbarForLoggedInUser();
  }

  showSuccessMessage("Quiz completed! You earned 25 Eco Points!");
}

// Task functionality
function handleTaskModalShow(event) {
  const button = event.relatedTarget;
  const taskType = button.getAttribute("data-task");
  const task = taskData[taskType];

  if (task) {
    taskModalTitle.textContent = task.title;
    taskDescription.textContent = task.description;
    submitTaskBtn.setAttribute("data-task", taskType);
    submitTaskBtn.setAttribute("data-points", task.points);
  }
}

function handleTaskSubmit() {
  const taskType = submitTaskBtn.getAttribute("data-task");
  const points = parseInt(submitTaskBtn.getAttribute("data-points"));
  const proofFile = document.getElementById("taskProof").files[0];
  const notes = document.getElementById("taskNotes").value;

  if (!proofFile) {
    showErrorMessage("Please upload proof of your task completion.");
    return;
  }

  if (!notes.trim()) {
    showErrorMessage("Please provide additional notes about your task.");
    return;
  }

  // Show loading state
  submitTaskBtn.textContent = "Submitting...";
  submitTaskBtn.disabled = true;

  // Simulate task submission
  setTimeout(() => {
    // Update user data if logged in
    if (currentUser) {
      currentUser.ecoPoints += points;
      currentUser.tasksCompleted += 1;
      sessionStorage.setItem("ecolearn_user", JSON.stringify(currentUser));
      updateNavbarForLoggedInUser();
    }

    // Close modal and show success
    bootstrap.Modal.getInstance(taskModal).hide();
    showSuccessMessage(
      `Task submitted successfully! You earned ${points} Eco Points!`
    );

    // Reset form
    document.getElementById("taskProof").value = "";
    document.getElementById("taskNotes").value = "";
    submitTaskBtn.textContent = "Submit Task";
    submitTaskBtn.disabled = false;
  }, 2000);
}

// Utility functions
function showSuccessMessage(message) {
  showMessage(message, "success");
}

function showErrorMessage(message) {
  showMessage(message, "error");
}

function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(
    ".success-message, .error-message"
  );
  existingMessages.forEach((msg) => msg.remove());

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className =
    type === "success" ? "success-message" : "error-message";
  messageDiv.textContent = message;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "100px";
  messageDiv.style.left = "50%";
  messageDiv.style.transform = "translateX(-50%)";
  messageDiv.style.zIndex = "9999";
  messageDiv.style.minWidth = "300px";
  messageDiv.style.textAlign = "center";

  document.body.appendChild(messageDiv);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Additional utility functions for future features
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateUserId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export functions for use in other files
window.EcoLearn = {
  showSuccessMessage,
  showErrorMessage,
  currentUser: () => currentUser,
  logout,
};
