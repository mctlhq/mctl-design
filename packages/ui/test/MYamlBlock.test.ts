import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MYamlBlock from '../src/components/MYamlBlock.vue';

// Each rendered line as [kind, text] pairs, in order.
function tokens(code: string) {
  const wrapper = mount(MYamlBlock, { props: { code } });
  return wrapper.findAll('.m-yaml__line').map((line) =>
    line.findAll('span').map((seg) => {
      const kind = seg
        .classes()
        .find((c) => c.startsWith('m-yaml__t-'))!
        .slice('m-yaml__t-'.length);
      return [kind, seg.text()];
    }),
  );
}

describe('MYamlBlock colorizer', () => {
  it('splits a key/value line into indent, key, colon and value', () => {
    expect(tokens('  name: api')).toEqual([
      [
        ['plain', ''],
        ['key', 'name'],
        ['punct', ':'],
        ['string', 'api'],
      ],
    ]);
  });

  it('keeps a list-item key and treats a key with no value as plain', () => {
    expect(tokens('- port:\nmetadata: ')).toEqual([
      [
        ['plain', '-'],
        ['key', 'port'],
        ['punct', ':'],
      ],
      [
        ['plain', ''],
        ['key', 'metadata'],
        ['punct', ':'],
        ['plain', ''],
      ],
    ]);
  });

  it('colours a whole-line comment and an inline one', () => {
    expect(tokens('  # deployment\nreplicas: 3 # scale later')).toEqual([
      [['comment', '# deployment']],
      [
        ['plain', ''],
        ['key', 'replicas'],
        ['punct', ':'],
        ['string', '3'],
        ['comment', '# scale later'],
      ],
    ]);
  });

  it('renders a line that is not key/value, and a blank line, as plain', () => {
    expect(tokens('- just text\n\nend: 1\n')).toEqual([
      [['plain', '- just text']],
      [['plain', '']],
      [
        ['plain', ''],
        ['key', 'end'],
        ['punct', ':'],
        ['string', '1'],
      ],
    ]);
  });

  it('shows the filename caption only when one is given', () => {
    expect(
      mount(MYamlBlock, { props: { code: 'a: 1' } })
        .find('figcaption')
        .exists(),
    ).toBe(false);
    const named = mount(MYamlBlock, { props: { code: 'a: 1', filename: 'deploy.yaml' } });
    expect(named.find('figcaption').text()).toBe('deploy.yaml');
  });
});
