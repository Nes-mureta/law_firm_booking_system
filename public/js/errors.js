// all error handler for forms
async function handleFormSubmission(event, formId, endpoint, redirectUrl) {
    event.preventDefault(); 

    const form = document.getElementById(formId);
    const formData = new FormData(form);

    // Convert form data to JSON
    const data = Object.fromEntries(formData.entries());

    try {
        // Send POST request to the specified endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Extract error message from JSON response
            const errorData = await response.json();
            alert(errorData.error || 'An unexpected error occurred'); 
        } else {
            // If successful, redirect to the specified URL
            window.location.href = redirectUrl;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('A network error occurred. Please try again later.');
    }
}

// Wrapper for Signup Form Submission
function handleSignup(event) {
    handleFormSubmission(event, 'signup-form', '/signup', '/homepage');
}

// Wrapper for Login Form Submission
function handleLogin(event) {
    handleFormSubmission(event, 'login-form', '/login', '/homepage');
}

// Wrapper for Appointment Form Submission
function handleAppointment(event) {
    handleFormSubmission(event, 'appointment-form', '/book-appointment', '');
}

// Wrapper for Admin Signup Form Submission
function handleAdminSignup(event) {
    handleFormSubmission(event, 'signup-form', '/Admin', '/admin.html');
}

// Wrapper for Admin Login Form Submission
function handleAdminLogin(event) {
    handleFormSubmission(event, 'login-form', '/Admin_login', '/appointments.html');
}