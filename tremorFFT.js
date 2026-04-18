export function fft(signal) {
  const N = signal.length;

  if (N <= 1) return signal.map(v => ({ re: v, im: 0 }));

  const even = fft(signal.filter((_, i) => i % 2 === 0));
  const odd = fft(signal.filter((_, i) => i % 2 !== 0));

  const result = Array(N).fill(0).map(() => ({ re: 0, im: 0 }));

  for (let k = 0; k < N / 2; k++) {
    const t = -2 * Math.PI * k / N;
    const exp = {
      re: Math.cos(t),
      im: Math.sin(t)
    };

    const oddVal = odd[k];

    const tRe = exp.re * oddVal.re - exp.im * oddVal.im;
    const tIm = exp.re * oddVal.im + exp.im * oddVal.re;

    result[k] = {
      re: even[k].re + tRe,
      im: even[k].im + tIm
    };

    result[k + N / 2] = {
      re: even[k].re - tRe,
      im: even[k].im - tIm
    };
  }

  return result;
}

export function fftMag(complex) {
  return complex.map(c =>
    Math.sqrt(c.re * c.re + c.im * c.im)
  );
}

export function fftFreq(N, sampleRate) {
  return Array.from({ length: N }, (_, i) =>
    (i * sampleRate) / N
  );
}