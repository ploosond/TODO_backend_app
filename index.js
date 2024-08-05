const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    res.render('index', {
      files: files,
    });
  });
});

app.post('/create', (req, res) => {
  fs.writeFile(
    `${path.join(__dirname, 'files')}/${req.body.title
      .split(' ')
      .join('')}.txt`,
    req.body.details,
    (err) => {
      res.redirect('/');
    }
  );
});

app.get('/files/:filename', (req, res) => {
  fs.readFile(
    `./files/${req.params.filename}`,
    { encoding: 'utf-8' },
    (err, data) => {
      res.render('show', {
        filename: req.params.filename,
        data: data,
      });
    }
  );
});

app.get('/edit/:filename', (req, res) => {
  res.render('edit', {
    filename: req.params.filename,
  });
});

app.post('/edit', (req, res) => {
  console.log(req.params);
  fs.rename(
    `${path.join(__dirname, 'files')}/${req.body.previous}`,
    `${path.join(__dirname, 'files')}/${req.body.new}`,
    (err) => {
      if (err) console.log(err);
      res.redirect('/');
    }
  );
});

app.listen(3000, () => {
  console.log(`Running on http://localhost:3000`);
});
