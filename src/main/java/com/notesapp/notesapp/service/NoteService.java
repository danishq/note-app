package com.notesapp.notesapp.service;

import com.notesapp.notesapp.model.Note;
import com.notesapp.notesapp.model.User;
import com.notesapp.notesapp.repository.NoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

  private final NoteRepository noteRepository;

  public NoteService(NoteRepository noteRepository) {
    this.noteRepository = noteRepository;
  }

  @Transactional
  public Note createNote(Note note, User user) {
    note.setUser(user);
    return noteRepository.save(note);
  }

  public List<Note> getNotesByUser(User user) {
    return noteRepository.findByUser(user);
  }

  public Optional<Note> getNoteByIdAndUser(Long id, User user) {
    return noteRepository.findByIdAndUser(id, user);
  }

  @Transactional
  public Note updateNote(Long id, Note updatedNote, User user) {
    return noteRepository.findByIdAndUser(id, user).map(note -> {
      note.setTitle(updatedNote.getTitle());
      note.setContent(updatedNote.getContent());
      return noteRepository.save(note);
    }).orElseThrow(() -> new RuntimeException("Note not found or does not belong to user."));
  }

  @Transactional
  public void deleteNote(Long id, User user) {
    Note note = noteRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new RuntimeException("Note not found or does not belong to user."));
    noteRepository.delete(note);
  }
}
