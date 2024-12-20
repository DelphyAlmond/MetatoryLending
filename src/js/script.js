document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', async () => {
        card.classList.toggle('active');

        const title = card.querySelector('h3').textContent;

        try {
            const response = await fetch('form.html'); // Fetch the modal HTML
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const modalHTML = await response.text();

            // Create the modal element and add the content.
            const modalElement = document.createElement('div');
            modalElement.id = 'modal-form';
            modalElement.className = 'modal fade';
            modalElement.innerHTML = modalHTML;
            document.body.appendChild(modalElement);


            // Populate the modal with data *after* it's in the DOM
            const modalTitle = document.getElementById('fTitle');

            if (modalTitle) { //Check if elements exist before using them
                modalTitle.textContent = title;
            } else {
                console.error("Modal TITLE not set!");
            }

            const modal = new bootstrap.Modal(modalElement);

            modal.show();

            const form = document.getElementById('eventForm');

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                if (!data.fullName || !data.email || !data.phone) {
                    alert('Please fill in all fields!');
                    return;
                }
                if (!isValidEmail(data.email)) {
                    alert('Please enter a valid email address!');
                    return;
                }

                try {
                    const response = await fetch('/save-form-data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const responseData = await response.json();
                    alert(responseData.message);
                    modal.hide();
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('Error submitting form. Please try again later.');
                }

            });

        }
        catch (error) {
            console.error('Error loading modal:', error);
            alert('Error loading modal content. Please try again. ' + error.message); // More informative error message
        }

        setTimeout(() => {
            card.classList.remove('active');
        }, 300);
    });
});

function isValidEmail(email) {
    // Regular expression : for validation email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Saving (replace with database logic later)
async function saveFormDataToFile(formData) {
    try {
        const response = await fetch('/save-form-data', { // You'll need a backend route for this
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving form data:', error);
        alert('Error saving data. Please try again later.');
    }
}
