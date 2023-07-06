/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                "primary": "#2da2a1",
                "secondary": "#0a011b"
            }
        },
        fontFamily: {
            "mono": ["Quantico", 'ui-monospace', 'SFMono-Regular']
        }
    },
    plugins: [],
}

