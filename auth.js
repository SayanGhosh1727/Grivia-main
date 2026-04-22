// Authentication JavaScript for EcoLearn Platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication features
    initPasswordToggle();
    initFormValidation();
    initUserTypeSelection();
    initPasswordStrengthChecker();
    initSocialAuth();
});

// Password Toggle Functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentNode.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        
        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmailField);
            emailInput.addEventListener('input', clearEmailError);
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', validatePasswordField);
            passwordInput.addEventListener('input', clearPasswordError);
        }
    }
    
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
        
        // Real-time validation for signup
        const signupInputs = signupForm.querySelectorAll('input, select');
        signupInputs.forEach(input => {
            input.addEventListener('blur', validateSignupField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Login Form Handler
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!FormValidator.validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideFieldError('email');
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else {
        hideFieldError('password');
    }
    
    if (!isValid) return;
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalContent = Utils.showLoading(submitButton, 'Signing In...');
    
    try {
        // Simulate API call
        await simulateLogin(email, password, rememberMe);
        
        Utils.showToast('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        Utils.showToast(error.message, 'error');
        Utils.hideLoading(submitButton, originalContent);
    }
}

// Signup Form Handler
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        userType: document.getElementById('userType').value,
        institution: document.getElementById('institution').value.trim(),
        agreeTerms: document.getElementById('agreeTerms').checked,
        emailUpdates: document.getElementById('emailUpdates').checked
    };
    
    if (!validateSignupForm(formData)) return;
    
    // Show loading state
    const submitButton = document.getElementById('signupButton');
    const originalContent = Utils.showLoading(submitButton, 'Creating Account...');
    
    try {
        // Simulate API call
        await simulateSignup(formData);
        
        Utils.showToast('Account created successfully! Please check your email for verification.', 'success');
        
        // Redirect to login page after successful signup
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        Utils.showToast(error.message, 'error');
        Utils.hideLoading(submitButton, originalContent);
    }
}

// Validate Signup Form
function validateSignupForm(data) {
    let isValid = true;
    
    // Full Name
    if (!data.fullName || data.fullName.length < 2) {
        showFieldError('fullName', 'Please enter your full name (at least 2 characters)');
        isValid = false;
    } else {
        hideFieldError('fullName');
    }
    
    // Email
    if (!data.email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!FormValidator.validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideFieldError('email');
    }
    
    // Password
    const passwordValidation = FormValidator.validatePassword(data.password);
    if (!data.password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (!passwordValidation.length) {
        showFieldError('password', 'Password must be at least 8 characters long');
        isValid = false;
    } else {
        hideFieldError('password');
    }
    
    // Confirm Password
    if (!data.confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        hideFieldError('confirmPassword');
    }
    
    // User Type
    if (!data.userType) {
        showFieldError('userType', 'Please select your role');
        isValid = false;
    } else {
        hideFieldError('userType');
    }
    
    // Institution
    if (!data.institution || data.institution.length < 2) {
        showFieldError('institution', 'Please enter your institution name');
        isValid = false;
    } else {
        hideFieldError('institution');
    }
    
    // Terms Agreement
    if (!data.agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        hideFieldError('agreeTerms');
    }
    
    return isValid;
}

// User Type Selection
function initUserTypeSelection() {
    const userTypeCards = document.querySelectorAll('.user-type-card');
    const userTypeInput = document.getElementById('userType');
    
    userTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            userTypeCards.forEach(c => c.classList.remove('selected'));
            
            // Add active class to clicked card
            this.classList.add('selected');
            
            // Set hidden input value
            if (userTypeInput) {
                userTypeInput.value = this.dataset.type;
                hideFieldError('userType');
            }
        });
    });
}

// Password Strength Checker
function initPasswordStrengthChecker() {
    const passwordInput = document.getElementById('password');
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!passwordInput || !strengthContainer) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            strengthContainer.style.display = 'none';
            return;
        }
        
        strengthContainer.style.display = 'block';
        
        const strength = FormValidator.getPasswordStrength(password);
        
        strengthFill.style.width = strength.width + '%';
        strengthFill.style.background = strength.color;
        strengthText.textContent = `Password strength: ${strength.strength}`;
        strengthText.style.color = strength.color;
    });
}

// Social Authentication
function initSocialAuth() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.textContent.trim().toLowerCase();
            handleSocialAuth(provider);
        });
    });
}

