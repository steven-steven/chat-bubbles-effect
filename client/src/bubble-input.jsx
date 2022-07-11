import React, { useCallback, useState, useRef, useEffect } from 'react'
import './bubble-input.css'

const BubbleInput = ({ onChange, onSubmit, value }) => {
  const refEditable = useRef()
  const [submitted, setSubmitted] = useState(false)

  const handleKeyDown = e => {
    const { isComposing } = e.nativeEvent
    if (e.key === 'Enter' && !isComposing) {
      onSubmit && onSubmit()
      e.preventDefault()
      setSubmitted(true)
      setTimeout(() => {
        refEditable.current.focus()
        refEditable.current.innerText = ''
        setSubmitted(false)
      }, 10)
    }
  }
  const handleBlur = useCallback(() => {
    const { current: elDiv } = refEditable
    if (elDiv) {
      elDiv.focus()
    }
  }, [refEditable])

  useEffect(handleBlur, [handleBlur])

  const moveCursorAfterHashtags = () => {
    let hashtagRange = document.createRange();
    let windowSelection = window.getSelection();
    //remove any previously created ranges
    windowSelection.removeAllRanges();
    let theNodes = refEditable.current.childNodes;
    refEditable.current.focus();
    hashtagRange.setStartBefore(theNodes[0]);
    hashtagRange.setEndAfter(theNodes[0]);
    hashtagRange.collapse(false);
    //add the range to a window selection object.
    windowSelection.addRange(hashtagRange);
    windowSelection.collapseToEnd();
  }

  return (
    <div
      ref={refEditable}
      className={`bubble input ${value.length === 0 ? 'empty' : ''} ${
        submitted ? 'submitted' : ''
      }`}
      contentEditable
      spellCheck="false"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={e => {onChange(e.target.innerText); moveCursorAfterHashtags();}}
      suppressContentEditableWarning={true}
    >{value}</div>
  )
}

export default BubbleInput
