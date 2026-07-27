# mlx-quant-viz

**Interactive ternary matrix visualization. Part of the 8b-is mesh.**

https://mlx-quant-viz.pages.dev

## What it shows

- **Matrix view**: 256×256 pixel grid — blue=-1, dark=0, purple=+1 — fp32 vs ternary side-by-side
- **Packed binary**: click any row to inspect uint32 words with 16 two-bit codes LSB-first
- **N→N-x recursion**: 6 compression layers (256→192→128→64→32→16)
- **Distribution histogram**: bar chart of {-1, 0, +1} counts
- **Interactive**: sliders for group_size (32/64/128) and dimension (64-1024)

## The seed

The matrix is not random. It's seeded from a conversation — LINOSV — hashed with SHA-256, fed through a Xoshiro128** PRNG. Same seed, same matrix, every time, on every machine:

```
SHA-256(LINOSV_SEED) → Xoshiro128** → ternary quantized weights
```

This is the visualization layer of the ayeOS mesh:

| Layer | Project |
|-------|---------|
| CPU (hearth) | [kernel8](https://github.com/8b-is/kernel8) |
| GPU (brain) | [MLX-QUANT](https://github.com/8b-is/MLX-QUANT) |
| Coord | [vaked](https://github.com/8b-is/vaked) |
| **Viz** | mlx-quant-viz (this repo) |
| Daemon | [ayeOS](https://github.com/8b-is/ayeos) |

## Deploy

Static HTML, zero dependencies. Deployed on Cloudflare Pages at `mlx-quant-viz.pages.dev`, custom domain `matriq.net`.

```bash
npx wrangler pages deploy .
```
