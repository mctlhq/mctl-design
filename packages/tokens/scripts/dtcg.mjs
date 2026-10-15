// Converts the token tree into the W3C Design Tokens Community Group format
// (DTCG 2025.10): every leaf becomes { $type, $value }, with the object value
// shapes that version made stable (colour components, { value, unit }
// dimensions and durations).
//
// The semantic colour groups are emitted as aliases ("{color.ink}") rather
// than resolved hex, so a DTCG consumer (Style Dictionary, Terrazzo, Tokens
// Studio / Figma) sees the same primitive -> semantic graph the TypeScript
// sources express. The TS objects hold resolved strings, so the alias is
// recovered by value: a hex is pointed back at the first primitive declared
// with it. Values the format has no type for (clamp(), em letter spacing,
// "none") keep their CSS text in $value with no $type, and are marked under
// $extensions so a tool can skip them deliberately rather than choke.

const ALIASED_GROUPS = new Set(['surface', 'accent', 'status', 'syntax']);
const EXT = 'ai.mctl';

const HEX = /^#[0-9a-f]{6}$/i;
const DIMENSION = /^(-?\d*\.?\d+)(px|rem)$/;
const DURATION = /^(\d*\.?\d+)ms$/;
const BEZIER = /^cubic-bezier\(([^)]+)\)$/;
const SHADOW = /^(-?\d+)(?:px)? (-?\d+)(?:px)? (\d+)(?:px)?(?: (-?\d+)(?:px)?)? (rgba?\([^)]+\)|#[0-9a-f]{6})$/i;

const round = (n) => Math.round(n * 10000) / 10000;

function colorValue(hex) {
  const h = hex.slice(1);
  const components = [0, 2, 4].map((i) => round(parseInt(h.slice(i, i + 2), 16) / 255));
  return { colorSpace: 'srgb', components, hex: hex.toLowerCase() };
}

function rgbaValue(css) {
  const [r, g, b, a = '1'] = css.replace(/rgba?\(|\)/g, '').split(',').map((s) => s.trim());
  return {
    colorSpace: 'srgb',
    components: [r, g, b].map((c) => round(Number(c) / 255)),
    alpha: Number(a),
  };
}

const px = (n) => ({ value: Number(n), unit: 'px' });

function leaf(path, value, aliases) {
  const [group] = path;
  if (typeof value === 'number') {
    return group === 'typography' && (path.includes('fontWeight') || path.at(-1) === 'weight')
      ? { $type: 'fontWeight', $value: value }
      : { $type: 'number', $value: value };
  }
  const v = String(value);
  if (HEX.test(v)) {
    const ref = ALIASED_GROUPS.has(group) ? aliases.get(v.toLowerCase()) : undefined;
    return { $type: 'color', $value: ref ? `{color.${ref}}` : colorValue(v) };
  }
  if (v === '0') return { $type: 'dimension', $value: px(0) };
  let m;
  if ((m = DIMENSION.exec(v))) return { $type: 'dimension', $value: { value: Number(m[1]), unit: m[2] } };
  if ((m = DURATION.exec(v))) return { $type: 'duration', $value: { value: Number(m[1]), unit: 'ms' } };
  if ((m = BEZIER.exec(v))) return { $type: 'cubicBezier', $value: m[1].split(',').map(Number) };
  if ((m = SHADOW.exec(v))) {
    return {
      $type: 'shadow',
      $value: {
        color: m[5].startsWith('#') ? colorValue(m[5]) : rgbaValue(m[5]),
        offsetX: px(m[1]),
        offsetY: px(m[2]),
        blur: px(m[3]),
        spread: px(m[4] ?? 0),
      },
    };
  }
  if (path.includes('fontFamily') || (path[1] === 'text' && path.at(-1) === 'family')) {
    return { $type: 'fontFamily', $value: v.split(',').map((s) => s.trim().replace(/^'|'$/g, '')) };
  }
  if (/^\d*\.?\d+$/.test(v)) return { $type: 'number', $value: Number(v) };
  return { $value: v, $extensions: { [EXT]: { css: true } } };
}

export function toDtcg(tokens) {
  // First primitive declared with each hex. vermilion* are compat aliases of
  // terracotta and must never be what a semantic token points at.
  const aliases = new Map();
  for (const [key, hex] of Object.entries(tokens.color)) {
    if (key.startsWith('vermilion')) continue;
    const k = hex.toLowerCase();
    if (!aliases.has(k)) aliases.set(k, key);
  }

  const walk = (obj, path) => {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
      const next = [...path, key];
      out[key] = value !== null && typeof value === 'object' ? walk(value, next) : leaf(next, value, aliases);
    }
    return out;
  };
  return walk(tokens, []);
}
