const fs = require('fs');
const path = require('path');
const os = require('os');

class VoidlexStore {
  constructor() {
    this.appDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Voidlex');
    if (!fs.existsSync(this.appDataDir)) {
      fs.mkdirSync(this.appDataDir, { recursive: true });
    }
    
    this.configPath = path.join(this.appDataDir, 'config.json');
    this.dbPath = path.join(this.appDataDir, 'cases.json');
    
    this._initStoreFiles();
  }

  _initStoreFiles() {
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, JSON.stringify({
        accepted_terms: false,
        terms_version: "1.0.0",
        accepted_timestamp: "",
        active_model: "voidlex",
        theme: "dark"
      }, null, 2));
    }
    
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([], null, 2));
    }
  }

  // Config accessors
  getConfig() {
    try {
      const data = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  updateConfig(updates) {
    try {
      const current = this.getConfig();
      const updated = { ...current, ...updates };
      fs.writeFileSync(this.configPath, JSON.stringify(updated, null, 2));
      return updated;
    } catch (e) {
      console.error('Error writing config:', e);
      return {};
    }
  }

  // Case history accessors
  listCases() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  getCase(serial) {
    const cases = this.listCases();
    return cases.find(c => c.case_serial === serial) || null;
  }

  saveCase(intake, strategy) {
    try {
      const cases = this.listCases();
      const caseId = cases.length + 1;
      const serial = `VLX-STRAT-${String(caseId).padStart(3, '0')}`;
      
      const newCase = {
        id: caseId,
        case_serial: serial,
        client_name: `${intake.first_name || ''} ${intake.last_name || ''}`.trim(),
        opponent_name: intake.opponent || "N/A",
        category: intake.category || "General",
        created_at: new Date().toISOString(),
        intake: intake,
        strategy: strategy,
        chat_history: []
      };
      
      cases.unshift(newCase); // Place newest at start
      fs.writeFileSync(this.dbPath, JSON.stringify(cases, null, 2));
      return serial;
    } catch (e) {
      console.error('Error saving case:', e);
      return null;
    }
  }

  updateChatHistory(serial, chatHistory) {
    try {
      const cases = this.listCases();
      const idx = cases.findIndex(c => c.case_serial === serial);
      if (idx !== -1) {
        cases[idx].chat_history = chatHistory;
        fs.writeFileSync(this.dbPath, JSON.stringify(cases, null, 2));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error updating chat:', e);
      return false;
    }
  }
}

module.exports = new VoidlexStore();
