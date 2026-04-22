// Dashboard JavaScript for EcoLearn Platform

// Global Dashboard Variables
let dashboardData = {
  user: null,
  leaderboard: [],
  badges: [],
  recentTasks: [],
  modules: [],
};

// Sample data
const sampleLeaderboard = [
  {
    id: 1,
    name: "Alex Chen",
    school: "Green Valley High",
    points: 1250,
    avatar: "AC",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    school: "Eco Academy",
    points: 1180,
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    school: "Nature's Edge School",
    points: 1150,
    avatar: "MR",
  },
  {
    id: 4,
    name: "Emma Thompson",
    school: "Sustainable Studies",
    points: 1100,
    avatar: "ET",
  },
  {
    id: 5,
    name: "David Kim",
    school: "Environmental High",
    points: 1050,
    avatar: "DK",
  },
];

const availableBadges = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first environmental task",
    icon: "fas fa-baby",
    category: "tasks",
    requirement: "Complete 1 task",
    progress: 0,
    maxProgress: 1,
    earned: false,
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Complete your first learning module",
    icon: "fas fa-book",
    category: "learning",
    requirement: "Complete 1 module",
    progress: 0,
    maxProgress: 1,
    earned: false,
  },
  {
    id: "tree-planter",
    title: "Tree Planter",
    description: "Plant your first tree",
    icon: "fas fa-tree",
    category: "tasks",
    requirement: "Plant 1 tree",
    progress: 0,
    maxProgress: 1,
    earned: false,
  },
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Reach 500 Eco Points",
    icon: "fas fa-shield-alt",
    category: "special",
    requirement: "500 Eco Points",
    progress: 0,
    maxProgress: 500,
    earned: false,
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Invite 5 friends to join EcoLearn",
    icon: "fas fa-users",
    category: "social",
    requirement: "Invite 5 friends",
    progress: 0,
    maxProgress: 5,
    earned: false,
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 30-day activity streak",
    icon: "fas fa-fire",
    category: "special",
    requirement: "30 day streak",
    progress: 0,
    maxProgress: 30,
    earned: false,
  },
];

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
  setupDashboardEventListeners();
  loadDashboardData();
});

function initializeDashboard() {
  // Check if user is logged in
  const userData = JSON.parse(
    sessionStorage.getItem("ecolearn_user") || "null"
  );
  if (!userData) {
    // Redirect to login if not logged in
    window.location.href = "index.html";
    return;
  }

  dashboardData.user = userData;
  updateUserNavbar();
  populateUserStats();
  initializeDashboardNavigation();
}

function setupDashboardEventListeners() {
  // Navigation for dashboard sections
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("href").substring(1);
      showDashboardSection(targetSection);

      // Update active nav link
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Quick action cards
  document.querySelectorAll(".quick-action-card").forEach((card) => {
    card.addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      handleQuickAction(action);
    });
  });

  // Leaderboard filters
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      updateLeaderboardFilter(filter);

      // Update active filter
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Achievement category filters
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      updateBadgeCategory(category);

      // Update active category
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Task modal setup (reuse from main script)
  const taskModal = document.getElementById("taskModal");
  if (taskModal) {
    taskModal.addEventListener("show.bs.modal", handleTaskModalShow);
  }

  const submitTaskBtn = document.getElementById("submitTask");
  if (submitTaskBtn) {
    submitTaskBtn.addEventListener("click", handleDashboardTaskSubmit);
  }
}

