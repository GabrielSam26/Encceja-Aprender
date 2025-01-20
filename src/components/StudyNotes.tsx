import React, { useState, useEffect } from 'react';
import { StickyNote, Save, Trash2, AlertTriangle } from 'lucide-react';

interface StudyNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export const StudyNotes: React.FC<StudyNotesProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('studyNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        timestamp: Date.now(),
      };
      setNotes([newNote, ...notes]);
      setCurrentNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setNoteToDelete(null);
  };

  const deleteAllNotes = () => {
    setNotes([]);
    setShowDeleteConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-96 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <StickyNote className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">Anotações</h3>
        </div>
        <div className="flex items-center gap-2">
          {notes.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
              title="Excluir todas as anotações"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ×
          </button>
        </div>
      </div>

      {/* Confirmação de exclusão de todas as notas */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center z-50">
          <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
          <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Excluir todas as anotações?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-4">
            <button
              onClick={deleteAllNotes}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir Todas
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Confirmação de exclusão de nota individual */}
      {noteToDelete && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-lg p-4 flex flex-col items-center justify-center z-40">
          <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Excluir esta anotação?
          </h4>
          <div className="flex gap-4">
            <button
              onClick={() => deleteNote(noteToDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir
            </button>
            <button
              onClick={() => setNoteToDelete(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Digite sua anotação aqui..."
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          rows={4}
        />
        <button
          onClick={addNote}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Salvar Anotação
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg relative group"
          >
            <p className="text-gray-800 dark:text-gray-200 mb-2 pr-8">
              {note.content}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(note.timestamp)}
            </div>
            <button
              onClick={() => setNoteToDelete(note.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};