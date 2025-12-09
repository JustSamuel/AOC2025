export class DSU {
  parent: number[];

  size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array.from({ length: n }, () => 1);
  }

  find(a: number) {
    while (this.parent[a] !== a) {
      this.parent[a] = this.parent[this.parent[a]];
      a = this.parent[a];
    }
    return a;
  }

  union(a: number, b: number) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return false;
    if (this.size[a] < this.size[b]) [a, b] = [b, a];
    this.parent[b] = a;
    this.size[a] += this.size[b];
    return true;
  }

  getSize() {
    const roots = new Map<number, number>();
    for (let i = 0; i < this.parent.length; i++) {
      const r = this.find(i);
      roots.set(r, (roots.get(r) ?? 0) + 1);
    }
    return Array.from(roots.values());
  }
}