function updateUserNavbar() {
  const userNav = document.getElementById("userNav");
  if (userNav && dashboardData.user) {
    userNav.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    ${dashboardData.user.name} (${
      dashboardData.user.ecoPoints || 0
    } pts)
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#profile">Profile</a></li>
                    <li><a class="dropdown-item" href="#settings">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                </ul>
            </div>
        `;
  }
}

function populateUserStats() {
  const user = dashboardData.user;
  if (!user) return;

  // Update welcome section
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userPoints").textContent = user.ecoPoints || 0;
  document.getElementById("tasksCompleted").textContent =
    user.tasksCompleted || 0;
  document.getElementById("userBadges").textContent = user.badges
    ? user.badges.length
    : 0;

  // Calculate user rank (mock calculation)
  const userRank = Math.floor(Math.random() * 100) + 1;
  document.getElementById("userRank").textContent = `#${userRank}`;

  // Update progress bars
  updateProgressBars();

  // Update streak
  document.getElementById("currentStreak").textContent =
    user.streak || Math.floor(Math.random() * 15) + 1;

  // Update leaderboard user info
  document.getElementById("currentUserRank").textContent = userRank;
  document.getElementById("leaderboardPoints").textContent =
    user.ecoPoints || 0;
}

function updateProgressBars() {
  const user = dashboardData.user;

  // Modules progress (mock data)
  const modulesCompleted = Math.floor(Math.random() * 5);
  const modulesProgress = (modulesCompleted / 10) * 100;
  document.getElementById("modulesCompleted").textContent = modulesCompleted;
  document.getElementById("modulesProgress").style.width =
    modulesProgress + "%";

  // Tasks progress
  const tasksCompleted = user.tasksCompleted || 0;
  const tasksProgress = (tasksCompleted / 20) * 100;
  document.getElementById("tasksProgressCount").textContent = tasksCompleted;
  document.getElementById("tasksProgress").style.width = tasksProgress + "%";

  // Quizzes progress (mock data)
  const quizzesCompleted = Math.floor(Math.random() * 8);
  const quizzesProgress = (quizzesCompleted / 15) * 100;
  document.getElementById("quizzesCompleted").textContent = quizzesCompleted;
  document.getElementById("quizzesProgress").style.width =
    quizzesProgress + "%";
}

function initializeDashboardNavigation() {
  // Show dashboard section by default
  showDashboardSection("dashboard");
}

function showDashboardSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.style.display = "none";
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";

    // Load section-specific data
    switch (sectionId) {
      case "leaderboard":
        loadLeaderboard();
        break;
      case "achievements":
        loadBadges();
        break;
      case "tasks":
        loadRecentTasks();
        break;
    }
  }
}

function handleQuickAction(action) {
  switch (action) {
    case "learning":
      showDashboardSection("learning");
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      document.querySelector('[href="#learning"]').classList.add("active");
      break;
    case "tasks":
      showDashboardSection("tasks");
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      document.querySelector('[href="#tasks"]').classList.add("active");
      break;
    case "quiz":
      window.location.href = "index.html#quiz-section";
      break;
    case "leaderboard":
      showDashboardSection("leaderboard");
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      document.querySelector('[href="#leaderboard"]').classList.add("active");
      break;
  }
}

function loadDashboardData() {
  // Simulate loading data
  dashboardData.leaderboard = sampleLeaderboard;
  dashboardData.badges = availableBadges;

  // Update user badges based on progress
  updateUserBadges();
}

function updateUserBadges() {
  const user = dashboardData.user;
  if (!user) return;

  dashboardData.badges.forEach((badge) => {
    switch (badge.id) {
      case "first-steps":
        badge.progress = Math.min(user.tasksCompleted || 0, 1);
        badge.earned = badge.progress >= 1;
        break;
      case "eco-warrior":
        badge.progress = Math.min(user.ecoPoints || 0, 500);
        badge.earned = badge.progress >= 500;
        break;
      case "streak-master":
        badge.progress = Math.min(user.streak || 0, 30);
        badge.earned = badge.progress >= 30;
        break;
    }
  });
}

function loadLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  let html = "";
  dashboardData.leaderboard.forEach((user, index) => {
    html += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-avatar">${user.avatar}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-school">${user.school}</div>
                </div>
                <div class="leaderboard-points">${user.points}</div>
            </div>
        `;
  });

  leaderboardList.innerHTML = html;
}

function updateLeaderboardFilter(filter) {
  // In a real app, this would filter the leaderboard data
  console.log("Filtering leaderboard by:", filter);
  loadLeaderboard(); // Reload with filtered data
}

function loadBadges() {
  const badgesContainer = document.getElementById("badgesContainer");
  if (!badgesContainer) return;

  let html = "";
  dashboardData.badges.forEach((badge) => {
    const progressPercentage = (badge.progress / badge.maxProgress) * 100;
    const cardClass = badge.earned ? "earned" : "locked";
    const iconClass = badge.earned ? "earned" : "locked";

    html += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="badge-card ${cardClass}">
                    <div class="badge-icon ${iconClass}">
                        <i class="${badge.icon}"></i>
                    </div>
                    <div class="badge-title">${badge.title}</div>
                    <div class="badge-description">${badge.description}</div>
                    <div class="badge-progress">
                        <div class="badge-progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="badge-requirement">${badge.requirement}</div>
                </div>
            </div>
        `;
  });

  badgesContainer.innerHTML = html;
}

