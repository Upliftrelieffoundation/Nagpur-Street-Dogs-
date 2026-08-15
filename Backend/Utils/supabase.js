import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Detect if we should use the local database fallback
const useMock = 
  !supabaseUrl || 
  !supabaseServiceKey || 
  supabaseUrl.includes('pggruahenklvcexwpvom') || // user's paused Supabase domain
  supabaseServiceKey === 'your_service_role_key_here' || 
  supabaseServiceKey === '';

let supabase;

if (useMock) {
  console.log('📦 Using Local File Database Fallback (local_db.json)');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const DB_FILE = path.join(__dirname, '..', 'local_db.json');

  // Initialize database file if it doesn't exist
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: [],
      profiles: [],
      blogs: [],
      dogs: [],
      volunteers: [],
      donations: [],
      vet_clinics: [],
      lost_dogs: []
    }, null, 2));
  }

  const readDB = () => {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      return {
        users: [],
        profiles: [],
        blogs: [],
        dogs: [],
        volunteers: [],
        donations: [],
        vet_clinics: [],
        lost_dogs: []
      };
    }
  };

  const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  };

  class MockQueryBuilder {
    constructor(table) {
      this.table = table;
      this.filters = [];
      this.orderBy = null;
      this.isSingle = false;
      this.operation = null; // 'select', 'insert', 'upsert', 'update', 'delete'
      this.opData = null;
    }

    select(fields) {
      this.operation = this.operation || 'select';
      return this;
    }

    eq(column, value) {
      this.filters.push({ column, value });
      return this;
    }

    order(column, options = {}) {
      this.orderBy = { column, ascending: options.ascending !== false };
      return this;
    }

    single() {
      this.isSingle = true;
      return this;
    }

    insert(record) {
      this.operation = 'insert';
      this.opData = record;
      return this;
    }

    upsert(record) {
      this.operation = 'upsert';
      this.opData = record;
      return this;
    }

    update(updateFields) {
      this.operation = 'update';
      this.opData = updateFields;
      return this;
    }

    delete() {
      this.operation = 'delete';
      return this;
    }

    async then(resolve, reject) {
      try {
        const db = readDB();
        if (!db[this.table]) db[this.table] = [];

        let data = db[this.table];

        // Execute Write operations
        if (this.operation === 'insert') {
          const records = Array.isArray(this.opData) ? this.opData : [this.opData];
          db[this.table].push(...records);
          writeDB(db);
          data = records;
        } 
        else if (this.operation === 'upsert') {
          const records = Array.isArray(this.opData) ? this.opData : [this.opData];
          for (const rec of records) {
            const index = db[this.table].findIndex(item => item.id === rec.id || (rec.blog_id && item.blog_id === rec.blog_id));
            if (index > -1) {
              db[this.table][index] = { ...db[this.table][index], ...rec };
            } else {
              db[this.table].push(rec);
            }
          }
          writeDB(db);
          data = records;
        } 
        else if (this.operation === 'update') {
          let updatedData = [];
          db[this.table] = db[this.table].map(item => {
            let matches = true;
            for (const filter of this.filters) {
              if (item[filter.column] !== filter.value) {
                matches = false;
                break;
              }
            }
            if (matches) {
              const updated = { ...item, ...this.opData };
              updatedData.push(updated);
              return updated;
            }
            return item;
          });
          writeDB(db);
          data = updatedData;
        } 
        else if (this.operation === 'delete') {
          let deletedData = [];
          db[this.table] = db[this.table].filter(item => {
            let matches = true;
            for (const filter of this.filters) {
              if (item[filter.column] !== filter.value) {
                matches = false;
                break;
              }
            }
            if (matches) {
              deletedData.push(item);
            }
            return !matches;
          });
          writeDB(db);
          data = deletedData;
        }

        // Execute Read operations / filters
        if (this.operation === 'select' || this.operation === 'update' || this.operation === 'delete' || this.operation === 'upsert') {
          // Apply filters
          for (const filter of this.filters) {
            data = data.filter(item => item[filter.column] === filter.value);
          }

          // Apply sorting
          if (this.orderBy) {
            const { column, ascending } = this.orderBy;
            data.sort((a, b) => {
              if (a[column] < b[column]) return ascending ? -1 : 1;
              if (a[column] > b[column]) return ascending ? 1 : -1;
              return 0;
            });
          }
        }

        if (this.isSingle) {
          resolve({ data: data[0] || null, error: null });
        } else {
          resolve({ data, error: null });
        }
      } catch (err) {
        resolve({ data: null, error: err });
      }
    }
  }

  supabase = {
    from: (table) => new MockQueryBuilder(table),
    auth: {
      signUp: async ({ email, password, options = {} }) => {
        try {
          const db = readDB();
          const existingUser = db.users.find(u => u.email === email);
          if (existingUser) {
            return { data: null, error: new Error('User already registered') };
          }

          const userId = 'mock-' + Math.random().toString(36).substring(2, 15);
          const name = options.data?.full_name || email.split('@')[0];

          // Generate a valid JWT token
          const token = jwt.sign({
            id: userId,
            userId: userId,
            email: email,
            name: name,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year
          }, 'mock-secret');

          const newUser = {
            id: userId,
            email,
            password,
            name: name,
            token: token
          };

          db.users.push(newUser);

          // Create initial profile record so queries don't return null
          const newProfile = {
            id: userId,
            email: email,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          db.profiles.push(newProfile);

          writeDB(db);

          return {
            data: {
              user: { id: userId, email },
              session: { access_token: token, expires_in: 3600 * 24 * 365 }
            },
            error: null
          };
        } catch (err) {
          return { data: null, error: err };
        }
      },

      signInWithPassword: async ({ email, password }) => {
        try {
          const db = readDB();
          const user = db.users.find(u => u.email === email && u.password === password);
          if (!user) {
            return { data: null, error: new Error('Invalid email or password') };
          }

          const profile = db.profiles.find(p => p.id === user.id) || {};

          // Generate a valid JWT token with all profile details
          const token = jwt.sign({
            id: user.id,
            userId: user.id,
            email: user.email,
            name: profile.name || user.name,
            occupation: profile.occupation || null,
            phone: profile.phone || null,
            image: profile.image || null,
            address: {
              street: profile.address_street || null,
              city: profile.address_city || null,
              state: profile.address_state || null,
              pincode: profile.address_pincode || null,
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year
          }, 'mock-secret');

          user.token = token;
          writeDB(db);

          return {
            data: {
              user: { id: user.id, email: user.email },
              session: { access_token: token, expires_in: 3600 * 24 * 365 }
            },
            error: null
          };
        } catch (err) {
          return { data: null, error: err };
        }
      },

      getUser: async (token) => {
        try {
          // Verify local JWT
          const decoded = jwt.verify(token, 'mock-secret');
          return {
            data: {
              user: { id: decoded.id, email: decoded.email }
            },
            error: null
          };
        } catch (err) {
          return { data: { user: null }, error: err };
        }
      }
    }
  };
} else {
  console.log('⚡ Connected to remote Supabase database');
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export default supabase;
