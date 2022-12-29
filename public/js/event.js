const postFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#event-title').value.trim();
    const description = document.querySelector('#event-desc').value.trim();
    const event_date = document.querySelector('#event-date').value.trim();

    const venueOptions = document.querySelector('#venue-list');
    const venue_id = venueOptions.options[venueOptions.selectedIndex].id;

    const categoryOptions = document.querySelector('#category-list');
    const category_id = categoryOptions.options[categoryOptions.selectedIndex].id;


    if (title && description && event_date) {
        const response = await fetch('/api/events', {
            method: 'POST',
            body: JSON.stringify({ title, description, event_date, category_id, venue_id }),
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
};

const dishFormHandler = async (event) => {
    event.preventDefault();
    const dish = document.querySelector('#dish-query').value.trim();
    if (dish) {
        document.location.replace(`/planning?dish=${dish}`);
    }
}

document.querySelector('.post-event-form').addEventListener('submit', postFormHandler);
document.querySelector('.catering-options-form').addEventListener('submit', dishFormHandler);

