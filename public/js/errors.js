// All error handler for forms
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

        const responseData = await response.json();

        if (!response.ok) {
            // Extract error message from JSON response
            alert(responseData.error || 'An unexpected error occurred');
        } else {
            // If successful, redirect to the specified URL or use the redirectUrl from the response
            window.location.href = responseData.redirectUrl || redirectUrl;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('A network error occurred. Please try again later.');
    }
}

// Wrapper for Signup Form Submission
function handleSignup(event) {
    handleFormSubmission(event, 'signup-form', '/signup', '/login.html');
}

// Wrapper for Login Form Submission
function handleLogin(event) {
    handleFormSubmission(event, 'login-form', '/login', '/homepage');
}

// Wrapper for Appointment Form Submission
function handleAppointment(event) {
    handleFormSubmission(event, 'appointment-form', '/book-appointment', '');
}

