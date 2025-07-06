package com.notesapp.notesapp.controller;

import com.notesapp.notesapp.model.Note;
import com.notesapp.notesapp.model.User;
import com.notesapp.notesapp.service.NoteService;
import com.notesapp.notesapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

  private final NoteService noteService;
  private final UserService userService; // To get the currently authenticated user

  public NoteController(NoteService noteService, UserService userService) {
    this.noteService = noteService;
    this.userService = userService;
  }

  // Helper to get current authenticated user
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    return userService.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found. This should not happen."));
  }

  @PostMapping
  public ResponseEntity<Note> createNote(@RequestBody Note note) {
    User currentUser = getCurrentUser();
    Note createdNote = noteService.createNote(note, currentUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
  }

  @GetMapping
  public ResponseEntity<List<Note>> getAllNotes() {
    User currentUser = getCurrentUser();
    List<Note> notes = noteService.getNotesByUser(currentUser);
    return ResponseEntity.ok(notes);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    return noteService.getNoteByIdAndUser(id, currentUser)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
    User currentUser = getCurrentUser();
    try {
      Note updatedNote = noteService.updateNote(id, noteDetails, currentUser);
      return ResponseEntity.ok(updatedNote);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    try {
      noteService.deleteNote(id, currentUser);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
