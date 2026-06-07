import { testCases } from "@/data/test"
import { runCode } from "./judge0";
export const verdictEngine = async (sourceCode, languageId, problemId) => {
    const cases = testCases[problemId];
    if (!cases) {
        throw new Error("No testCases Found");
    }

    const stdin = `${cases.length}\n` + cases.map(tc => tc.input).join("\n");
    const expectedOutput = cases.map(tc => tc.expectedOutput).join("\n");
    const result = await runCode(
        sourceCode,
        languageId,
        stdin
    );
    if (result.statusId === 6) {
        return {
            verdict: "Compile Error",
            message: result.compileOutput
        };
    }

    if (result.statusId !== 3) {
        return {
            verdict: "Runtime Error",
            message: result.stderr
        };
    }
        const actual =
            result.stdout.trim();
        const expected =
            expectedOutput.trim();
        if (actual === expected) {
            return {
                verdict: "Accepted",
                runtime : result.runtime,
                memory : result.memory,

            };
        }

    return {
    verdict: "Wrong Answer",
    expected,
    actual
  };
}
