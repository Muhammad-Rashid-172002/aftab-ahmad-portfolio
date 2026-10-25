/**
 * Simplified analytical model of a two-coil resonant inductive link, calibrated to
 * the supplied research parameters (433 kHz, 14 mm, 0°, k = 0.372, η = 88 %).
 *
 * Assumptions & limitations (also shown in the UI):
 *  1. Coupling vs. separation uses the on-axis thin-loop approximation
 *     k(d) = (1 + (d / r)²)^(-3/2), with an equivalent radius r solved so that
 *     k(14 mm) = 0.372. Real planar spirals deviate from this.
 *  2. Angular misalignment is modelled as k·cos θ (small-coil approximation).
 *  3. Peak link efficiency uses the standard figure-of-merit expression
 *     η = U² / (1 + √(1 + U²))², U = k·√(Q₁Q₂), with √(Q₁Q₂) solved so η = 0.88
 *     at the baseline point.
 *  4. Driving away from the 433 kHz resonance scales efficiency by a normalised
 *     tank response 1 / (1 + Q_L²(f/f₀ − f₀/f)²), with an assumed loaded Q_L = 10.
 *  5. Tissue losses, SAR and thermal behaviour are NOT computed. The SAR and
 *     thermal figures shown are the supplied research values at the baseline only.
 */

export const BASE = { f0: 433, d0: 14, k0: 0.372, eta0: 0.88 };
const QL = 10;

/** Equivalent loop radius (mm) satisfying k(d0) = k0. */
export const R_EQ = BASE.d0 / Math.sqrt(Math.pow(BASE.k0, -2 / 3) - 1);

/** √(Q₁Q₂) that gives η0 at k0. */
export const Q_EFF = (() => {
  const s = (1 + BASE.eta0) / (1 - BASE.eta0); // from η = (s-1)/(s+1), s = √(1+U²)
  const U = Math.sqrt(s * s - 1);
  return U / BASE.k0;
})();

export function coupling(dMm: number, thetaDeg: number) {
  const geo = Math.pow(1 + Math.pow(dMm / R_EQ, 2), -1.5);
  return geo * Math.cos((thetaDeg * Math.PI) / 180);
}

export function tankResponse(fKHz: number) {
  const x = fKHz / BASE.f0 - BASE.f0 / fKHz;
  return 1 / (1 + QL * QL * x * x);
}

export function efficiency(k: number, fKHz: number) {
  const U2 = Math.pow(k * Q_EFF, 2);
  const etaMax = U2 / Math.pow(1 + Math.sqrt(1 + U2), 2);
  return etaMax * tankResponse(fKHz);
}

export function evaluate(dMm: number, thetaDeg: number, fKHz: number) {
  const k = Math.max(0, coupling(dMm, thetaDeg));
  return { k, eta: efficiency(k, fKHz), relCoupling: k / BASE.k0, tank: tankResponse(fKHz) };
}
