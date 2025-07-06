// script.js

const BASE_URL = 'http://localhost:8080/api';

let username = '';
let password = ''; // In a real app, never store plain password. Use tokens.

const authSection = document.getElementById('auth-section');
const notesSection = document.getElementById('notes-section');
const logoutBtn = document.getElementById('logout-btn');
const notesListDiv = document.getElementById('notes-list');

// --- Utility Functions ---
// These remain as-is, they operate on ID strings.
function showElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove('hidden');
}

function hideElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add('hidden');
}

function showMessage(elementId, message, isError = true) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = isError ? 'error' : 'success';
}

function clearMessage(elementId) {
    const el = document.getElementById(elementId);
    el.textContent = '';
    el.className = '';
}

// --- Authentication Functions ---
async function registerUser() {
    const regUsername = document.getElementById('register-username').value;
    const regPassword = document.getElementById('register-password').value;

    clearMessage('register-message');

    if (!regUsername || !regPassword) {
        showMessage('register-message', 'Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: regUsername, password: regPassword })
        });

        if (response.ok) {
            showMessage('register-message', 'Registration successful! You can now login.', false);
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
        } else {
            const errorData = await response.json();
            showMessage('register-message', `Registration failed: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        showMessage('register-message', `Network error: ${error.message}`);
    }
}

async function loginUser() {
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    clearMessage('login-message');

    if (!loginUsername || !loginPassword) {
        showMessage('login-message', 'Please enter both username and password.');
        return;
    }

    username = loginUsername;
    password = loginPassword;

    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        });

        if (response.ok) {
            showMessage('login-message', 'Login successful!', false);
            hideElement('auth-section');
            showElement('notes-section');
            showElement('logout-btn');
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            fetchAndDisplayNotes();
        } else if (response.status === 401) {
            showMessage('login-message', 'Login failed: Invalid credentials.');
            username = '';
            password = '';
        } else {
            const errorData = await response.json();
            showMessage('login-message', `Login failed: ${errorData.message || response.statusText}`);
            username = '';
            password = '';
        }
    } catch (error) {
        showMessage('login-message', `Network error: ${error.message}`);
        username = '';
        password = '';
    }
}

function logoutUser() {
    username = '';
    password = '';
    notesListDiv.innerHTML = '<h3>All Notes</h3>';
    hideElement('notes-section');
    hideElement('logout-btn');
    showElement('auth-section');
    showMessage('login-message', 'Logged out successfully.', false);
}

// --- Note Management Functions ---

async function fetchAndDisplayNotes() {
    notesListDiv.innerHTML = '<h3>All Notes</h3>';
    if (!username || !password) {
        showMessage('notes-list', 'Please log in to view notes.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        });

        if (response.ok) {
            const notes = await response.json();
            if (notes.length === 0) {
                notesListDiv.innerHTML += '<p>No notes found. Create one!</p>';
            } else {
                notes.forEach(note => {
                    displayNote(note);
                });
            }
        } else if (response.status === 401) {
            showMessage('notes-list', 'Not authorized to fetch notes. Please log in.', true);
            logoutUser();
        } else {
            const errorData = await response.json();
            showMessage('notes-list', `Error fetching notes: ${errorData.message || response.statusText}`, true);
        }
    } catch (error) {
        showMessage('notes-list', `Network error fetching notes: ${error.message}`, true);
    }
}

// Modified displayNote to handle edit mode
function displayNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.id = `note-${note.id}`;

    noteDiv.innerHTML = `
        <div class="note-content-area">
            <div class="note-display-mode">
                <strong class="note-title-display">${note.title}</strong>
                <p class="note-content-display">${note.content}</p>
                <small>Created: ${new Date(note.createdAt).toLocaleString()}</small>
                ${note.updatedAt ? `<br><small>Updated: ${new Date(note.updatedAt).toLocaleString()}</small>` : ''}
            </div>
            <div class="note-edit-mode hidden">
                <input type="text" class="edit-title-input" value="${note.title.replace(/"/g, '&quot;')}" />
                <textarea class="edit-content-input">${note.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </div>
        </div>
        <div class="note-buttons">
            <button class="edit-button" onclick="toggleEditMode(${note.id}, true)">Edit</button>
            <button class="save-button hidden" onclick="saveEditedNote(${note.id})">Save</button>
            <button class="cancel-button hidden" onclick="toggleEditMode(${note.id}, false)">Cancel</button>
            <button class="delete-button" onclick="deleteNote(${note.id})">Delete</button>
        </div>
    `;
    notesListDiv.appendChild(noteDiv);
}


// Corrected function to toggle between display and edit mode
function toggleEditMode(noteId, enterEditMode) {
    const noteDiv = document.getElementById(`note-${noteId}`);
    if (!noteDiv) {
        console.error(`Note div with ID note-${noteId} not found.`);
        return;
    }

    const displayMode = noteDiv.querySelector('.note-display-mode');
    const editMode = noteDiv.querySelector('.note-edit-mode');
    const editButton = noteDiv.querySelector('.edit-button');
    const saveButton = noteDiv.querySelector('.save-button');
    const cancelButton = noteDiv.querySelector('.cancel-button');
    const deleteButton = noteDiv.querySelector('.delete-button');

    if (enterEditMode) {
        // Show edit mode, hide display mode
        displayMode.classList.add('hidden');
        editMode.classList.remove('hidden');

        // Show save/cancel, hide edit/delete
        editButton.classList.add('hidden');
        deleteButton.classList.add('hidden'); // Usually hide delete in edit mode
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');
    } else {
        // Show display mode, hide edit mode
        displayMode.classList.remove('hidden');
        editMode.classList.add('hidden');

        // Show edit/delete, hide save/cancel
        editButton.classList.remove('hidden');
        deleteButton.classList.remove('hidden'); // Show delete again
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        // Revert input values to original if cancelled
        // By re-fetching all notes, we ensure data consistency
        fetchAndDisplayNotes();
    }
}


// Function to save the edited note
async function saveEditedNote(noteId) {
    const noteDiv = document.getElementById(`note-${noteId}`);
    if (!noteDiv) return;

    const newTitle = noteDiv.querySelector('.edit-title-input').value;
    const newContent = noteDiv.querySelector('.edit-content-input').value;

    clearMessage('create-note-message');

    if (!newTitle || !newContent) {
        showMessage('create-note-message', 'Title and content cannot be empty.', true);
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });

        if (response.ok) {
            showMessage('create-note-message', 'Note updated successfully!', false);
            fetchAndDisplayNotes(); // Refresh the list to show updated note and exit edit mode
        } else {
            const errorData = await response.json();
            showMessage('create-note-message', `Failed to update note: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        showMessage('create-note-message', `Network error updating note: ${error.message}`);
    }
}


async function createNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    clearMessage('create-note-message');

    if (!title || !content) {
        showMessage('create-note-message', 'Please enter both title and content.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            const newNote = await response.json();
            showMessage('create-note-message', 'Note created successfully!', false);
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            fetchAndDisplayNotes();
        } else {
            const errorData = await response.json();
            showMessage('create-note-message', `Failed to create note: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        showMessage('create-note-message', `Network error creating note: ${error.message}`);
    }
}


async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    clearMessage('create-note-message');

    try {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        });

        if (response.ok) {
            showMessage('create-note-message', 'Note deleted successfully!', false);
            const noteElement = document.getElementById(`note-${id}`);
            if (noteElement) {
                noteElement.remove();
            }
        } else if (response.status === 404) {
            showMessage('create-note-message', 'Note not found.', true);
        } else {
            const errorData = await response.json();
            showMessage('create-note-message', `Failed to delete note: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        showMessage('create-note-message', `Network error deleting note: ${error.message}`);
    }
}

// Initial state setup
document.addEventListener('DOMContentLoaded', () => {
    // You could try to auto-login here if you had a token in localStorage
});
