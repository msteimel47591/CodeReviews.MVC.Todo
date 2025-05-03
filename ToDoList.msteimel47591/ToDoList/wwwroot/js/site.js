
const uri = '/todo'; // Backend API endpoint
let todos = [];

function getToDoItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function _displayItems(data) {
    const todoList = document.getElementById('todo-list');
    const emptyPlaceholder = document.getElementById('empty-placeholder');
    todoList.innerHTML = ''; // Clear the list before adding items

    if (data.length === 0) {
        // Show the placeholder and hide the list
        emptyPlaceholder.style.display = 'block';
        todoList.style.display = 'none';
        updateBtn.style.display = 'none'; // Hide the update button
        deleteBtn.style.display = 'none'; // Hide the delete button
        addBtn.style.display = 'block'; // Show the add button
        refreshBtn.style.display = 'block'; // Show the refresh button
    } else {
        // Hide the placeholder and show the list
        emptyPlaceholder.style.display = 'none';
        todoList.style.display = 'block';
        updateBtn.style.display = 'block'; // Hide the update button
        deleteBtn.style.display = 'block'; // Hide the delete button
        addBtn.style.display = 'block'; // Show the add button
        refreshBtn.style.display = 'block'; // Show the refresh button

        data.forEach(item => {
            // Create a list group item
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            a.textContent = item.title;
            a.dataset.id = item.id; // Store the item's ID for reference

            // Add a badge for the isCompleted property
            const badge = document.createElement('span');
            badge.className = item.isCompleted ? 'badge bg-secondary rounded-pill' : 'badge bg-secondary rounded-pill';
            badge.textContent = item.isCompleted ? 'Complete' : 'Incomplete';
            a.appendChild(badge);

            // Add click event to handle selection
            a.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent the default scroll-to-top behavior

                // Remove 'active' class from all items
                document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));

                // Add 'active' class to the clicked item
                this.classList.add('active');

                // Log the selected item's ID (or perform other actions)
                console.log(`Selected item ID: ${this.dataset.id}`);
            });

            // Append the list item to the list group
            todoList.appendChild(a);
        });
    }

    todos = data; // Store the fetched items globally if needed
}



function validateAndSave(caller) {
    let todoInputElement, todoInput;

    switch (caller) {
        case 'add':
            todoInputElement = document.getElementById('todoInput');
            todoInput = todoInputElement ? todoInputElement.value.trim() : '';
            if (!todoInput) {
                alert('Please enter a valid to-do item.');
                return;
            }
            saveToDoItem(todoInput);
            break;

        case 'update':
            todoInputElement = document.getElementById('updateInput');
            todoInput = todoInputElement ? todoInputElement.value.trim() : '';
            if (!todoInput) {
                alert('Please enter a valid to-do item.');
                return;
            }

            const selectedItem = document.querySelector('.list-group-item.active');
            if (!selectedItem) {
                alert('Please select an item to update.');
                return;
            }

            const id = selectedItem.dataset.id;
            const updatedItem = {
                title: todoInput,
                isCompleted: document.getElementById('updateCheckbox').checked
            };

            updateToDoItem(id, updatedItem);
            break;

        default:
            console.error(`Invalid caller: ${caller}`);
            alert('Invalid operation.');
            return;
    }
}

function saveToDoItem(todoInput) {
    const isCompleted = document.getElementById('checkDefault').checked; // Get the checkbox value

    const newItem = {
        title: todoInput,
        isCompleted: isCompleted
    };

    // Example: Send the new item to the server (replace with your API endpoint)
    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
        .then(response => {
            if (response.ok) {
                alert('To-do item added successfully!');
                getToDoItems(); // Refresh the list
                document.getElementById('todoInput').value = ''; // Clear the input field
                document.getElementById('checkDefault').checked = false; // Reset the checkbox
                const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                modal.hide(); // Close the modal
            } else {
                alert('Failed to add to-do item.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateToDoItem(id, updatedItem) {
    fetch(`/todo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
        .then(response => {
            if (response.ok) {
                alert('To-do item updated successfully!');
                getToDoItems(); // Refresh the list
                const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
                updateModal.hide()
            } else {
                alert('Failed to update to-do item.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function clearInput() {
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.value = ''; // Clear the input field
    }
}

function checkSelectionBeforeUpdate() {
    const selectedItem = document.querySelector('.list-group-item.active'); // Check for an active item
    if (!selectedItem) {
        alert('Please select an item from the list to update.');
        return; // Prevent the modal from opening
    }

    // If an item is selected, open the update modal
    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    updateModal.show();

    // Populate the modal fields with the selected item's data
    const updateInput = document.getElementById('updateInput');
    const updateCheckbox = document.getElementById('updateCheckbox');

    // Extract the title text (excluding the badge)
    const titleText = selectedItem.firstChild.textContent.trim(); // Use firstChild to get the text node
    updateInput.value = titleText; // Set the input value

    // Check if the badge text is "Complete"
    const badge = selectedItem.querySelector('.badge');
    if (badge) {
        const badgeText = badge.textContent.trim();
        updateCheckbox.checked = badgeText.toLowerCase() === 'complete'; // Set the checkbox
    } else {
        updateCheckbox.checked = false; // Default to unchecked if no badge is found
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl);
    });
});

function checkSelectionBeforeDelete() {
    const selectedItem = document.querySelector('.list-group-item.active'); // Check for an active item
    if (!selectedItem) {
        alert('Please select an item from the list to delete.');
        return; // Prevent the modal from opening
    }

    // If an item is selected, open the update modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    // Populate the modal fields with the selected item's data
    const deleteInput = document.getElementById('deleteInput');

    // Extract the title text (excluding the badge)
    const titleText = selectedItem.firstChild.textContent.trim(); // Use firstChild to get the text node
    deleteInput.value = titleText; // Set the input value
}

function DeleteTodoItem() {
    const selectedItem = document.querySelector('.list-group-item.active'); // Check for an active item
    const id = selectedItem.dataset.id; // Get the ID of the selected item
    fetch(`/todo/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                alert('To-do item deleted successfully!');
                getToDoItems(); // Refresh the list
                deleteModal.hide(); // Close the modal
                
            } else {
                alert('Failed to delete to-do item.');
            }
        })
        .catch(error => console.error('Error:', error));
}




