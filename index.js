const express = require("express");
const db = require('./db/database');
const app = express();
const port = 3000;


app.use(express.json());

app.get('/',(req, res)=>{
    res.send("Ahoj vítej v aplikaci MUBO!");
});

app.listen(port,()=>{
    console.log(`Server beží na http://localhost:${port}`);
});

// Endpoint pro přidání knihy
app.post('/add-book', (req, res) => {
    const { title, author, year, genre, description } = req.body;

    const sql = 'INSERT INTO books (title, author, year, genre, description, available) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, author, year, genre, description, true]; // "true" znamená, že je kniha dostupná

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při přidávání knihy:', err);
            res.status(500).send('Chyba při přidávání knihy.');
        } else {
            res.status(200).send('Kniha byla úspěšně přidána.');
        }
    });
});

// Endpoint pro zobrazení seznamu knih
app.get('/books', (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
      if (err) {
        console.error("Chyba při získávání knih: ", err.message);
        return res.status(500).send("Chyba při získávání knih.");
      }
      res.json(result);
    });
  });

  // Endpoint pro úpravu knihy
  app.put('/edit-book/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre, description } = req.body;

    const sql = 'UPDATE books SET title = ?, author = ?, year = ?, genre = ?, description = ? WHERE id = ?';
    const values = [title, author, year, genre, description, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při editaci knihy:', err);
            res.status(500).send('Chyba při editaci knihy.');
        } else {
            res.status(200).send('Kniha byla úspěšně editována.');
        }
    });
});


// Endpoint pro odstranění knihy
app.delete('/delete-book/:id', (req, res) => {
    const bookId = req.params.id;

    const sql = 'DELETE FROM books WHERE id = ?';

    db.query(sql, [bookId], (err, result) => {
        if (err) {
            console.error('Chyba při mazání knihy:', err);
            res.status(500).send('Chyba při mazání knihy.');
        } else {
            res.status(200).send('Kniha byla úspěšně odstraněna.');
        }
    });
});

// Endpoint pro vyhledávání knih
app.get('/search-books', (req, res) => {
    const { title, author, genre } = req.query;

    let sql = 'SELECT * FROM books WHERE 1=1';
    const values = [];

    if (title) {
        sql += ' AND title LIKE ?';
        values.push(`%${title}%`);
    }
    if (author) {
        sql += ' AND author LIKE ?';
        values.push(`%${author}%`);
    }
    if (genre) {
        sql += ' AND genre LIKE ?';
        values.push(`%${genre}%`);
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při vyhledávání knih:', err);
            return res.status(500).send('Chyba při vyhledávání knih.');
        }
        res.json(result);
    });
});

// Endpoint pro změnu dostupnosti knihy
app.put('/update-availability/:id', (req, res) => {
    const { id } = req.params;
    const { available } = req.body; // očekáváme boolean hodnotu pro dostupnost

    const sql = 'UPDATE books SET available = ? WHERE id = ?';
    const values = [available, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Chyba při změně dostupnosti knihy:', err);
            return res.status(500).send('Chyba při změně dostupnosti knihy.');
        }
        res.status(200).send('Dostupnost knihy byla úspěšně změněna.');
    });
});