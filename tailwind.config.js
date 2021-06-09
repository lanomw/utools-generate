module.exports = {
    purge: [ './src/**/*.{js,jsx,ts,tsx}', './public/index.html' ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: { /*变体*/
        extend: {
            margin: ['first', 'last'],
            userSelect: ['hover', 'focus'],
        },
    },
    plugins: [],
}
