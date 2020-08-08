import { readFileSync } from 'fs';
import { MongoHighlighter } from '../src';

describe('MongoHighlighter', () => {

  const highlighter = new MongoHighlighter();

  test('highlights query', async () => {
    const queries = readFileSync(__dirname + '/test.txt').toString().split('\n---\n').map(s => s.trim());

    for (const str of queries) {
      const s = highlighter.highlight(str);
      expect(s).toMatchSnapshot(str);
    }
  });

});
