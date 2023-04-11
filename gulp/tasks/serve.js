module.exports = function () {
    const gulp = require('gulp');
    const pug = require('gulp-pug');
    const browserSync = require('browser-sync').create();
    const express = require('express');
    const path = require('path');
    require('dotenv').config();

    gulp.task('views', function buildViews() {
        return gulp.src('src/pug/*.pug')
            .pipe(pug({
                // options for Pug compiler go here
            }))
            .pipe(gulp.dest('build'));
    });

    gulp.task('serve', function () {
        var app = express();
        app.set('views', path.join(__dirname, '../../', 'src', 'pug')); // update the views directory path
        app.set('view engine', 'pug');

        app.get('/', function(req, res) {
            fetch(`${process.env.API_URL}/inventory/cars`, {method: 'GET'})
                .then(response => response.json())
                .then(cars => {
                    res.locals.cars = cars;
                    res.render('index');
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Internal server error');
                });
        });

        app.get('/catalog', function(req, res) {
            fetch(`${process.env.API_URL}/inventory/cars`, {method: 'GET'})
                .then(response => response.json())
                .then(cars => {
                    res.locals.cars = cars;
                    res.render('catalog');
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Internal server error');
                });
        });

        app.get('/:vin', function(req, res) {
            const vin = req.params.vin
            fetch(`${process.env.API_URL}/car/${vin}`, {method: 'GET'})
                .then(response => response.json())
                .then(car => {
                    res.locals.car = car;
                    res.render('product');
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Internal server error');
                });
        });

        app.use(express.static('build'));

        app.listen(3000, function() {
            console.log('Server listening on port 3000');
        });

        browserSync.init({
            proxy: 'http://localhost:3000',
            files: ['build/**/*.*'],
            port: 3000
        });

        gulp.watch('src/pug/**/*.pug', gulp.series('views'));
    });
};
