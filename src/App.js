import React, { useState, useCallback, useEffect } from 'react';

import { Field } from './components/Field/Field';
import './App.css';

const FIRST_NODE_TEXT =
  'Welcome to Sticky Notes — my test app on React\n\n' +
  'Features:\n\n' +
  '* Create new note with button in bottom right corner of the field\n\n' +
  '* Move note with grip in top right corner of the note (appears on hover)\n\n' +
  '* Resize note with grip in bottom right corner of the note (appears on hover)\n\n' +
  '* Delete note by moving it to bottom left corner of the field\n\n' +
  '* Colors and z-indexes are set automatically\n\n' +
  '* Notes are saved in browser using local storage';

const defaultStore = {
  lastNoteId: 0,
  notes: {
    0: {
      id: 0,
      text: FIRST_NODE_TEXT,
      x: 0.15,
      y: 0.15,
      width: 0.40,
      height: 0.40
    }
  }
};

function App() {
  const [store, setStore] = useState({ lastNoteId: -1, notes: {} });

  const onStorage = useCallback(({ key, newValue }) => {
    if (key !== 'store') {
      return;
    }

    setStore(Object.assign(JSON.parse(newValue), { isSetFromLocalStorage: true }));
  }, [setStore]);

  useEffect(() => {
    const localStore = localStorage.getItem('store');

    if (localStore) {
      setStore(JSON.parse(localStore));
    } else {
      setStore(defaultStore);
    }

    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, [setStore, onStorage]);

  useEffect(() => {
    const { isSetFromLocalStorage, ...forLocalStorage } = store;

    if (isSetFromLocalStorage) {
      return;
    }

    localStorage.setItem('store', JSON.stringify(forLocalStorage));
  }, [store]);

  const changeNote = useCallback((id, noteChanges) => {
    setStore({
      ...store,
      notes: {
        ...store.notes,
        [id]: Object.assign({}, store.notes[id], noteChanges)
      },
      isSetFromLocalStorage: false
    });
  }, [store, setStore]);

  const createNote = useCallback(() => {
    setStore({
      notes: {
        ...store.notes,
        [store.lastNoteId + 1]: {
          id: store.lastNoteId + 1,
          text: '',
          x: 0.35,
          y: 0.35,
          width: 0.30,
          height: 0.30
        }
      },
      lastNoteId: store.lastNoteId + 1,
      isSetFromLocalStorage: false
    });
  }, [store, setStore]);

  const deleteNote = useCallback((id) => {
    const { [id]: deleted, ...newNotes } = store.notes;

    setStore({
      ...store,
      notes: newNotes,
      isSetFromLocalStorage: false
    });
  }, [store, setStore]);

  return (
    <div className="App">
      <Field
        notes={Object.values(store.notes)}
        changeNote={changeNote}
        createNote={createNote}
        deleteNote={deleteNote}
      />
    </div>
  );
}

export default App;
