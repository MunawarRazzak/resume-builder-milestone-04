// References to HTML elements
const generateResumeButton = document.getElementById('generateResume') as HTMLButtonElement;
const resetResumeButton = document.getElementById('resetResume') as HTMLButtonElement;
const form = document.getElementById('resume') as HTMLFormElement;

const nameInput = document.getElementById('name') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const profilePictureInput = document.getElementById('profilePicture') as HTMLInputElement;
const educationInput = document.getElementById('education') as HTMLTextAreaElement;
const experienceInput = document.getElementById('experience') as HTMLTextAreaElement;
const skillInput = document.getElementById('skill') as HTMLTextAreaElement;

const resumePreview = document.getElementById('resumePreview') as HTMLDivElement;
const displayName = document.getElementById('displayName') as HTMLSpanElement;
const displayEmail = document.getElementById('displayEmail') as HTMLSpanElement;
const displayPhone = document.getElementById('displayPhone') as HTMLSpanElement;
const displayProfilePicture = document.getElementById('displayProfilePicture') as HTMLImageElement;
const displayEducation = document.getElementById('displayEducation') as HTMLSpanElement;
const displayExperience = document.getElementById('displayExperience') as HTMLSpanElement;
const displaySkills = document.getElementById('displaySkills') as HTMLSpanElement;

// Form validation
function checkFormValidity(): boolean {
    return form.checkValidity();
}

// Save resume data to local storage
const saveToLocalStorage = () => {
    const resumeData = {
        name: displayName.textContent,
        email: displayEmail.textContent,
        phone: displayPhone.textContent,
        education: displayEducation.textContent,
        experience: displayExperience.textContent,
        skills: displaySkills.textContent,
    };
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
};

// Load resume data from local storage
const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        const data = JSON.parse(savedData);
        displayName.textContent = data.name || '';
        displayEmail.textContent = data.email || '';
        displayPhone.textContent = data.phone || '';
        displayEducation.textContent = data.education || '';
        displayExperience.textContent = data.experience || '';
        displaySkills.textContent = data.skills || '';
    }
};

// Generate resume on button click
generateResumeButton.addEventListener('click', () => {
    if (checkFormValidity()) {
        // Capture form data
        displayName.textContent = nameInput.value;
        displayEmail.textContent = emailInput.value;
        displayPhone.textContent = phoneInput.value;
        displayEducation.textContent = educationInput.value;
        displayExperience.textContent = experienceInput.value;
        displaySkills.textContent = skillInput.value;

        // Handle profile picture
        if (profilePictureInput.files && profilePictureInput.files[0]) {
            const file = profilePictureInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                displayProfilePicture.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }

        // Save data to local storage
        saveToLocalStorage();

        // Show resume preview
        resumePreview.style.display = 'block';
    } else {
        alert('Please fill in all required fields.');
    }
});

// Make sections editable
function makeEditable(section: HTMLSpanElement) {
    section.addEventListener('click', () => {
        const currentValue = section.textContent || '';
        const input = document.createElement('input');
        input.value = currentValue;
        input.style.width = `${section.offsetWidth}px`;
        input.className = 'editable-input';

        section.replaceWith(input);

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                alert('This field cannot be empty.');
                input.focus();
            } else {
                section.textContent = input.value;
                input.replaceWith(section);
                saveToLocalStorage(); // Save changes to local storage
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (input.value.trim() === '') {
                    alert('This field cannot be empty.');
                } else {
                    section.textContent = input.value;
                    input.replaceWith(section);
                    saveToLocalStorage(); // Save changes to local storage
                }
            }
        });

        input.focus();
    });
}

// Apply editable functionality to all resume sections
const resumeSections = {
    name: displayName,
    email: displayEmail,
    phone: displayPhone,
    education: displayEducation,
    experience: displayExperience,
    skills: displaySkills,
};

Object.values(resumeSections).forEach((section) => {
    section.className = 'editable'; // Add a class for highlighting
    makeEditable(section);
});

// Reset resume
resetResumeButton.addEventListener('click', () => {
    Object.values(resumeSections).forEach((section) => (section.textContent = ''));
    displayProfilePicture.src = ''; // Clear profile picture
    localStorage.clear(); // Clear local storage
    resumePreview.style.display = 'none'; // Hide preview
});

// Highlight editable sections
const css = `
    .editable:hover {
        border: 1px dashed #ccc;
        background-color: #f9f9f9;
        cursor: text;
    }
    .editable-input {
        font-size: inherit;
        padding: 2px;
    }
`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

// Load data on page load
loadFromLocalStorage();
