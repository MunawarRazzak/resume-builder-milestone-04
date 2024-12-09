// References to HTML elements
var generateResumeButton = document.getElementById('generateResume');
var resetResumeButton = document.getElementById('resetResume');
var form = document.getElementById('resume');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
var profilePictureInput = document.getElementById('profilePicture');
var educationInput = document.getElementById('education');
var experienceInput = document.getElementById('experience');
var skillInput = document.getElementById('skill');
var resumePreview = document.getElementById('resumePreview');
var displayName = document.getElementById('displayName');
var displayEmail = document.getElementById('displayEmail');
var displayPhone = document.getElementById('displayPhone');
var displayProfilePicture = document.getElementById('displayProfilePicture');
var displayEducation = document.getElementById('displayEducation');
var displayExperience = document.getElementById('displayExperience');
var displaySkills = document.getElementById('displaySkills');
// Form validation
function checkFormValidity() {
    return form.checkValidity();
}
// Save resume data to local storage
var saveToLocalStorage = function () {
    var resumeData = {
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
var loadFromLocalStorage = function () {
    var savedData = localStorage.getItem('resumeData');
    if (savedData) {
        var data = JSON.parse(savedData);
        displayName.textContent = data.name || '';
        displayEmail.textContent = data.email || '';
        displayPhone.textContent = data.phone || '';
        displayEducation.textContent = data.education || '';
        displayExperience.textContent = data.experience || '';
        displaySkills.textContent = data.skills || '';
    }
};
// Generate resume on button click
generateResumeButton.addEventListener('click', function () {
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
            var file = profilePictureInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                displayProfilePicture.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            };
            reader.readAsDataURL(file);
        }
        // Save data to local storage
        saveToLocalStorage();
        // Show resume preview
        resumePreview.style.display = 'block';
    }
    else {
        alert('Please fill in all required fields.');
    }
});
// Make sections editable
function makeEditable(section) {
    section.addEventListener('click', function () {
        var currentValue = section.textContent || '';
        var input = document.createElement('input');
        input.value = currentValue;
        input.style.width = "".concat(section.offsetWidth, "px");
        input.className = 'editable-input';
        section.replaceWith(input);
        input.addEventListener('blur', function () {
            if (input.value.trim() === '') {
                alert('This field cannot be empty.');
                input.focus();
            }
            else {
                section.textContent = input.value;
                input.replaceWith(section);
                saveToLocalStorage(); // Save changes to local storage
            }
        });
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                if (input.value.trim() === '') {
                    alert('This field cannot be empty.');
                }
                else {
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
var resumeSections = {
    name: displayName,
    email: displayEmail,
    phone: displayPhone,
    education: displayEducation,
    experience: displayExperience,
    skills: displaySkills,
};
Object.values(resumeSections).forEach(function (section) {
    section.className = 'editable'; // Add a class for highlighting
    makeEditable(section);
});
// Reset resume
resetResumeButton.addEventListener('click', function () {
    Object.values(resumeSections).forEach(function (section) { return (section.textContent = ''); });
    displayProfilePicture.src = ''; // Clear profile picture
    localStorage.clear(); // Clear local storage
    resumePreview.style.display = 'none'; // Hide preview
});
// Highlight editable sections
var css = "\n    .editable:hover {\n        border: 1px dashed #ccc;\n        background-color: #f9f9f9;\n        cursor: text;\n    }\n    .editable-input {\n        font-size: inherit;\n        padding: 2px;\n    }\n";
var style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
// Load data on page load
loadFromLocalStorage();