function updateBadgeCategory(category) {
  const filteredBadges =
    category === "all"
      ? dashboardData.badges
      : dashboardData.badges.filter((badge) => badge.category === category);

  const badgesContainer = document.getElementById("badgesContainer");
  if (!badgesContainer) return;

  let html = "";
  filteredBadges.forEach((badge) => {
    const progressPercentage = (badge.progress / badge.maxProgress) * 100;
    const cardClass = badge.earned ? "earned" : "locked";
    const iconClass = badge.earned ? "earned" : "locked";

    html += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="badge-card ${cardClass}">
                    <div class="badge-icon ${iconClass}">
                        <i class="${badge.icon}"></i>
                    </div>
                    <div class="badge-title">${badge.title}</div>
                    <div class="badge-description">${badge.description}</div>
                    <div class="badge-progress">
                        <div class="badge-progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="badge-requirement">${badge.requirement}</div>
                </div>
            </div>
        `;
  });

  badgesContainer.innerHTML = html;
}

function loadRecentTasks() {
  const recentTasksTable = document.getElementById("recentTasks");
  if (!recentTasksTable) return;

  // Sample recent tasks data
  const recentTasks = [
    {
      name: "Plant a Tree",
      date: "2024-01-15",
      status: "approved",
      points: 50,
    },
    {
      name: "Waste Segregation",
      date: "2024-01-10",
      status: "pending",
      points: 30,
    },
    {
      name: "Energy Conservation",
      date: "2024-01-08",
      status: "approved",
      points: 40,
    },
  ];

  let html = "";
  if (recentTasks.length === 0) {
    html =
      '<tr><td colspan="4" class="text-center text-muted">No tasks submitted yet</td></tr>';
  } else {
    recentTasks.forEach((task) => {
      const statusClass = `status-${task.status}`;
      const statusText =
        task.status.charAt(0).toUpperCase() + task.status.slice(1);

      html += `
                <tr>
                    <td>${task.name}</td>
                    <td>${new Date(task.date).toLocaleDateString()}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${
                      task.status === "approved" ? "+" + task.points : "-"
                    }</td>
                </tr>
            `;
    });
  }

  recentTasksTable.innerHTML = html;
}

// Module Functions
function startModule(moduleType) {
  showSuccessMessage(
    `Starting ${moduleType} module! This feature will be available soon.`
  );
}

// Task Functions
function startTask(taskType) {
  // Open task modal with specific task data
  const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
  const taskData = {
    tree: {
      title: "Plant a Tree",
      description:
        "Plant a sapling in your community. Take photos of the planting process, including before, during, and after shots. Provide location details and the type of tree planted.",
      points: 50,
    },
    waste: {
      title: "Waste Segregation Challenge",
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

  const task = taskData[taskType];
  if (task) {
    document.getElementById("taskModalTitle").textContent = task.title;
    document.getElementById("taskDescription").textContent = task.description;
    document.getElementById("submitTask").setAttribute("data-task", taskType);
    document
      .getElementById("submitTask")
      .setAttribute("data-points", task.points);
  }

  taskModal.show();
}

function handleDashboardTaskSubmit() {
  const taskType = document
    .getElementById("submitTask")
    .getAttribute("data-task");
  const points = parseInt(
    document.getElementById("submitTask").getAttribute("data-points")
  );
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
  const submitBtn = document.getElementById("submitTask");
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  // Simulate task submission
  setTimeout(() => {
    // Update user data
    dashboardData.user.ecoPoints += points;
    dashboardData.user.tasksCompleted += 1;
    sessionStorage.setItem("ecolearn_user", JSON.stringify(dashboardData.user));

    // Update UI
    populateUserStats();
    updateUserNavbar();
    updateUserBadges();

    // Close modal and show success
    bootstrap.Modal.getInstance(document.getElementById("taskModal")).hide();
    showSuccessMessage(
      `Task submitted successfully! You earned ${points} Eco Points!`
    );

    // Reset form
    document.getElementById("taskProof").value = "";
    document.getElementById("taskNotes").value = "";
    submitBtn.textContent = "Submit Task";
    submitBtn.disabled = false;

    // Refresh recent tasks if on tasks section
    if (document.getElementById("tasks").style.display !== "none") {
      loadRecentTasks();
    }
  }, 2000);
}

// Utility Functions
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
  messageDiv.style.borderRadius = "10px";
  messageDiv.style.padding = "1rem";
  messageDiv.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.15)";

  document.body.appendChild(messageDiv);

  // Add animation
  messageDiv.style.opacity = "0";
  messageDiv.style.transform = "translateX(-50%) translateY(-20px)";
  setTimeout(() => {
    messageDiv.style.transition = "all 0.3s ease";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    messageDiv.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

function logout() {
  sessionStorage.removeItem("ecolearn_user");
  window.location.href = "index.html";
}

// Animation Functions
function animateProgressBar(element, targetWidth) {
  let width = 0;
  const increment = targetWidth / 20;
  const interval = setInterval(() => {
    width += increment;
    element.style.width = width + "%";
    if (width >= targetWidth) {
      clearInterval(interval);
    }
  }, 50);
}

function animateCountUp(element, targetNumber) {
  let current = 0;
  const increment = targetNumber / 20;
  const interval = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    if (current >= targetNumber) {
      element.textContent = targetNumber;
      clearInterval(interval);
    }
  }, 50);
}

// Data Management Functions
function saveUserProgress() {
  sessionStorage.setItem("ecolearn_user", JSON.stringify(dashboardData.user));
}

function generateTaskReport() {
  const report = {
    totalTasks: dashboardData.user.tasksCompleted || 0,
    totalPoints: dashboardData.user.ecoPoints || 0,
    badges: dashboardData.user.badges || [],
    streak: dashboardData.user.streak || 0,
    joinDate: dashboardData.user.joinDate,
  };

  console.log("User Progress Report:", report);
  return report;
}

// Badge System Functions
function checkBadgeProgress() {
  const user = dashboardData.user;
  const newBadges = [];

  dashboardData.badges.forEach((badge) => {
    const wasEarned = badge.earned;

    // Update badge progress based on current user stats
    switch (badge.id) {
      case "first-steps":
        badge.progress = Math.min(user.tasksCompleted || 0, 1);
        badge.earned = badge.progress >= 1;
        break;
      case "eco-warrior":
        badge.progress = Math.min(user.ecoPoints || 0, 500);
        badge.earned = badge.progress >= 500;
        break;
      case "tree-planter":
        // This would be updated when a tree planting task is completed
        break;
      case "knowledge-seeker":
        // This would be updated when modules are completed
        break;
      case "streak-master":
        badge.progress = Math.min(user.streak || 0, 30);
        badge.earned = badge.progress >= 30;
        break;
    }

    // Check if badge was just earned
    if (!wasEarned && badge.earned) {
      newBadges.push(badge);
    }
  });

  // Show notification for new badges
  newBadges.forEach((badge) => {
    showBadgeNotification(badge);
  });

  return newBadges;
}

function showBadgeNotification(badge) {
  const notification = document.createElement("div");
  notification.className = "badge-notification";
  notification.innerHTML = `
        <div class="badge-notification-content">
            <div class="badge-notification-icon">
                <i class="${badge.icon}"></i>
            </div>
            <div class="badge-notification-text">
                <h5>Badge Earned!</h5>
                <p>${badge.title}</p>
            </div>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #8b7500;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        z-index: 10000;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 10);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Search and Filter Functions
function searchLeaderboard(query) {
  const filteredLeaderboard = dashboardData.leaderboard.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.school.toLowerCase().includes(query.toLowerCase())
  );

  displayFilteredLeaderboard(filteredLeaderboard);
}

function displayFilteredLeaderboard(users) {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  let html = "";
  users.forEach((user, index) => {
    html += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-avatar">${user.avatar}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-school">${user.school}</div>
                </div>
                <div class="leaderboard-points">${user.points}</div>
            </div>
        `;
  });

  if (html === "") {
    html =
      '<div class="text-center text-muted p-4">No users found matching your search.</div>';
  }

  leaderboardList.innerHTML = html;
}

// Performance Tracking
function trackUserActivity(action) {
  const activity = {
    action: action,
    timestamp: new Date().toISOString(),
    userId: dashboardData.user.id,
  };

  // In a real app, this would be sent to analytics service
  console.log("User activity tracked:", activity);
}

// Initialize performance tracking
function initializeAnalytics() {
  // Track page load
  trackUserActivity("dashboard_loaded");

  // Track section views
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackUserActivity(`section_viewed_${entry.target.id}`);
      }
    });
  });

  document.querySelectorAll(".dashboard-section").forEach((section) => {
    observer.observe(section);
  });
}

// Error Handling
function handleError(error, context = "") {
  console.error("Dashboard Error:", error, context);
  showErrorMessage("Something went wrong. Please try again.");
}

// Export functions for global access
window.DashboardApp = {
  showSuccessMessage,
  showErrorMessage,
  logout,
  startModule,
  startTask,
  trackUserActivity,
  generateTaskReport,
};

// Initialize analytics after DOM is loaded
setTimeout(initializeAnalytics, 1000);
