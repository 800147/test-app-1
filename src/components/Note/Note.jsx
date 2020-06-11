import React, { useCallback, useState, useEffect, useRef } from 'react';

import './Note.css';
import moveImg from './arrow_move.svg';
import resizeImg from './arrow_expand_alt2.svg';

export const Action = {
  NONE: 'none',
  MOVE: 'move',
  RESIZE: 'resize'
};

export const Note = ({
  className,
  note: {
    id,
    text,
    x,
    y,
    width,
    height,
  },
  changeNote,
  deleteNote,
  field,
  setNoteAction
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState(Action.NONE);
  const self = useRef();

  const onMouseMove = useCallback((e) => {
    const {
      x: fieldX,
      y: fieldY,
      width: fieldWidth,
      height: fieldHeight
    } = field.current.getBoundingClientRect();

    if (action === Action.MOVE) {
      changeNote(id, {
        x: (e.pageX - fieldX) / fieldWidth - mouseOffset.x,
        y: (e.pageY - fieldY) / fieldHeight - mouseOffset.y
      })
    }

    if (action === Action.RESIZE) {
      changeNote(id, {
        width: (e.pageX - fieldX) / fieldWidth - mouseOffset.x,
        height: (e.pageY - fieldY) / fieldHeight - mouseOffset.y
      })
    }
  }, [mouseOffset, field, id, changeNote, action]);

  const onMouseUp = useCallback((e) => {
    const {
      x: fieldX,
      y: fieldY,
      width: fieldWidth,
      height: fieldHeight
    } = field.current.getBoundingClientRect();

    setAction(Action.NONE);
    setNoteAction(Action.NONE);

    if (
      (e.pageX - fieldX) / fieldWidth <= 0.1 &&
      (e.pageY - fieldY) / fieldHeight >= 0.9
    ) {
      deleteNote(id);
    }
  }, [setAction, setNoteAction, id, field, deleteNote]);

  useEffect(() => {
    if (action === Action.NONE) {
      return;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseUp);
    }
  }, [action, onMouseMove, onMouseUp]);

  const onMoveMouseDown = useCallback((e) => {
    const {
      x: fieldX,
      y: fieldY,
      width: fieldWidth,
      height: fieldHeight
    } = field.current.getBoundingClientRect();

    setMouseOffset({
      x: (e.pageX - fieldX) / fieldWidth - x,
      y: (e.pageY - fieldY) / fieldHeight - y
    });

    setAction(Action.MOVE);
    setNoteAction(Action.MOVE);
  }, [field, setMouseOffset, setAction, x, y, setNoteAction]);

  const onResizeMouseDown = useCallback((e) => {
    const {
      x: fieldX,
      y: fieldY,
      width: fieldWidth,
      height: fieldHeight
    } = field.current.getBoundingClientRect();

    setMouseOffset({
      x: (e.pageX - fieldX) / fieldWidth - width,
      y: (e.pageY - fieldY) / fieldHeight - height
    });

    setAction(Action.RESIZE);
    setNoteAction(Action.RESIZE);
  }, [field, setMouseOffset, setAction, width, height, setNoteAction]);

  const changeText = useCallback(({ currentTarget: { value } }) => {
    changeNote(id, { text: value });
  }, [changeNote, id]);

  return (
    <div
      className={`Note Note_color_${id % 5} Note_action_${action} ${className || ''}`}
      style={{
        '--x': x,
        '--y': y,
        '--width': width,
        '--height': height,
        zIndex: Math.round(y * 10000)
      }}
      ref={self}
    >
      <textarea
        className="Note-Text"
        onChange={changeText}
        value={text}
        placeholder="Empty note"
      />
      <div
        className="Note-Move"
        onMouseDown={onMoveMouseDown}
      >
        <img src={moveImg} className="Note-MoveImg" alt="move" />
      </div>
      <div
        className="Note-Resize"
        onMouseDown={onResizeMouseDown}
      >
        <img src={resizeImg} className="Note-ResizeImg" alt="resize" />
      </div>
    </div>
  );
}
