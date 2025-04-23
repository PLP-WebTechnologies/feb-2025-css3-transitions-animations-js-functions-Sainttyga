document.addEventListener('DOMContentLoaded', () => {
    // --- Cache DOM Elements ---
    // General
    const body = document.body;
    const dynamicText = document.getElementById('dynamicText');
    const contactTableBody = document.getElementById('contactTable')?.querySelector('tbody');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Interactive Demo
    const colorBtn = document.getElementById('color-btn');
    const demoAnimatedBox = document.getElementById('demo-animated-box'); // Renamed ID
    const animateBoxBtn = document.getElementById('animate-box-btn'); // Renamed ID
    const animateImageBtn = document.getElementById('animateImageBtn'); // Renamed ID
    const demoImg = document.getElementById('demoImg');

    // Tabs
    const tabContainer = document.querySelector('.tabs-container'); // For potential delegation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Event Handling Demo
    const eventOutput = document.getElementById('event-output');
    const clickBtn = document.getElementById('click-btn');
    const hoverBox = document.getElementById('hover-box');
    const keyDisplay = document.getElementById('key-display');
    const secretBtn = document.getElementById('secret-btn');

    // Gallery
    const galleryImg = document.getElementById('gallery-img');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');

    // Form
    const signupForm = document.getElementById('signup-form');
    const formName = document.getElementById('name');
    const formEmail = document.getElementById('email');
    const formPassword = document.getElementById('password');
    const formDob = document.getElementById('dob');
    const formFeedback = document.getElementById('form-feedback');

    // --- Constants ---
    const ANIMATION_BOUNCE = 'anim-bounce';
    const ANIMATION_PULSE = 'anim-pulse';
    const ANIMATION_FADE_IN = 'anim-fadeIn'; // Example if needed elsewhere

    // --- User Preferences with localStorage ---
    function savePreference(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Failed to save preference:", key, e);
        }
    }

    function getPreference(key, defaultValue = null) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultValue;
        } catch (e) {
            console.error("Failed to get preference:", key, e);
            return defaultValue;
        }
    }

    // --- Animation Utility ---
    function triggerAnimation(element, animationClass) {
        if (!element || !animationClass) return;
        element.classList.remove(animationClass);
        // Force reflow to restart animation - the void trick is effective
        void element.offsetWidth;
        element.classList.add(animationClass);

        // Use 'animationend' event to clean up class
        element.addEventListener('animationend', function handler() {
            element.classList.remove(animationClass);
            element.removeEventListener('animationend', handler); // Remove self
        }, { once: true }); // Use { once: true } for automatic removal
    }

    // --- Core Functions ---
    function changeText() {
        if (!dynamicText) return;
        const texts = [
            "This text has been updated dynamically!",
            "JavaScript is controlling this content.",
            "Isn't this interactive?",
            "Back to the original dynamic text!"
        ];
        // Cycle through texts or pick random
        const currentText = dynamicText.textContent;
        let newText = texts[0];
        const currentIndex = texts.indexOf(currentText);
        if (currentIndex !== -1 && currentIndex < texts.length - 1) {
            newText = texts[currentIndex + 1];
        } else if (currentIndex === texts.length - 1) {
             newText = texts[0]; // Loop back
        }

        dynamicText.textContent = newText;
        triggerAnimation(dynamicText, ANIMATION_PULSE); // Use pulse for text change
        savePreference('lastText', dynamicText.textContent);
    }

    function addContact() {
        if (!contactTableBody) {
            console.error('Contact table body not found');
            return;
        }
        const newRow = contactTableBody.insertRow(); // Inserts at the end by default
        newRow.innerHTML = `
            <td>New User</td>
            <td>New City, Country</td>
            <td>+XX XXX XXX XXXX</td>
            <td>newuser@domain.com</td>
        `;
        triggerAnimation(newRow, ANIMATION_FADE_IN); // Fade in new row
        newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll to new row
    }

    function removeContact() {
        if (!contactTableBody) {
            console.error('Contact table body not found');
            return;
        }
        const rowCount = contactTableBody.rows.length;
        if (rowCount > 0) {
            const rowToRemove = contactTableBody.rows[rowCount - 1];
            // Add a class for fade-out animation (needs CSS)
            rowToRemove.classList.add('anim-fadeOut'); // You'll need to define anim-fadeOut
             triggerAnimation(rowToRemove, ANIMATION_SHAKE); // Shake before removing

            // Remove after animation
            rowToRemove.addEventListener('animationend', () => {
                 rowToRemove.remove();
            }, { once: true });

             // Fallback if animation doesn't fire
             setTimeout(() => {
                 if (rowToRemove.parentNode) { // Check if still attached
                    rowToRemove.remove();
                 }
             }, 500); // Match animation duration
        } else {
            console.log("No contacts to remove.");
        }
    }

    // --- Dark Mode ---
    function setDarkMode(enabled) {
        if (enabled) {
            body.classList.add('dark-mode');
            savePreference('darkMode', true);
        } else {
            body.classList.remove('dark-mode');
            savePreference('darkMode', false);
        }
        // Optional: Animate the body transition if desired (CSS handles the property transitions)
        // triggerAnimation(body, 'anim-fade'); // Be careful animating body directly
    }

    // --- Action Map for Buttons ---
    // Maps data-action attribute values to functions
    const actions = {
        changeText,
        addContact,
        removeContact
        // Add other simple actions here if needed
    };

    // --- Event Listeners Setup ---

    // General Actions via data-action