// Handle Social Authentication
async function handleSocialAuth(provider) {
    const originalContent = Utils.showLoading(event.target, `Connecting to ${provider}...`);
    
    try {
        // Simulate social auth
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        Utils.showToast(`${provider} authentication successful! Redirecting...`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        Utils.showToast(`${provider} authentication failed. Please try again.`, 'error');
        Utils.hideLoading(event.target, originalContent);
    }
}

// Field Validation Helpers
function validateEmailField() {
    const email = this.value.trim();
    
    if (!email) {
        showFieldError(this.id, 'Email is required');
    } else if (!FormValidator.validateEmail(email)) {
        showFieldError(this.id, 'Please enter a valid email address');
    } else {
        hideFieldError(this.id);
    }
}

function validatePasswordField() {
    const password = this.value;
    
    if (!password) {
        showFieldError(this.id, 'Password is required');
    } else {
        hideFieldError(this.id);
    }
}

function validateSignupField() {
    const field = this;
    const value = field.value.trim();
    
    switch (field.id) {
        case 'fullName':
            if (!value || value.length < 2) {
                showFieldError(field.id, 'Please enter your full name (at least 2 characters)');
            } else {
                hideFieldError(field.id);
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field.id, 'Email is required');
            } else if (!FormValidator.validateEmail(value)) {
                showFieldError(field.id, 'Please enter a valid email address');
            } else {
                hideFieldError(field.id);
            }
            break;
            
        case 'password':
            const passwordValidation = FormValidator.validatePassword(value);
            if (!value) {
                showFieldError(field.id, 'Password is required');
            } else if (!passwordValidation.length) {
                showFieldError(field.id, 'Password must be at least 8 characters long');
            } else {
                hideFieldError(field.id);
            }
            break;
            
        case 'confirmPassword':
            const originalPassword = document.getElementById('password').value;
            if (!value) {
                showFieldError(field.id, 'Please confirm your password');
            } else if (value !== originalPassword) {
                showFieldError(field.id, 'Passwords do not match');
            } else {
                hideFieldError(field.id);
            }
            break;
            
        case 'institution':
            if (!value || value.length < 2) {
                showFieldError(field.id, 'Please enter your institution name');
            } else {
                hideFieldError(field.id);
            }
            break;
    }
}

function clearEmailError() {
    if (this.value.trim()) {
        FormValidator.clearValidation(this);
    }
}

function clearPasswordError() {
    if (this.value) {
        FormValidator.clearValidation(this);
    }
}

function clearFieldError() {
    if (this.value.trim() || this.type === 'checkbox') {
        FormValidator.clearValidation(this);
    }
}

// Helper Functions
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = field ? field.parentNode.querySelector('.error-message') : null;
    
    if (field) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = field ? field.parentNode.querySelector('.error-message') : null;
    
    if (field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Simulate API Calls
async function simulateLogin(email, password, rememberMe) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different scenarios
    if (email === 'demo@ecolearn.com' && password === 'demo123') {
        // Successful login
        const userData = {
            id: 1,
            name: 'Alex Johnson',
            email: email,
            userType: 'student',
            institution: 'Pine Ridge School'
        };
        
        // Store user data
        if (rememberMe) {
            localStorage.setItem('ecolearn_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('ecolearn_user', JSON.stringify(userData));
        }
        
        return userData;
    } else {
        throw new Error('Invalid email or password. Try demo@ecolearn.com / demo123');
    }
}

async function simulateSignup(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate email already exists scenario
    if (formData.email === 'existing@example.com') {
        throw new Error('An account with this email already exists');
    }
    
    // Simulate successful signup
    const userData = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        userType: formData.userType,
        institution: formData.institution,
        emailVerified: false
    };
    
    // Store user data temporarily
    sessionStorage.setItem('ecolearn_pending_user', JSON.stringify(userData));
    
    return userData;
}

// Forgot Password Handler
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        
        if (email && FormValidator.validateEmail(email)) {
            Utils.showToast('Password reset instructions have been sent to your email.', 'success');
        } else if (email) {
            Utils.showToast('Please enter a valid email address.', 'error');
        }
    });
}

// Check if user is already logged in
function checkAuthStatus() {
    const userData = localStorage.getItem('ecolearn_user') || sessionStorage.getItem('ecolearn_user');
    
    if (userData && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Initialize auth status check
checkAuthStatus();

console.log('🔐 Authentication system loaded successfully!');