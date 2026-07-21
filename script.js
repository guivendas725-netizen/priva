const countdownElement = document.getElementById('countdown');

if (countdownElement) {
  const targetTime = Date.now() + 2 * 60 * 60 * 1000 + 47 * 60 * 1000 + 12 * 1000;

  const updateCountdown = () => {
    const now = Date.now();
    const remaining = Math.max(0, targetTime - now);

    const hours = String(Math.floor(remaining / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((remaining % (1000 * 60)) / 1000)).padStart(2, '0');

    countdownElement.textContent = `${hours}:${minutes}:${seconds}`;

    if (remaining > 0) {
      window.requestAnimationFrame(updateCountdown);
    }
  };

  updateCountdown();
}