document.querySelectorAll('button[data-action]').forEach(button => {
    const action = button.getAttribute('data-action');
    if (actions[action]) {
        button.addEventListener('click', () => {
            // FIX: Call the function using the action key
            actions[action]();
            triggerAnimation(button, ANIMATION_BOUNCE); // Animate the button itself
        });
    } else {
        console.warn(`No action defined for data-action="${action}"`);
    }
});

    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            setDarkMode(this.checked);
            // Animate the toggle or label if desired
        });
    }

    // Interactive Demo Listeners
    if (colorBtn) {
        colorBtn.addEventListener('click', function() {
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
            triggerAnimation(this, ANIMATION_PULSE);
            savePreference('colorBtnColor', randomColor);
        });
    }

    if (animateBoxBtn && demoAnimatedBox) {
        animateBoxBtn.addEventListener('click', function() {
            const currentTransform = demoAnimatedBox.style.transform;
            if (currentTransform.includes('rotate(360deg)')) {
                demoAnimatedBox.style.transform = 'rotate(0deg) scale(1)';
            } else {
                demoAnimatedBox.style.transform = 'rotate(360deg) scale(1.2)';
            }
             // We don't need triggerAnimation here as the transition is on the element itself
             triggerAnimation(this, ANIMATION_BOUNCE); // Animate the button
        });
    }

     if (animateImageBtn && demoImg) {
        animateImageBtn.addEventListener('click', () => {
            demoImg.classList.toggle('hidden');
            triggerAnimation(animateImageBtn, ANIMATION_BOUNCE);
            // Optionally animate the image when it appears
            if (!demoImg.classList.contains('hidden')) {
                 triggerAnimation(demoImg, ANIMATION_PULSE);
            }
        });
    }


    // Tab Functionality (using event delegation is slightly more efficient)
    if (tabContainer) {
        tabContainer.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.tab-btn');
            if (!targetButton) return; // Click wasn't on a tab button

            const tabId = targetButton.getAttribute('data-tab');
            if (!tabId) return;

            // Deactivate all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate clicked tab
            targetButton.classList.add('active');
            targetButton.setAttribute('aria-selected', 'true');
            const correspondingContent = document.getElementById(tabId);
            if (correspondingContent) {
                correspondingContent.classList.add('active');
            }

            triggerAnimation(targetButton, ANIMATION_BOUNCE);
            savePreference('activeTab', tabId);
        });
    }

    // Event Handling Demo Listeners
    if (clickBtn && eventOutput) {
        clickBtn.addEventListener('click', function() {
            eventOutput.textContent = 'Button was clicked! Timestamp: ' + Date.now();
            triggerAnimation(eventOutput, ANIMATION_PULSE);
            triggerAnimation(this, ANIMATION_BOUNCE);
        });
    }

    if (hoverBox) {
        hoverBox.addEventListener('mouseenter', function() {
            this.textContent = 'Mouse entered!';
            this.style.backgroundColor = '#2ecc71'; // Example color change
            this.style.color = '#fff';
            // triggerAnimation(this, ANIMATION_PULSE); // Can be too much on hover
        });
        hoverBox.addEventListener('mouseleave', function() {
            this.textContent = 'Hover over me';
            this.style.backgroundColor = ''; // Revert to CSS default
            this.style.color = ''; // Revert to CSS default
        });
    }

    if (keyDisplay) {
        // Listen on the document for keydown events
        document.addEventListener('keydown', function(event) {
            // Avoid updating for modifier keys if not desired
            if (event.key.length > 1 && !['Enter', 'Tab', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(event.key)) {
                 // keyDisplay.textContent = `Modifier key pressed: ${event.key}`;
            } else {
                 keyDisplay.textContent = `Key pressed: ${event.key}`;
                 triggerAnimation(keyDisplay, ANIMATION_PULSE);
            }
        });
    }

    if (secretBtn) {
        let secretClickCount = getPreference('secretClickCount', 0); // Load count initially

        // Function to update button state based on count
        const updateSecretButton = () => {
            if (secretClickCount >= 5) {
                secretBtn.textContent = 'Secret Unlocked!';
                secretBtn.style.backgroundColor = '#f1c40f'; // Gold color
                secretBtn.disabled = true; // Disable after unlocking
            } else {
                secretBtn.textContent = `Secret Button (${secretClickCount}/5)`;
                secretBtn.style.backgroundColor = ''; // Reset color
                secretBtn.disabled = false;
            }
        };

        secretBtn.addEventListener('click', function() {
            secretClickCount++;
            savePreference('secretClickCount', secretClickCount);
            updateSecretButton(); // Update text/state
            triggerAnimation(this, ANIMATION_BOUNCE);
        });

        // Initialize button state on load
        updateSecretButton();
    }


    // Image Gallery Functionality
    const images = [ // Make sure these paths are correct relative to index.html
        'photo/pexels-emily-ranquist-493228-1205651.jpg',
        'photo/image2.png', // Placeholder - ensure these exist
        'photo/image3.png'  // Placeholder - ensure these exist
    ];
    let currentImageIndex = getPreference('galleryIndex', 0);

    function updateGalleryImg() {
        if (galleryImg && images.length > 0) {
             // Ensure index is within bounds
             currentImageIndex = (currentImageIndex % images.length + images.length) % images.length;
            galleryImg.src = images[currentImageIndex];
            galleryImg.alt = `Gallery image ${currentImageIndex + 1}`; // Update alt text
            triggerAnimation(galleryImg, ANIMATION_PULSE);
            savePreference('galleryIndex', currentImageIndex);
        } else if (galleryImg) {
            galleryImg.alt = "No images available"; // Indicate if no images
        }
    }

    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', function() {
            currentImageIndex--;
            updateGalleryImg();
            triggerAnimation(this, ANIMATION_BOUNCE);
        });
    }

    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', function() {
            currentImageIndex++;
            updateGalleryImg();
            triggerAnimation(this, ANIMATION_BOUNCE);
        });
    }

    // Form Validation
    if (signupForm && formFeedback) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default submission
            let isValid = true;
            let feedbackMessage = '';

            // Clear previous feedback
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback-base'; // Reset classes

            // Validate Name
            const nameVal = formName?.value.trim() || '';
            if (nameVal.length < 3) {
                isValid = false;
                feedbackMessage = 'Name must be at least 3 characters long.';
                triggerAnimation(formName.parentNode, ANIMATION_SHAKE); // Animate form group
            }

            // Validate Email (Simple check)
            const emailVal = formEmail?.value.trim() || '';
            if (isValid && !/\S+@\S+\.\S+/.test(emailVal)) {
                 isValid = false;
                 feedbackMessage = 'Please enter a valid email address.';
                 triggerAnimation(formEmail.parentNode, ANIMATION_SHAKE);
            }

            // Validate Password
            const passwordVal = formPassword?.value || '';
            if (isValid && passwordVal.length < 8) {
                isValid = false;
                feedbackMessage = 'Password must be at least 8 characters long.';
                 triggerAnimation(formPassword.parentNode, ANIMATION_SHAKE);
            }

            // Validate Date of Birth
            const dobVal = formDob?.value || '';
             if (isValid && !dobVal) {
                 isValid = false;
                 feedbackMessage = 'Please enter your Date of Birth.';
                 triggerAnimation(formDob.parentNode, ANIMATION_SHAKE);
             }


            // Display Feedback
            if (!isValid) {
                formFeedback.textContent = feedbackMessage;
                formFeedback.classList.add('error');
                triggerAnimation(formFeedback, ANIMATION_BOUNCE);
            } else {
                formFeedback.textContent = 'Form submitted successfully! (Check console)';
                formFeedback.classList.add('success');
                triggerAnimation(formFeedback, ANIMATION_BOUNCE);

                // In a real application, send data to a server here
                console.log('Form data:', {
                    name: nameVal,
                    email: emailVal,
                    password: '***', // Don't log passwords
                    dob: dobVal
                });
                savePreference('lastRegisteredEmail', emailVal); // Save email on successful submission

                // Optionally reset the form
                 // signupForm.reset();
                 // formEmail.value = getPreference('lastRegisteredEmail', ''); // Keep email prefilled if desired
            }
        });
    }

    // --- Initial State Restoration ---

    // Restore Dark Mode
    if (getPreference('darkMode', false)) {
        setDarkMode(true);
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    // Restore last dynamic text
    const lastText = getPreference('lastText');
    if (lastText && dynamicText) {
        dynamicText.textContent = lastText;
    }

    // Restore button color
    const savedColor = getPreference('colorBtnColor');
    if (savedColor && colorBtn) {
        colorBtn.style.backgroundColor = savedColor;
    }

    // Restore active tab
    const activeTabId = getPreference('activeTab', 'tab1'); // Default to tab1
    const activeButton = document.querySelector(`.tab-btn[data-tab="${activeTabId}"]`);
    const activeContent = document.getElementById(activeTabId);

    if (activeButton && activeContent) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        activeContent.classList.add('active');
    } else {
        // Fallback if saved tab doesn't exist - activate the first tab
        const firstTabButton = document.querySelector('.tab-btn');
        const firstTabContent = document.querySelector('.tab-content');
        if (firstTabButton && firstTabContent) {
             firstTabButton.classList.add('active');
             firstTabButton.setAttribute('aria-selected', 'true');
             firstTabContent.classList.add('active');
        }
    }


    // Initialize gallery
    updateGalleryImg();

    // Pre-fill email if available
    const lastEmail = getPreference('lastRegisteredEmail');
    if (lastEmail && formEmail) {
        formEmail.value = lastEmail;
    }

    console.log("PLP Script Initialized Successfully");

}); // End DOMContentLoaded
