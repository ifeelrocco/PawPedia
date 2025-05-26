// Form Submission Handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (!form || !submitBtn) {
        console.error('Form or submit button not found');
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Validate form data
    if (!name || !email || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Create a hidden iframe for submission
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Create a form to submit to Google Apps Script
        const submitForm = document.createElement('form');
        submitForm.method = 'POST';
        submitForm.action = 'https://script.google.com/macros/s/AKfycbzl8yNGJzcO2T4cF2E5OSKFnSANsq5ZoDu9CuELTE1muVMAICJcaJ_mvkAxhaxQX6Qk/exec';
        submitForm.target = iframe.name;

        // Add form fields
        const fields = ['name', 'email', 'subject', 'message'];
        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field;
            input.value = formData.get(field);
            submitForm.appendChild(input);
        });

        // Submit the form
        document.body.appendChild(submitForm);
        submitForm.submit();
        
        // Redirect to thank you page after 1 second
        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 1000);
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Error submitting form. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

// Add event listener to form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}
