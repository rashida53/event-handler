const countFormHandler = async (event) => {
    event.preventDefault();

    const count = document.querySelector('#rsvp-count').value.trim();
    const event_id = document.querySelector('.confirm-button').getAttribute('id');

    if (count) {
        const response = await fetch('/rsvp', {
            method: 'POST',
            body: JSON.stringify({ count, event_id }),
            headers: {
                'Content-Type': 'application/json',


            },
        });
        if (response.ok) {
            document.location.replace(`/api/events/${event_id}`);
        } else {
            alert('Failed to submit count');
        }
    }
};

document.querySelector('.count-form').addEventListener('submit', countFormHandler);

