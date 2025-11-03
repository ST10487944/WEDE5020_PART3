document.addEventListener('DOMContentLoaded', function() {
    console.log('Form validation loaded!');
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        console.log('Setting up form:', form.id);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            console.log('Form submitted!');
            
            if (validateForm(this)) {
                console.log('Form is valid!');
                submitForm(this);
            } else {
                console.log('Form has errors');
                showMessage('Please fix the errors above', 'error');
            }
        });
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                console.log('Checking field:', this.name);
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
});

function validateForm(form) {
    console.log('Validating entire form...');
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    console.log('Validating field:', fieldName, 'Value:', value);
    
    clearError(field);
    
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if ((field.name === 'phone' || field.type === 'tel') && value !== '') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    if ((field.name === 'message' || field.type === 'textarea') && value !== '') {
        if (value.length < 10) {
            showError(field, 'Message must be at least 10 characters long');
            return false;
        }
    }
    
    if ((field.name === 'fullName' || field.id === 'fullName') && value !== '') {
        if (value.length < 2) {
            showError(field, 'Name must be at least 2 characters long');
            return false;
        }
    }
    
    showSuccess(field);
    return true;
}

function showError(field, message) {
    console.log('Showing error:', message);
    
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = '#fdf2f2';
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8em';
    errorElement.style.marginTop = '5px';
    errorElement.style.fontWeight = 'bold';
}

function showSuccess(field) {
    field.style.borderColor = '#2ecc71';
    field.style.backgroundColor = '#f2fdf2';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearError(field) {
    field.style.borderColor = '#ddd';
    field.style.backgroundColor = 'white';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function submitForm(form) {
    console.log('Submitting form...');
    const formData = new FormData(form);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(function() {
        showMessage('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');
        
        form.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.style.borderColor = '#ddd';
            field.style.backgroundColor = 'white';
        });
        
        console.log('Form submitted successfully!');
        
    }, 2000); 
}

function showMessage(message, type) {
    console.log('Showing message:', message, 'Type:', type);
    
    const oldMessage = document.querySelector('.form-message');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.textContent = message;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    messageDiv.style.padding = '15px';
    messageDiv.style.margin = '20px 0';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = 'bold';
    
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    } else {
        document.body.insertBefore(messageDiv, document.body.firstChild);
    }
    
    setTimeout(function() {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}