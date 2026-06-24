import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { basicSetup, EditorView } from 'codemirror'
import { useRef, useEffect } from 'react'
import { oneDark } from '@codemirror/theme-one-dark'

const LANGUAGE_MAP = {
  javascript: { extension: javascript(), starter: '// Write your solution here\n\nfunction solve(input) {\n  \n}\n' },
  python:     { extension: python(),     starter: '# Write your solution here\n\ndef solve(input):\n    pass\n' },
  java:       { extension: java(),       starter: '// Write your solution here\n\nclass Main {\n    public static void main(String[] args) {\n        \n    }\n}\n' },
  cpp:        { extension: cpp(),        starter: '// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
}

const CodeEditor = ({ onChange, language = 'javascript' }) => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  // Recreate the editor whenever language changes
  useEffect(() => {
    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript

    const view = new EditorView({
      doc: langConfig.starter,
      extensions: [
        basicSetup,
        langConfig.extension,
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        })
      ],
      parent: containerRef.current,
    })
    

    editorRef.current = view

    // Fire onChange with starter code so codeRef in Battle stays in sync
    onChange(langConfig.starter)

    return () => {
      view.destroy()
    }
  }, [language])

  return (
    <div ref={containerRef} className="m-8 border-3 rounded-lg" />

  )
}

export default CodeEditor