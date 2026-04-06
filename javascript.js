document.addEventListener("DOMContentLoaded", () => {

    const createNoteBtn = document.getElementById("createNote");
    const saveNotesBtn = document.getElementById("saveNotes");
    const viewSavedNotesBtn = document.getElementById("viewSavedNotes");
    const notesContainer = document.querySelector(".notes-container");
    const savedNotesContainer = document.querySelector(".saved-notes-container");
    const savedNotesList = document.getElementById("savedNotesList");

    if (!createNoteBtn || !saveNotesBtn || !viewSavedNotesBtn) {
        console.error("One or more buttons not found! Check your HTML IDs.");
        return;
    }

    // ─── CREATE NOTE ───────────────────────────────────────────
    let isCreating = false;

    createNoteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCreating) return;
        isCreating = true;
        setTimeout(() => isCreating = false, 300);

        savedNotesContainer.style.display = "none";

        const noteWrapper = document.createElement("div");
        noteWrapper.classList.add("note-wrapper");

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.classList.add("note-title-input");
        titleInput.placeholder = "Note title...";

        const note = document.createElement("p");
        note.classList.add("input-box");
        note.setAttribute("contenteditable", "true");
        note.setAttribute("placeholder", "Type your note here...");

        const deleteImg = document.createElement("img");
        deleteImg.src = "images/delet_icon.png";
        deleteImg.alt = "Delete";
        deleteImg.title = "Delete note";

        deleteImg.addEventListener("click", (e) => {
            e.stopPropagation();
            notesContainer.removeChild(noteWrapper);
        });

        note.appendChild(deleteImg);
        noteWrapper.appendChild(titleInput);
        noteWrapper.appendChild(note);
        notesContainer.appendChild(noteWrapper);
        titleInput.focus();
    });

    // ─── SAVE NOTES ────────────────────────────────────────────
    saveNotesBtn.addEventListener("click", () => {
        const noteWrappers = document.querySelectorAll(".notes-container .note-wrapper");

        if (noteWrappers.length === 0) {
            alert("No notes to save!");
            return;
        }

        const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];
        let newNotesCount = 0;

        noteWrappers.forEach((wrapper) => {
            const title = wrapper.querySelector(".note-title-input").value.trim();
            const body = wrapper.querySelector(".input-box").innerText.trim();

            if (body !== "" || title !== "") {
                savedNotes.push({
                    id: Date.now() + Math.random(),
                    title: title || "Untitled",
                    content: body,
                    date: new Date().toLocaleString(),
                });
                newNotesCount++;
            }
        });

        if (newNotesCount === 0) {
            alert("Notes are empty! Write something first.");
            return;
        }

        localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
        alert(`${newNotesCount} note(s) saved successfully!`);
        notesContainer.innerHTML = "";
    });

    // ─── VIEW SAVED NOTES ──────────────────────────────────────
    viewSavedNotesBtn.addEventListener("click", () => {
        const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];

        if (savedNotesContainer.style.display === "block") {
            savedNotesContainer.style.display = "none";
            return;
        }

        renderSavedNotes(savedNotes);
        savedNotesContainer.style.display = "block";
    });

    // ─── RENDER SAVED NOTES ────────────────────────────────────
    function renderSavedNotes(savedNotes) {
        savedNotesList.innerHTML = "";

        if (savedNotes.length === 0) {
            savedNotesList.innerHTML = "<p>No saved notes found.</p>";
            return;
        }

        savedNotes.forEach((note) => {
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("saved-note");
            noteDiv.dataset.id = note.id;

            noteDiv.innerHTML = `
                <small style="color:#888;">${note.date}</small>

                <!-- Editable Title -->
                <div class="title-row" style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                    <input 
                        type="text" 
                        class="saved-title-input" 
                        value="${note.title}" 
                        style="
                            font-size: 15px;
                            font-weight: bold;
                            border: none;
                            border-bottom: 2px solid transparent;
                            background: transparent;
                            color: #333;
                            outline: none;
                            flex: 1;
                            cursor: pointer;
                            padding: 2px 4px;
                        "
                        readonly
                    />
                    <button class="rename-btn" title="Rename" style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 0;
                        color: #9418fd;
                    ">✏️</button>
                </div>

                <!-- Editable Body -->
                <div class="body-row" style="margin-top:8px;">
                    <p class="saved-body-text" style="color:#333; white-space: pre-wrap;">${note.content}</p>
                    <textarea class="saved-body-input" style="
                        display: none;
                        width: 100%;
                        min-height: 80px;
                        padding: 8px;
                        font-size: 14px;
                        border: 2px solid #9418fd;
                        border-radius: 5px;
                        outline: none;
                        resize: vertical;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #333;
                    ">${note.content}</textarea>
                </div>

                <!-- Action Buttons -->
                <div class="action-btns" style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
                    <button class="edit-body-btn" style="
                        background: linear-gradient(#9418fd, #571094);
                        color:#fff; border:none; border-radius:20px;
                        padding:5px 15px; cursor:pointer; font-size:12px;
                    ">✏️ Edit Note</button>
                    <button class="save-changes-btn" style="
                        display: none;
                        background: linear-gradient(#28a745, #1a7a30);
                        color:#fff; border:none; border-radius:20px;
                        padding:5px 15px; cursor:pointer; font-size:12px;
                    ">💾 Save Changes</button>
                    <button class="cancel-edit-btn" style="
                        display: none;
                        background: linear-gradient(#888, #555);
                        color:#fff; border:none; border-radius:20px;
                        padding:5px 15px; cursor:pointer; font-size:12px;
                    ">✖ Cancel</button>
                    <button class="delete-saved-btn" data-id="${note.id}" style="
                        background: linear-gradient(#fd1818, #940e0e);
                        color:#fff; border:none; border-radius:20px;
                        padding:5px 15px; cursor:pointer; font-size:12px;
                    ">🗑️ Delete</button>
                </div>
            `;

            savedNotesList.appendChild(noteDiv);

            // Elements
            const titleInput   = noteDiv.querySelector(".saved-title-input");
            const renameBtn    = noteDiv.querySelector(".rename-btn");
            const bodyText     = noteDiv.querySelector(".saved-body-text");
            const bodyTextarea = noteDiv.querySelector(".saved-body-input");
            const editBodyBtn  = noteDiv.querySelector(".edit-body-btn");
            const saveChanges  = noteDiv.querySelector(".save-changes-btn");
            const cancelEdit   = noteDiv.querySelector(".cancel-edit-btn");
            const deleteBtn    = noteDiv.querySelector(".delete-saved-btn");

            // ── Rename title ──
            renameBtn.addEventListener("click", () => {
                const isEditing = !titleInput.readOnly;
                if (isEditing) {
                    // Save title
                    const newTitle = titleInput.value.trim() || "Untitled";
                    titleInput.value = newTitle;
                    titleInput.readOnly = true;
                    titleInput.style.borderBottom = "2px solid transparent";
                    titleInput.style.cursor = "pointer";
                    renameBtn.textContent = "✏️";
                    updateNote(note.id, { title: newTitle });
                } else {
                    // Enable editing
                    titleInput.readOnly = false;
                    titleInput.style.borderBottom = "2px solid #9418fd";
                    titleInput.style.cursor = "text";
                    titleInput.focus();
                    renameBtn.textContent = "💾";
                }
            });

            // ── Edit body ──
            editBodyBtn.addEventListener("click", () => {
                bodyText.style.display = "none";
                bodyTextarea.style.display = "block";
                editBodyBtn.style.display = "none";
                saveChanges.style.display = "inline-block";
                cancelEdit.style.display = "inline-block";
                bodyTextarea.focus();
            });

            // ── Save body changes ──
            saveChanges.addEventListener("click", () => {
                const newContent = bodyTextarea.value.trim();
                bodyText.textContent = newContent;
                bodyText.style.display = "block";
                bodyTextarea.style.display = "none";
                editBodyBtn.style.display = "inline-block";
                saveChanges.style.display = "none";
                cancelEdit.style.display = "none";
                updateNote(note.id, { content: newContent });
            });

            // ── Cancel edit ──
            cancelEdit.addEventListener("click", () => {
                bodyTextarea.value = bodyText.textContent; // revert
                bodyText.style.display = "block";
                bodyTextarea.style.display = "none";
                editBodyBtn.style.display = "inline-block";
                saveChanges.style.display = "none";
                cancelEdit.style.display = "none";
            });

            // ── Delete note ──
            deleteBtn.addEventListener("click", () => {
                const id = parseFloat(deleteBtn.dataset.id);
                let notes = JSON.parse(localStorage.getItem("savedNotes")) || [];
                notes = notes.filter((n) => n.id !== id);
                localStorage.setItem("savedNotes", JSON.stringify(notes));
                renderSavedNotes(notes);
            });
        });
    }

    // ─── HELPER: Update a single note in localStorage ──────────
    function updateNote(id, changes) {
        let notes = JSON.parse(localStorage.getItem("savedNotes")) || [];
        notes = notes.map((n) => n.id === id ? { ...n, ...changes } : n);
        localStorage.setItem("savedNotes", JSON.stringify(notes));
    }

});