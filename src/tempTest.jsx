import { verdictEngine } from '@/utils/verdictEngine.js'

const TempTest = () => {

  const code = `
public class Main {

    public static void main(String[] args) {

        int x = 5 / 0;

    }
}
`;

  const runTest = async () => {

    try {

      const result = await verdictEngine(
        code,
        62,   // Java
        "1"   // Two Sum
      );

      console.log("VERDICT:");
      console.log(result);

    } catch(err) {

      console.error("ERROR:");
      console.error(err);

    }
  };

  return (
    <div>
      <button onClick={runTest}>
        Test Judge
      </button>
    </div>
  );
};

export default TempTest;