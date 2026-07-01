import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { basicSetup, EditorView } from 'codemirror'
import { useRef, useEffect } from 'react'
import { oneDark } from '@codemirror/theme-one-dark'

const LANGUAGE_MAP = {
  javascript: { extension: javascript(), 
      starter: `// Write your solution here
  
  function solve(inputTokens) {
      // === WRITE YOUR CODE HERE ===
      // inputTokens is an array of strings containing all inputs.
      // Example: To read the first number, use parseInt(inputTokens[0], 10)
      
      
  }
  
  // --- Platform Input Wrapper (Do not modify) ---
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const tokens = [];
  rl.on('line', (line) => {
      line.trim().split(/\\s+/).forEach(t => { if(t !== "") tokens.push(t); });
  });
  rl.on('close', () => solve(tokens));
  `
    },
  python:     { extension: python(),     starter: '# Write your solution here\n\ndef solve(input):\n    pass\n' },
  java:       { extension: java(),       starter: '// Write your solution here\n\nclass Main {\n    public static void main(String[] args) {\n        \n    }\n}\n' },
  cpp:        { extension: cpp(),        starter: '// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
}

// Key scoped to roomId so each new battle starts with a clean slate
const LS_KEY = (roomId, lang) => `codeclash_code_${roomId}_${lang}`

const CodeEditor = ({ onChange, language = 'javascript', roomId }) => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript

    // Load saved code for this room+language, or fall back to starter template
    const saved = roomId ? localStorage.getItem(LS_KEY(roomId, language)) : null
    const initialDoc = saved !== null ? saved : langConfig.starter

    const view = new EditorView({
      doc: initialDoc,
      extensions: [
        basicSetup,
        langConfig.extension,
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const code = update.state.doc.toString()
            // Persist per room+language
            if (roomId) localStorage.setItem(LS_KEY(roomId, language), code)
            onChange(code)
          }
        })
      ],
      parent: containerRef.current,
    })

    editorRef.current = view

    // Fire onChange with initial code so codeRef in Battle stays in sync
    onChange(initialDoc)

    return () => {
      view.destroy()
    }
  }, [language, roomId])

  return (
    <div ref={containerRef} className="h-full" />
  )
}

export default CodeEditor