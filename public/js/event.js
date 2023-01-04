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

const errandFormHandler = async (event) => {
    event.preventDefault();

    const errandOptions = document.querySelector('#errand-list');
    const name = errandOptions.options[errandOptions.selectedIndex].value;

    const img_name = name.replaceAll(' ', '-');

    const contact = document.querySelector('#contact').value.trim();
    const pay = document.querySelector('#pay').value.trim();



    if (name && contact && pay) {
        const response = await fetch('/errands', {
            method: 'POST',
            body: JSON.stringify({ name, contact, pay, img_name }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to create errand');
        }
    }
};

const dishFormHandler = async (event) => {
    event.preventDefault();
    const dish = document.querySelector('#dish-query').value.trim();
    if (dish) {
        document.location.replace(`/planning?dish=${dish}`);
    }
};

let modal = document.getElementById('modal');
let openBtn = document.getElementById('open-btn');
let closeBtn = document.getElementById('close-btn');

openBtn.onclick = function () {
    modal.style.display = 'block';
};

closeBtn.onclick = function () {
    modal.style.display = 'none';
};

document.querySelector('.post-event-form').addEventListener('submit', postFormHandler);
document.querySelector('.create-errand-form').addEventListener('submit', errandFormHandler);
document.querySelector('.catering-options-form').addEventListener('submit', dishFormHandler);

