// ══════════════════════════════════════════════════════════════════════════════
// NEXUS AM — AccountsSpine.gs
// Team-specific trigger wrappers. Spine rebuild logic is in NEXUS_LIB.
// ══════════════════════════════════════════════════════════════════════════════

// ── Custom menu (bound to the DB spreadsheet, not the web app) ──────────────
function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('NEXUS Admin')
      .addItem('Rebuild Accounts Spine', 'rebuildSpine_Carlos')
      .addItem('Add New Account', 'addNewAccountManual')
      .addToUi();
  } catch(e) {}
}

// ── Run directly from Script Editor ─────────────────────────────────────────
function rebuildSpine_Carlos() { return NX.buildAccountsSpineForTeam(HUB, 'Carlos'); }
function rebuildSpine_Daniel() { return NX.buildAccountsSpineForTeam(HUB, 'Daniel'); }

function addNewAccountManual() {
  var NAME = 'Type the partner name here';
  var result = NX.addNewAccount(HUB, NAME, '');
  Logger.log(JSON.stringify(result));
}
