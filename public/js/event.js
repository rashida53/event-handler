const postFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#event-title').value.trim();
    const description = document.querySelector('#event-description').value.trim();
    const event_date = document.querySelector('#event_date').value.trim();

    if (title && description && event_date) {
        const response = await fetch('/api/events', {
            method: 'POST',
            body: JSON.stringify({ title, description, event_date }),
            headers: {
                'Content-Type': 'application/json',


            },
        });
        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to create event');
        }
    }
}