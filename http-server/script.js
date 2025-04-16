document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const dobInput = document.getElementById('dob');
    const acceptTermsInput = document.getElementById('acceptTerms');
    const userTableBody = document.getElementById('userTableBody');
    const dobError = document.getElementById('dobError'); // Get the error message div

    const getEntries = () => {
        const entries = localStorage.getItem('userEntries');
        return entries ? JSON.parse(entries) : [];
    };

    const saveEntries = (entries) => {
        localStorage.setItem('userEntries', JSON.stringify(entries));
    };

    const addEntryToTable = (entry) => {
        const row = userTableBody.insertRow();
        row.insertCell(0).textContent = entry.name;
        row.insertCell(1).textContent = entry.email;
        row.insertCell(2).textContent = entry.password;
        row.insertCell(3).textContent = entry.dob;
        row.insertCell(4).textContent = entry.acceptTerms; // Display true/false
    };

    const loadEntries = () => {
        userTableBody.innerHTML = ''; // Clear existing table rows
        const entries = getEntries();
        entries.forEach(addEntryToTable);
    };

    const validateAge = (dobString) => {
        if (!dobString) return false; // Handle empty input case

        const today = new Date();
        const birthDate = new Date(dobString);

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        // Check age range
        return age >= 18 && age <= 55;
    };


    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value; // No trim for password usually
        const dob = dobInput.value;
        const acceptTerms = acceptTermsInput.checked; // Get boolean value

        // Validate Date of Birth
        if (!validateAge(dob)) {
             dobError.style.display = 'block'; // Show the error message
             // alert('Age must be between 18 and 55.'); // Alternative: use alert
             dobInput.focus(); // Optional: focus the dob input
             return; // Stop submission
        } else {
             dobError.style.display = 'none'; // Hide error message if valid
        }

        const newEntry = {
            name,
            email,
            password,
            dob,
            acceptTerms // Store boolean value
        };

        const entries = getEntries();
        entries.push(newEntry);
        saveEntries(entries);
        addEntryToTable(newEntry);

        // Optional: Clear the form after successful submission
        // form.reset();
        // acceptTermsInput.checked = false; // Ensure checkbox is reset if form.reset() doesn't handle it perfectly
    });

    // Load existing entries when the page loads
    loadEntries();
});