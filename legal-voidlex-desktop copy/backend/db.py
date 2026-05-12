import sqlite3
import json
import os
from datetime import datetime

DB_DIR = os.path.expanduser("~/.voidlex")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "voidlex_cases.db")

def init_db():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_serial TEXT UNIQUE NOT NULL,
            client_name TEXT NOT NULL,
            opponent_name TEXT,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            intake_json TEXT NOT NULL,
            strategy_json TEXT NOT NULL,
            chat_history_json TEXT
        )
    ''')
    conn.commit()
    conn.close()

def _generate_serial(case_id: int) -> str:
    return f"VLX-STRAT-{case_id:03d}"

def save_case(intake: dict, strategy: dict) -> str:
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    cursor = conn.cursor()
    
    client = f"{intake.get('first_name', '')} {intake.get('last_name', '')}".strip()
    opponent = intake.get('opponent', 'N/A')
    category = intake.get('category', 'General')
    
    # Insert with temporary serial
    cursor.execute('''
        INSERT INTO cases (case_serial, client_name, opponent_name, category, intake_json, strategy_json)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ("TEMP", client, opponent, category, json.dumps(intake), json.dumps(strategy)))
    
    case_id = cursor.lastrowid
    serial = _generate_serial(case_id)
    
    # Update with actual serial
    cursor.execute('UPDATE cases SET case_serial = ? WHERE id = ?', (serial, case_id))
    
    conn.commit()
    conn.close()
    return serial

def update_chat_history(serial: str, chat_history: list):
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    cursor = conn.cursor()
    cursor.execute('UPDATE cases SET chat_history_json = ? WHERE case_serial = ?', (json.dumps(chat_history), serial))
    conn.commit()
    conn.close()

def get_case(serial: str):
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cases WHERE case_serial = ?', (serial,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "case_serial": row["case_serial"],
            "client_name": row["client_name"],
            "opponent_name": row["opponent_name"],
            "category": row["category"],
            "created_at": row["created_at"],
            "intake": json.loads(row["intake_json"]),
            "strategy": json.loads(row["strategy_json"]),
            "chat_history": json.loads(row["chat_history_json"]) if row["chat_history_json"] else []
        }
    return None

def list_history():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # List newest first
    cursor.execute('SELECT * FROM cases ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        try:
            result.append({
                "id": row["id"],
                "case_serial": row["case_serial"],
                "client_name": row["client_name"],
                "opponent_name": row["opponent_name"],
                "category": row["category"],
                "created_at": row["created_at"],
                "intake": json.loads(row["intake_json"]) if row["intake_json"] else {},
                "strategy": json.loads(row["strategy_json"]) if row["strategy_json"] else {},
                "chat_history": json.loads(row["chat_history_json"]) if row["chat_history_json"] else []
            })
        except Exception as e:
            print(f"Error parsing case record {row.get('case_serial')}: {e}")
            
    return result

def clear_all_cases():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM cases')
    conn.commit()
    conn.close()
    return True
