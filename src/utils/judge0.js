
const JUDGE0_URL = "https://ce.judge0.com"

export const submitCode = async (sourceCode, languageId, stdin = '') => {
    const response = await fetch(
        `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source_code: btoa(sourceCode),
                language_id: languageId,
                stdin: btoa(stdin)
            })
        }
    )
    const data = await response.json()
    return data.token
}

export const pollResult = async (token) => {
    let attempts = 0;
    while(attempts<30){

    const response = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
        { headers: { 'Content-Type': 'application/json' } }
    )
    const data = await response.json()
    console.log(data);
    if(data.status.id > 2){
     return {
    statusId: data.status.id,
    statusDesc: data.status.description,
    stdout: data.stdout
      ? decodeURIComponent(escape(atob(data.stdout)))
      : '',
    stderr: data.stderr
      ? decodeURIComponent(escape(atob(data.stderr)))
      : '',
    compileOutput: data.compile_output
      ? decodeURIComponent(escape(atob(data.compile_output)))
      : '',
      runtime: data.time,
      memory:data.memory,
  }
    }
    attempts++;
    await new Promise(resolve =>
      setTimeout(resolve, 2000)
    )
  }
  throw new Error("Judge0 timeout");
}
export const runCode = async (sourceCode, languageId, stdin = '') => {
  const token = await submitCode(sourceCode, languageId, stdin)
  return await pollResult(token)
}
