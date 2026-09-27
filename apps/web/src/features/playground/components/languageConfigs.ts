import type { LanguageConfig } from '../types/playground.types'

export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  {
    id: 'PYTHON',
    label: 'Python',
    monacoLanguage: 'python',
    defaultCode: `# Python 3
def solve():
    # Write your solution here
    print("Hello, AlgoVision!")

solve()
`,
  },
  {
    id: 'JAVA',
    label: 'Java',
    monacoLanguage: 'java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
        System.out.println("Hello, AlgoVision!");
    }
}
`,
  },
  {
    id: 'CPP',
    label: 'C++',
    monacoLanguage: 'cpp',
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    cout << "Hello, AlgoVision!" << endl;
    return 0;
}
`,
  },
  {
    id: 'JAVASCRIPT',
    label: 'JavaScript',
    monacoLanguage: 'javascript',
    defaultCode: `// JavaScript (Node.js)
function solve() {
    // Write your solution here
    console.log("Hello, AlgoVision!");
}

solve();
`,
  },
]
