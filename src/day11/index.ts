import run from "aocrunner";

const parse = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .reduce((g, line) => {
      const [u, o] = line.split(": ");
      g[u] = o.split(" ");
      return g;
    }, {} as Record<string, string[]>);

const count = (
  graph: Record<string, string[]>,
  source: string,
  target: string,
): number => {
  if (source === target) return 1;
  let c = 0;
  for (const n of graph[source]!) c += count(graph, n, target);
  return c;
};

const part1 = (raw: string) => count(parse(raw), "you", "out");

const reach = (graph: Record<string, string[]>) => {
  const R = new Map<string, Set<string>>();
  const N = new Set<string>();

  for (const u in graph) {
    N.add(u);
    for (const v of graph[u]) N.add(v);
  }

  for (const n of N) {
    const s = new Set<string>();
    const st = [n];
    while (st.length) {
      const u = st.pop()!;
      if (s.has(u)) continue;
      s.add(u);
      for (const v of graph[u] ?? []) st.push(v);
    }
    R.set(n, s);
  }
  return R;
};

const part2 = (raw: string) => {
  const g = parse(raw);
  const R = reach(g);

  const A = "dac";
  const B = "fft";
  const T = "out";
  const S = "svr";

  const M = new Map<string, number>();
  const k = (n: string, a: boolean, b: boolean) =>
    `${n}|${a ? 1 : 0}${b ? 1 : 0}`;

  const dfs = (n: string, a: boolean, b: boolean): number => {
    if (n === T) return a && b ? 1 : 0;

    const r = R.get(n)!;
    if (!a && !r.has(A)) return 0;
    if (!b && !r.has(B)) return 0;
    if (!r.has(T)) return 0;

    const kk = k(n, a, b);
    if (M.has(kk)) return M.get(kk)!;

    let cnt = 0;
    for (const v of g[n] ?? []) cnt += dfs(v, a || v === A, b || v === B);

    M.set(kk, cnt);
    return cnt;
  };

  return dfs(S, S === A, S === B);
};

run({
  part1: {
    tests: [
      {
        input: `
aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
