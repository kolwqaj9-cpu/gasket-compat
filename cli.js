#!/usr/bin/env node
'use strict';
/**
 * gasket-compat CLI
 *
 *   npx gasket-compat --fluid "mineral oil"
 *   npx gasket-compat --fluid "ketones" --material fkm
 *   npx gasket-compat --material epdm
 *   npx gasket-compat --list
 */
const lib = require('./index.js');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fluid' || a === '-f') out.fluid = argv[++i];
    else if (a === '--material' || a === '-m') out.material = argv[++i];
    else if (a === '--list' || a === '-l') out.list = true;
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function bar(score) {
  return ['', '#', '##', '###', '####'][score] || '';
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || (!args.fluid && !args.material && !args.list)) {
    console.log(`gasket-compat — gasket & seal material chemical compatibility

Usage:
  npx gasket-compat --fluid "mineral oil"
  npx gasket-compat --fluid "ketones" --material fkm
  npx gasket-compat --material epdm
  npx gasket-compat --list

Ratings: 4 Excellent | 3 Good | 2 Fair (limited) | 1 Not recommended
Source:  ${lib.sources.join('; ')}
Details: https://bentleymfg.com/gasket-material-compatibility.html
`);
    return;
  }

  if (args.list) {
    console.log('\nMaterials:');
    lib.materials.forEach((m) => console.log(`  ${m.id.padEnd(6)} ${m.name}`));
    console.log('\nFluids:');
    lib.fluids.forEach((f) => console.log(`  ${f.id.padEnd(10)} ${f.name}`));
    return;
  }

  if (args.fluid && args.material) {
    const r = lib.lookup(args.fluid, args.material);
    if (!r) {
      console.error('No match. Try --list to see supported ids.');
      process.exitCode = 1;
      return;
    }
    console.log(`${r.fluid}  ×  ${r.material}`);
    console.log(`  ${r.rating}  ${bar(r.score)} (${r.score}/4)`);
    return;
  }

  if (args.fluid) {
    const r = lib.recommend(args.fluid);
    if (!r) {
      console.error('Fluid not found. Try --list.');
      process.exitCode = 1;
      return;
    }
    console.log(`\nFluid: ${r.fluid}`);
    if (r.recommended.length) {
      console.log('  Suitable:');
      r.recommended.forEach((x) => console.log(`    ${x.material.padEnd(18)} ${x.rating}`));
    }
    if (r.avoid.length) {
      console.log('  Avoid:');
      r.avoid.forEach((x) => console.log(`    ${x.material.padEnd(18)} ${x.rating}`));
    }
    return;
  }

  if (args.material) {
    const r = lib.suits(args.material);
    if (!r) {
      console.error('Material not found. Try --list.');
      process.exitCode = 1;
      return;
    }
    console.log(`\nMaterial: ${r.material}`);
    console.log('  Suitable for:');
    r.suitableFor.forEach((x) => console.log(`    ${x.fluid.padEnd(40)} ${x.rating}`));
    if (r.avoid.length) {
      console.log('  Avoid:');
      r.avoid.forEach((x) => console.log(`    ${x.fluid.padEnd(40)} ${x.rating}`));
    }
  }
}

main();
