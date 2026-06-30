// ══════════════════════════════════════════════════════════════════════════════
// NEXUS AM — Code.gs (Thin Wrapper)
// All shared logic lives in NEXUS_LIB (identifier: NX)
// Library Script ID: 1YPhuTPy8H8DbI5c_WhFlJXlAVqCvjLE8UEWshKQhpT-Pa-R6f5KOl1Lf
// V3.0 — new Outreach wizard + Campaigns Dashboard wrappers.
// V3.1 — Snapshot wrappers (NX_Snapshot) + local trigger management.
// ══════════════════════════════════════════════════════════════════════════════

// ── Identity ────────────────────────────────────────────────────────────────
var HUB = 'AM';

// ── Web App ─────────────────────────────────────────────────────────────────
function doGet(e) {
  // Deep-link: ?team=<name> and/or ?view=<head|admin|…> boots NEXUS into that
  // team/view. The client applies it after load, gated by the same permissions
  // (a forbidden link shows the no-permission card / the user's own team).
  var p = (e && e.parameter) || {};
  var tpl = HtmlService.createTemplateFromFile('nexus');
  tpl.deepJson = JSON.stringify({ team: String(p.team || ''), view: String(p.view || '') }).replace(/</g, '\\u003c');
  return tpl.evaluate()
    .setTitle('NEXUS').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include(f) { return HtmlService.createHtmlOutputFromFile(f).getContent(); }
function getScriptUrl() { return ScriptApp.getService().getUrl(); }
function getActiveUserEmail() { return Session.getActiveUser().getEmail(); }

// ══════════════════════════════════════════════════════════════════════════════
// THIN WRAPPERS — delegate to NX library
// Every google.script.run.X() call in the HTML hits one of these.
// ══════════════════════════════════════════════════════════════════════════════

// ── Permissions & Config ────────────────────────────────────────────────────
function getUserPermissions()       { return NX.getUserPermissions(HUB); }
function getMailConfig(team)        { return NX.getMailConfig(HUB, team); }

// AI-01 — one-shot boot. Bundles the serial startup reads (email → permissions →
// mail config → team lead) into a SINGLE execution that shares one NX sheet
// handle, so the app paints after one round-trip instead of four. Every sub-read
// is isolated in its own try/catch so a single failure can't blank the boot —
// the frontend degrades per-field (and falls back to the legacy calls if needed).
function bootstrapAM() {
  var out = { email: '', perms: null, mailConfig: null, teamLead: '' };
  try { out.email = Session.getActiveUser().getEmail(); } catch (e) {}
  try { out.perms = NX.getUserPermissions(HUB); } catch (e) { out.permsError = String(e && e.message || e); }
  var team = (out.perms && out.perms.team) || '';
  if (team) {
    try { out.mailConfig = NX.getMailConfig(HUB, team); } catch (e) {}
    try { out.teamLead = NX.getTeamLeadEmail(HUB, team) || ''; } catch (e) {}
  }
  return out;
}

// ── Data Loading ────────────────────────────────────────────────────────────
function getUnifiedPartnerData(team){ return NX.getUnifiedPartnerData(HUB, team); }

// ── Snapshot (V3.1 — Carlos; V3.8 — all AM teams) ─────────────────────────
// initSnapshotAM_<team>: run ONCE manually per team to create the Drive file.
//   Paste the returned fileId into NX_Config.SNAPSHOT_FILE_IDS['AM_<team>']
//   and bump the library version.
// generateSnapshotAM_<team>: manual + trigger handler. Writes a fresh snapshot.
// installSnapshotTriggerAM_<team>: installs a 5-min time trigger.
// removeSnapshotTriggersAM_<team>: removes triggers for that team only.
//
// Triggers MUST be installed from THIS project (not the library) because
// ScriptApp binds handlers to the project that creates the trigger.
// Whoever runs installSnapshotTrigger* becomes the trigger's execution
// identity — for production this is the shared AM account.
//
// LEGACY (V3.1) wrappers without team suffix are retained below for
// back-compat with any bookmarks / external callers — they all resolve
// to Carlos, the original team.

var SNAPSHOT_TEAM_AM = 'Carlos';  // legacy default for the un-suffixed wrappers

// Per-team init — run each ONCE, paste returned fileId into NX_Config
function initSnapshotAM_Carlos() { return NX.initSnapshotFile(HUB, 'Carlos'); }
function initSnapshotAM_Daniel() { return NX.initSnapshotFile(HUB, 'Daniel'); }
function initSnapshotAM_Tanya()  { return NX.initSnapshotFile(HUB, 'Tanya');  }

// Per-team generate — these are the trigger handlers
function generateSnapshotAM_Carlos() { return NX.generateSnapshot(HUB, 'Carlos'); }
function generateSnapshotAM_Daniel() { return NX.generateSnapshot(HUB, 'Daniel'); }
function generateSnapshotAM_Tanya()  { return NX.generateSnapshot(HUB, 'Tanya');  }

// Per-team read paths — bound to a specific team (mirrors V3.1 Carlos wrapper)
function getSnapshotAM_Carlos()    { return NX.getSnapshot(HUB, 'Carlos'); }
function getSnapshotAM_Daniel()    { return NX.getSnapshot(HUB, 'Daniel'); }
function getSnapshotAM_Tanya()     { return NX.getSnapshot(HUB, 'Tanya');  }
function getSnapshotRawAM_Carlos() { return NX.getSnapshotRaw(HUB, 'Carlos'); }
function getSnapshotRawAM_Daniel() { return NX.getSnapshotRaw(HUB, 'Daniel'); }
function getSnapshotRawAM_Tanya()  { return NX.getSnapshotRaw(HUB, 'Tanya');  }
function getSnapshotMetaAM_Carlos(){ return NX.getSnapshotMeta(HUB, 'Carlos'); }
function getSnapshotMetaAM_Daniel(){ return NX.getSnapshotMeta(HUB, 'Daniel'); }
function getSnapshotMetaAM_Tanya() { return NX.getSnapshotMeta(HUB, 'Tanya');  }

// V3.8 — The frontend snapshot client (nx_snapshot_client) calls
// getSnapshotRawAM with a team argument, so we expose a team-aware router too.
// This is the preferred entry point for the AM frontend; the team-specific
// wrappers above are kept for manual use from the GAS editor.
function getSnapshotRawAM(team) {
  team = team || SNAPSHOT_TEAM_AM;
  return NX.getSnapshotRaw(HUB, team);
}
function getSnapshotMetaAM(team) {
  team = team || SNAPSHOT_TEAM_AM;
  return NX.getSnapshotMeta(HUB, team);
}

// Per-team sharing sync (manual — auto-runs inside generateSnapshot)
function resyncSnapshotSharingAM_Carlos() { return NX.resyncSnapshotSharing(HUB, 'Carlos'); }
function resyncSnapshotSharingAM_Daniel() { return NX.resyncSnapshotSharing(HUB, 'Daniel'); }
function resyncSnapshotSharingAM_Tanya()  { return NX.resyncSnapshotSharing(HUB, 'Tanya');  }

// LEGACY un-suffixed wrappers — all resolve to Carlos (original V3.1 default).
// Kept for back-compat; the frontend now calls the team-aware router above.
function initSnapshotAM()           { return NX.initSnapshotFile(HUB, SNAPSHOT_TEAM_AM); }
function generateSnapshotAM()       { return NX.generateSnapshot(HUB, SNAPSHOT_TEAM_AM); }
function getSnapshotAM()            { return NX.getSnapshot(HUB, SNAPSHOT_TEAM_AM); }
function resyncSnapshotSharingAM()  { return NX.resyncSnapshotSharing(HUB, SNAPSHOT_TEAM_AM); }

// ── Trigger management (per-team) ──────────────────────────────────────────
// Install ONE trigger per team. Each resolves its own generateSnapshotAM_<team>
// handler, stagger-safe because NX.generateSnapshot takes a script-wide lock.
//
// Usage from GAS editor:
//   installSnapshotTriggerAM_Carlos()  → installs 5-min trigger for Carlos
//   installSnapshotTriggerAM_Daniel()  → same for Daniel
//   installAllSnapshotTriggersAM()     → installs all 4 at once

function installSnapshotTriggerAM_Carlos(m) { return _installTeamTrigger_('generateSnapshotAM_Carlos', m); }
function installSnapshotTriggerAM_Daniel(m) { return _installTeamTrigger_('generateSnapshotAM_Daniel', m); }
function installSnapshotTriggerAM_Tanya(m)  { return _installTeamTrigger_('generateSnapshotAM_Tanya',  m); }

function installAllSnapshotTriggersAM(m) {
  return {
    Carlos: installSnapshotTriggerAM_Carlos(m),
    Daniel: installSnapshotTriggerAM_Daniel(m),
    Tanya:  installSnapshotTriggerAM_Tanya(m),
  };
}

function removeSnapshotTriggersAM_Carlos() { return _removeTeamTrigger_('generateSnapshotAM_Carlos'); }
function removeSnapshotTriggersAM_Daniel() { return _removeTeamTrigger_('generateSnapshotAM_Daniel'); }
function removeSnapshotTriggersAM_Tanya()  { return _removeTeamTrigger_('generateSnapshotAM_Tanya');  }

// V3.1 legacy — removes the un-suffixed Carlos trigger if ever installed
function installSnapshotTriggerAM(m) { return _installTeamTrigger_('generateSnapshotAM', m); }
function removeSnapshotTriggersAM()  { return _removeTeamTrigger_('generateSnapshotAM'); }

function _installTeamTrigger_(handlerName, minutes) {
  minutes = minutes || 5;
  ScriptApp.getProjectTriggers().forEach(function(tr) {
    if (tr.getHandlerFunction() === handlerName) ScriptApp.deleteTrigger(tr);
  });
  ScriptApp.newTrigger(handlerName).timeBased().everyMinutes(minutes).create();
  return { installed: handlerName, everyMinutes: minutes };
}

function _removeTeamTrigger_(handlerName) {
  var removed = 0;
  ScriptApp.getProjectTriggers().forEach(function(tr) {
    if (tr.getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(tr); removed++;
    }
  });
  return { removed: removed, handler: handlerName };
}

// ── CRM Writes ──────────────────────────────────────────────────────────────
function updateDealFromDashboard(d) { return NX.updateDealFromDashboard(HUB, d); }
function createEvent(eventData)     { return NX.createEvent(HUB, eventData); }
function logCall(callData)          { return NX.logCall(HUB, callData); }

// ── Email ───────────────────────────────────────────────────────────────────
function sendMail(to, subject, htmlBody, storeName, templateName, partnerData, contactData, extras) {
  return NX.sendMail(HUB, to, subject, htmlBody, storeName, templateName, partnerData, contactData, extras);
}
function getDrafts()                { return NX.getDrafts(HUB); }
function logProxySend(to, storeName, templateName, subject, sentBy, threadId, teamName, extras) {
  return NX.logProxySend(HUB, to, storeName, templateName, subject, sentBy, threadId, teamName, extras);
}
function stageProxyQueue(queueJson) { return NX.stageProxyQueue(HUB, queueJson); }

// ── Outreach Engine (V3.0) ──────────────────────────────────────────────────
function buildCampaignPreview(audience, options) {
  return NX.buildCampaignPreview(HUB, audience, options);
}
function executeCampaign(previews, meta, team) {
  return NX.executeCampaign(HUB, previews, meta, team);
}
function logCampaignSend(payload, team) {
  return NX.logCampaignSend(HUB, payload, team);
}
function fetchGDocTemplate(docUrlOrId) {
  return NX.fetchGDocTemplate(HUB, docUrlOrId);
}
function fetchGSheetMergeVars(sheetUrlOrId) {
  return NX.fetchGSheetMergeVars(HUB, sheetUrlOrId);
}
function getCustomTemplates()                     { return NX.getCustomTemplates(HUB); }
function saveCustomTemplate(entry)                { return NX.saveCustomTemplate(HUB, entry); }
function deleteCustomTemplate(docUrl)             { return NX.deleteCustomTemplate(HUB, docUrl); }

// ── Campaigns Dashboard (V3.0) ──────────────────────────────────────────────
function getCampaignsList(days, team)             { return NX.getCampaignsList(HUB, days, team); }
function getCampaignDetail(campaignId, team)      { return NX.getCampaignDetail(HUB, campaignId, team); }
function scanRepliesForCampaign(campaignId, team) { return NX.scanRepliesForCampaign(HUB, campaignId, team); }

// ── Contacts ────────────────────────────────────────────────────────────────
function getContacts(merchant, team)   { return NX.getContacts(HUB, merchant, team); }
function getAllContacts(team)           { return NX.getAllContacts(HUB, team); }
function getPendingContacts(team)      { return NX.getPendingContacts(HUB, team); }
function proposeContact(payload)       { return NX.proposeContact(HUB, payload); }
function proposeEditContact(payload)   { return NX.proposeEditContact(HUB, payload); }
function proposeDeleteContact(rowIdx)  { return NX.proposeDeleteContact(HUB, rowIdx); }
function approveContact(rowIdx, team)  { return NX.approveContact(HUB, rowIdx, team); }
function rejectContact(rowIdx, team)   { return NX.rejectContact(HUB, rowIdx, team); }
function importCleanedContacts(team)   { return NX.importCleanedContacts(HUB, team); }
function toggleContactCRM(email, merchant, include) { return NX.toggleContactCRM(HUB, email, merchant, include); }

// ── Accounts ────────────────────────────────────────────────────────────────
function getAccountsList(team)                      { return NX.getAccountsList(HUB, team); }
function setAccountStatus(name, status, team)       { return NX.setAccountStatus(HUB, name, status, team); }
function setPartnerRank(name, rank, team)           { return NX.setPartnerRank(HUB, name, rank, team); }
function proposeNewPartner(payload)                  { return NX.proposeNewPartner(HUB, payload); }

// ── Gmail ───────────────────────────────────────────────────────────────────
function getPartnerThreads(emails, max) { return NX.getPartnerThreads(HUB, emails, max); }
function getThreadMessages(threadId)    { return NX.getThreadMessages(HUB, threadId); }
function replyToThread(tid, html, name, team) { return NX.replyToThread(HUB, tid, html, name, team); }
function getGmailSignature()            { return NX.getGmailSignature(HUB); }

// ── Notes ───────────────────────────────────────────────────────────────────
function savePartnerNote(partner, text, team)   { return NX.savePartnerNote(HUB, partner, text, team); }
function getPartnerNotes(partner, team)         { return NX.getPartnerNotes(HUB, partner, team); }
function deletePartnerNote(partner, isoTs, team){ return NX.deletePartnerNote(HUB, partner, isoTs, team); }

// ── Logging & Admin ─────────────────────────────────────────────────────────
function clearNexusCache()                   { return NX.clearNexusCache(HUB); }
function scheduledLogCleanup(team)           { return NX.scheduledLogCleanup(HUB, team); }
function clearAllLogs(team)                  { return NX.clearAllLogs(HUB, team); }
function getRecentLogs(n, status, team)      { return NX.getRecentLogs(HUB, n, status, team); }
function getLogSummary(days, team)           { return NX.getLogSummary(HUB, days, team); }
function getRecentSends(n, team)             { return NX.getRecentSends(HUB, n, team); }
function getRecentSendsAllTeams(n)           { return NX.getRecentSendsAllTeams(HUB, n); }   // V3.16 — admin/head global Send Log
function diagnosePipeline()                  { return NX.diagnosePipeline(HUB); }            // V3.16 — one-shot live diagnostic

// ── Accounts Spine ──────────────────────────────────────────────────────────
function buildAccountsSpineForTeam(team) { return NX.buildAccountsSpineForTeam(HUB, team); }
function rebuildSpine_Carlos()  { return NX.buildAccountsSpineForTeam(HUB, 'Carlos'); }
function rebuildSpine_Daniel()  { return NX.buildAccountsSpineForTeam(HUB, 'Daniel'); }
function rebuildSpine_Tanya()  { return NX.buildAccountsSpineForTeam(HUB, 'Tanya'); }

// ── V3.12 — Language migration: CRM Data → Accounts (store-level) ──────────
// One-shot bootstrap per team. Creates the 'Language' column on the team's
// Accounts tab if missing, then copies every CRM Data Language value into
// the matching Accounts row. After this runs, Accounts is the only place
// language is read or written. Idempotent — safe to re-run.
// Run from the script editor under the shared account, once per team.
function migrateLang_Carlos() { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Carlos'); }
function migrateLang_Daniel() { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Daniel'); }
function migrateLang_Tanya()  { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Tanya');  }

// ── CRM Email Pool (V3.6.1) — manual rebuild runners ──────────────────────
// Use these when running from the script editor or as a scheduled trigger.
// The library's rebuildCRMEmailPool requires (hub, team) args; running it
// bare from the editor leaves _hub undefined and fails inside dbTab_/db_()
// with a misleading "User <email> not found in Permissions sheet" error.
function rebuildPool_Carlos() { return NX.rebuildCRMEmailPool(HUB, 'Carlos'); }
function rebuildPool_Daniel() { return NX.rebuildCRMEmailPool(HUB, 'Daniel'); }
function rebuildPool_Tanya()  { return NX.rebuildCRMEmailPool(HUB, 'Tanya'); }

// ── AM_Emails tab (V3.8) — manual initializers, one-shot per team ──────────
// Creates an AM_Emails tab in the team's DB sheet with a 2-col header row
// (AM Name | Email). Team lead/admin fills rows manually after init.
// Read by NX.executeCampaign when the "CC Account Manager" toggle is on
// during shared-send outreach; the lookup is keyed on AM Name matching the
// value in Sales Data col E for each partner. No-op if the tab already exists.
function initAmEmails_Carlos() { return NX.initAmEmailsTab(HUB, 'Carlos'); }
function initAmEmails_Daniel() { return NX.initAmEmailsTab(HUB, 'Daniel'); }
function initAmEmails_Tanya()  { return NX.initAmEmailsTab(HUB, 'Tanya');  }

// ── Bid-Ask (V3.8 — DRAFT sub-view under Cockpit) ─────────────────────────
function getBidAskData(team) { return NX.getBidAskData(HUB, team); }

// ── Reply Center (V3.8 — sibling of Campaigns under Outreach) ─────────────
function getReplyCampaignsList(days, team)        { return NX.getReplyCampaignsList(HUB, days, team); }
function getCampaignReplies(campaignId, team)     { return NX.getCampaignReplies(HUB, campaignId, team); }
function scanAllRecentReplies(days, team)         { return NX.scanAllRecentReplies(HUB, days, team); }
function markReplyHandled(sheetRow, team)         { return NX.markReplyHandled(HUB, sheetRow, team); }

// ── Huddle (V3.9 — weekly team meeting log) ────────────────────────────────
function initHuddleTab(team)                      { return NX.initHuddleTab(HUB, team); }
function getHuddleLog(team, weeks)                { return NX.getHuddleLog(HUB, team, weeks); }
function getHuddleLogForPartner(team, partner, n) { return NX.getHuddleLogForPartner(HUB, team, partner, n); }
function getLastWeekFollowups(team)               { return NX.getLastWeekFollowups(HUB, team); }
function addHuddleEntry(team, payload)            { return NX.addHuddleEntry(HUB, team, payload); }
function editHuddleEntry(team, id, payload)       { return NX.editHuddleEntry(HUB, team, id, payload); }

// ── Holidays (V3.11 — team time-off planning) ──────────────────────────────
function initHolidaysTab(team)                    { return NX.initHolidaysTab(HUB, team); }
function getHolidays(team)                        { return NX.getHolidays(HUB, team); }
function addHoliday(team, payload)                { return NX.addHoliday(HUB, team, payload); }
function editHoliday(team, id, payload)           { return NX.editHoliday(HUB, team, id, payload); }

// ── Priorities (team directives — Mgr/Head/Admin write-gated in the library) ──
function initPrioritiesTab(team)                  { return NX.initPrioritiesTab(HUB, team); }
function getPriorities(team)                      { return NX.getPriorities(HUB, team); }
function addPriority(team, payload)               { return NX.addPriority(HUB, team, payload); }
function editPriority(team, id, payload)          { return NX.editPriority(HUB, team, id, payload); }
function setPriorityStatus(team, id, status)      { return NX.setPriorityStatus(HUB, team, id, status); }
function deletePriority(team, id)                 { return NX.deletePriority(HUB, team, id); }

// ── Head dashboard (V3.9 — manager-only cross-team view) ───────────────────
function getHeadDashboardData(weeks)              { return NX.getHeadDashboardData(HUB, weeks); }
function getAllHuddlesForHead(weeks)              { return NX.getAllHuddlesForHead(HUB, weeks); }

// ── Team-lead lookup (V3.9 — for outreach CC checkbox visibility) ──────────
function getTeamLeadEmail(team)                   { return NX.getTeamLeadEmail(HUB, team); }

// ── Templates registry (V3.20 — sheet-exclusive, one tab per template) ──────
function getTemplatesAll()                        { return NX.getTemplatesAll(HUB); }
function getLanguageCoverage()                    { return NX.getLanguageCoverage(HUB); }
function bustTemplatesCache()                     { return NX.bustTemplatesCache(HUB); }
// V3.20 — seedTemplatesFromCore() + _builtinTemplatesPayload_() removed. No
// template copy is hardcoded any more; templates live exclusively in the Email
// Templates spreadsheet (one tab per template), edited in the standalone
// "Email Templates — Console".

