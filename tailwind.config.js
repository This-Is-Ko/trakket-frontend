/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
    content: [
        './app.vue',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './components/**/*.vue',
        './plugins/**/*.js',
    ],
    darkMode: ['class', '[class="p-dark"]'], // supports Tailwind + PrimeVue dark
    plugins: [PrimeUI],
};