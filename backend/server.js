const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create the database directory if it doesn't exist
const dbDir = path.join(__dirname, 'databases');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Function to get a database connection for a specific user
function getUserDB(username) {
  const dbPath = path.join(dbDir, `${username}.db`);
  const db = new sqlite3.Database(dbPath);
  
  // Initialize the database schema if it doesn't exist
  db.serialize(() => {
    // Create user_data table for storing snapshots of user data
    db.run(`CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      username TEXT,
      height REAL,
      weight REAL,
      age INTEGER,
      gender TEXT,
      data_json TEXT
    )`);

    // Keep the individual tables for potential querying
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS user_profile (
      username TEXT PRIMARY KEY,
      height REAL,
      weight REAL,
      age INTEGER,
      gender TEXT
    )`);

    // Create workouts table
    db.run(`CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      date TEXT,
      type TEXT,
      duration INTEGER,
      description TEXT,
      distance REAL
    )`);

    // Create meals table
    db.run(`CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      date TEXT,
      name TEXT,
      calories INTEGER,
      protein REAL,
      carbs REAL,
      fat REAL,
      mealType TEXT
    )`);

    // Create goals table
    db.run(`CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      target REAL,
      current REAL,
      unit TEXT,
      startDate TEXT,
      endDate TEXT,
      type TEXT
    )`);
  });

  return db;
}

// Save all user data
app.post('/api/save-data', (req, res) => {
  const { username, profileData, workouts, meals, goals } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = getUserDB(username);
  const timestamp = new Date().toISOString();

  // Begin a transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    try {
      // Save everything as a snapshot in user_data table
      const dataJson = JSON.stringify({
        profileData,
        workouts,
        meals,
        goals
      });

      db.run(
        `INSERT INTO user_data (timestamp, username, height, weight, age, gender, data_json) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          timestamp,
          username,
          profileData?.height || null,
          profileData?.weight || null,
          profileData?.age || null,
          profileData?.gender || null,
          dataJson
        ]
      );

      // Also update the individual tables for data access
      // Save profile data
      if (profileData) {
        db.run(
          `INSERT OR REPLACE INTO user_profile (username, height, weight, age, gender) 
           VALUES (?, ?, ?, ?, ?)`,
          [username, profileData.height, profileData.weight, profileData.age, profileData.gender]
        );
      }

      // Clear existing workouts and insert new ones
      db.run('DELETE FROM workouts');
      if (workouts && workouts.length > 0) {
        const workoutStmt = db.prepare(
          `INSERT INTO workouts (id, date, type, duration, description, distance) 
           VALUES (?, ?, ?, ?, ?, ?)`
        );
        
        workouts.forEach(workout => {
          workoutStmt.run(
            workout.id,
            workout.date,
            workout.type,
            workout.duration,
            workout.description || null,
            workout.distance || null
          );
        });
        
        workoutStmt.finalize();
      }

      // Clear existing meals and insert new ones
      db.run('DELETE FROM meals');
      if (meals && meals.length > 0) {
        const mealStmt = db.prepare(
          `INSERT INTO meals (id, date, name, calories, protein, carbs, fat, mealType) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        
        meals.forEach(meal => {
          mealStmt.run(
            meal.id,
            meal.date,
            meal.name,
            meal.calories,
            meal.protein,
            meal.carbs,
            meal.fat,
            meal.mealType
          );
        });
        
        mealStmt.finalize();
      }

      // Clear existing goals and insert new ones
      db.run('DELETE FROM goals');
      if (goals && goals.length > 0) {
        const goalStmt = db.prepare(
          `INSERT INTO goals (id, title, description, target, current, unit, startDate, endDate, type) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        
        goals.forEach(goal => {
          goalStmt.run(
            goal.id,
            goal.title,
            goal.description || null,
            goal.target,
            goal.current,
            goal.unit,
            goal.startDate,
            goal.endDate,
            goal.type
          );
        });
        
        goalStmt.finalize();
      }

      // Commit the transaction
      db.run('COMMIT');

      // Get the ID of the newly inserted record
      db.get('SELECT last_insert_rowid() as lastId', [], (err, row) => {
        if (err) {
          console.error('Error getting last insert ID:', err);
          res.json({ 
            success: true, 
            message: 'Data saved successfully', 
            dbFile: `${username}.db` 
          });
        } else {
          res.json({ 
            success: true, 
            message: 'Data saved successfully', 
            dbFile: `${username}.db`,
            recordId: row.lastId
          });
        }
      });
    } catch (error) {
      // Rollback on error
      db.run('ROLLBACK');
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    } finally {
      // Close the database connection
      db.close();
    }
  });
});

// Get all user data history
app.get('/api/get-data-history/:username', (req, res) => {
  const { username } = req.params;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = getUserDB(username);

  db.all('SELECT id, timestamp, height, weight, age, gender FROM user_data WHERE username = ? ORDER BY id DESC', 
    [username], 
    (err, rows) => {
      if (err) {
        console.error('Error fetching data history:', err);
        res.status(500).json({ error: 'Failed to retrieve data history' });
      } else {
        res.json({ history: rows || [] });
      }
      
      db.close();
    }
  );
});

// Get specific data snapshot by ID
app.get('/api/get-data-snapshot/:username/:id', (req, res) => {
  const { username, id } = req.params;
  
  if (!username || !id) {
    return res.status(400).json({ error: 'Username and record ID are required' });
  }

  const db = getUserDB(username);

  db.get('SELECT * FROM user_data WHERE username = ? AND id = ?', 
    [username, id], 
    (err, row) => {
      if (err) {
        console.error('Error fetching data snapshot:', err);
        res.status(500).json({ error: 'Failed to retrieve data snapshot' });
      } else if (!row) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        // Parse the JSON data
        try {
          const userData = JSON.parse(row.data_json);
          res.json({
            id: row.id,
            timestamp: row.timestamp,
            username: row.username,
            profileData: {
              height: row.height,
              weight: row.weight,
              age: row.age,
              gender: row.gender
            },
            ...userData
          });
        } catch (e) {
          console.error('Error parsing JSON data:', e);
          res.status(500).json({ error: 'Failed to parse data snapshot' });
        }
      }
      
      db.close();
    }
  );
});

// Get all user data (for potential restore functionality)
app.get('/api/get-data/:username', (req, res) => {
  const { username } = req.params;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = getUserDB(username);
  const userData = { profileData: null, workouts: [], meals: [], goals: [] };

  db.serialize(() => {
    // Get profile data
    db.get('SELECT * FROM user_profile WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error fetching profile data:', err);
      } else if (row) {
        userData.profileData = row;
      }
    });

    // Get workouts
    db.all('SELECT * FROM workouts', [], (err, rows) => {
      if (err) {
        console.error('Error fetching workouts:', err);
      } else {
        userData.workouts = rows || [];
      }
    });

    // Get meals
    db.all('SELECT * FROM meals', [], (err, rows) => {
      if (err) {
        console.error('Error fetching meals:', err);
      } else {
        userData.meals = rows || [];
      }
    });

    // Get goals
    db.all('SELECT * FROM goals', [], (err, rows) => {
      if (err) {
        console.error('Error fetching goals:', err);
      } else {
        userData.goals = rows || [];
        
        // Return complete data after all queries finish
        res.json(userData);
      }
    });
  });

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
  });
});

// Server status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'running' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
