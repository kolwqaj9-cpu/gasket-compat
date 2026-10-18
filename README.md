# gasket-compat

Gasket and seal material chemical compatibility lookup — 8 elastomers against 12 industrial fluids.

Full interactive table, with the reasoning behind each rating: **[bentleymfg.com/gasket-material-compatibility.html](https://bentleymfg.com/gasket-material-compatibility.html)**

```
npm install gasket-compat
```

## What it covers

| Materials | Fluids |
|---|---|
| PTFE (Teflon), FKM (Viton), NBR (Buna-N), HNBR, EPDM, Silicone, Neoprene, TPE | mineral oil, gasoline, aromatics, ketones, esters, alcohols, dilute acid, strong acid, alkali, water/steam, refrigerants (R-134a, R-410A), ozone |

Ratings: **4 Excellent · 3 Good · 2 Fair (limited) · 1 Not recommended**

## API

```js
const g = require('gasket-compat');

// one pairing
g.lookup('acetone', 'fkm');
// { fluid: 'Ketones (acetone, MEK)', material: 'FKM (Viton)', score: 1, rating: 'Not recommended' }

// which materials suit a fluid
g.recommend('mineral oil');
// { fluid: 'Mineral oil / lubricant', recommended: [...], avoid: [...] }

// which fluids suit a material
g.suits('epdm');
// { material: 'EPDM', suitableFor: [...], avoid: [...] }
```

## CLI

```bash
npx gasket-compat --list
npx gasket-compat --fluid "mineral oil"
npx gasket-compat --fluid "ketones" --material fkm
npx gasket-compat --material epdm
```

## Where the numbers come from

The four-level rating follows the public elastomer-compatibility consensus, consolidated from:

- **Parker O-Ring Handbook (ORD 5700)**
- **RMA Rubber Handbook — IP-3 Rubber Product Selector**

Cross-checked against published supplier chemical-resistance charts (DuPont, Dow, ExxonMobil). Where the literature disagrees, the more conservative rating is used.

## Disclaimer

Preliminary screening only. Compatibility depends on fluid concentration, temperature, pressure and exposure time. Confirm a specific grade with the material supplier and run an immersion or coupon test before production. This package is reference data, not a design calculation or a qualified procedure.

## License

MIT. The rating table is compiled from public engineering references; the compilation and code are released under MIT.
