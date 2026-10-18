'use strict';
/**
 * gasket-compat — gasket & seal material chemical compatibility lookup.
 *
 * Data compiled from the public elastomer-compatibility consensus:
 *   - Parker O-Ring Handbook (ORD 5700)
 *   - RMA Rubber Handbook — IP-3 Rubber Product Selector
 *
 * Preliminary screening only. Confirm a specific grade with the material
 * supplier and run an immersion or coupon test for critical seals.
 *
 * Reference table: https://bentleymfg.com/gasket-material-compatibility.html
 */
const DATA = require('./data/compat.json');

const SCALE = DATA.scale;
const MATERIALS = DATA.materials;
const FLUIDS = DATA.fluids;

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Find a fluid by id, exact name, or fuzzy substring. */
function findFluid(q) {
  const n = normalize(q);
  if (!n) return null;
  const byId = FLUIDS.find((f) => f.id === n);
  if (byId) return byId;
  const byName = FLUIDS.find((f) => normalize(f.name) === n);
  if (byName) return byName;
  return FLUIDS.find((f) => normalize(f.name).includes(n) || normalize(f.id).includes(n)) || null;
}

/** Find a material by id, exact name, or fuzzy substring. */
function findMaterial(q) {
  const n = normalize(q);
  if (!n) return null;
  const byId = MATERIALS.find((m) => m.id === n);
  if (byId) return byId;
  const byName = MATERIALS.find((m) => normalize(m.name) === n);
  if (byName) return byName;
  return MATERIALS.find((m) => normalize(m.name).includes(n) || m.id === n.slice(0, 4)) || null;
}

/**
 * Look up one pairing.
 * @returns {{fluid:string, material:string, score:number, rating:string}|null}
 */
function lookup(fluidQuery, materialQuery) {
  const f = findFluid(fluidQuery);
  const m = findMaterial(materialQuery);
  if (!f || !m) return null;
  const score = f.r[m.id];
  return { fluid: f.name, material: m.name, score, rating: SCALE[String(score)] };
}

/**
 * For a fluid, return materials grouped by suitability.
 * @returns {{fluid:string, recommended:Array, avoid:Array}|null}
 */
function recommend(fluidQuery) {
  const f = findFluid(fluidQuery);
  if (!f) return null;
  const recommended = [];
  const avoid = [];
  MATERIALS.forEach((m) => {
    const v = f.r[m.id];
    if (v >= 3) recommended.push({ material: m.name, score: v, rating: SCALE[String(v)] });
    else if (v <= 1) avoid.push({ material: m.name, score: v, rating: SCALE[String(v)] });
  });
  return { fluid: f.name, recommended, avoid };
}

/**
 * For a material, return which fluids it suits and which it does not.
 */
function suits(materialQuery) {
  const m = findMaterial(materialQuery);
  if (!m) return null;
  const ok = [];
  const bad = [];
  FLUIDS.forEach((f) => {
    const v = f.r[m.id];
    if (v >= 3) ok.push({ fluid: f.name, score: v, rating: SCALE[String(v)] });
    else if (v <= 1) bad.push({ fluid: f.name, score: v, rating: SCALE[String(v)] });
  });
  return { material: m.name, suitableFor: ok, avoid: bad };
}

module.exports = {
  materials: MATERIALS,
  fluids: FLUIDS,
  scale: SCALE,
  sources: DATA.sources,
  disclaimer: DATA.disclaimer,
  findFluid,
  findMaterial,
  lookup,
  recommend,
  suits,
};
