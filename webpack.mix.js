let mix = require('laravel-mix');

mix.setPublicPath('public');


mix.js('src/js/index.js', 'public/js/app.js');

mix.sass('src/sass/main.scss', 'public/css/styles.css');
