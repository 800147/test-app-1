import React, { useRef, useState } from 'react';

import { Note } from '../Note/Note';

import './Field.css';
import { Action } from '../Note/Note';
import plusImg from './icon_plus.svg';
import trashImg from './icon_trash_alt.svg';

export const Field = ({ className, notes, changeNote, createNote, deleteNote }) => {
  const self = useRef();
  const [noteAction, setNoteAction] = useState(Action.NONE);

  return (
    <div className={`Field Field_action_${noteAction} ${className || ''}`} ref={self}>
      {
        notes.map((note) => (
          <Note
            key={String(note.id)}
            note={note}
            changeNote={changeNote}
            field={self}
            setNoteAction={setNoteAction}
            deleteNote={deleteNote}
          />
        ))
      }
      <button className="Field-NewNote" onClick={createNote}>
        <img src={plusImg} className="Field-NewNoteImg" alt="new" />
      </button>
      <div className="Field-DeleteNote" onClick={createNote}>
        <img src={trashImg} className="Field-DeleteNoteImg" alt="delete" />
      </div>
    </div>
  );
};
