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
function doGet() {
  return HtmlService.createTemplateFromFile('nexus').evaluate()
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
function initSnapshotAM_Meghan() { return NX.initSnapshotFile(HUB, 'Meghan'); }

// Per-team generate — these are the trigger handlers
function generateSnapshotAM_Carlos() { return NX.generateSnapshot(HUB, 'Carlos'); }
function generateSnapshotAM_Daniel() { return NX.generateSnapshot(HUB, 'Daniel'); }
function generateSnapshotAM_Tanya()  { return NX.generateSnapshot(HUB, 'Tanya');  }
function generateSnapshotAM_Meghan() { return NX.generateSnapshot(HUB, 'Meghan'); }

// Per-team read paths — bound to a specific team (mirrors V3.1 Carlos wrapper)
function getSnapshotAM_Carlos()    { return NX.getSnapshot(HUB, 'Carlos'); }
function getSnapshotAM_Daniel()    { return NX.getSnapshot(HUB, 'Daniel'); }
function getSnapshotAM_Tanya()     { return NX.getSnapshot(HUB, 'Tanya');  }
function getSnapshotAM_Meghan()    { return NX.getSnapshot(HUB, 'Meghan'); }
function getSnapshotRawAM_Carlos() { return NX.getSnapshotRaw(HUB, 'Carlos'); }
function getSnapshotRawAM_Daniel() { return NX.getSnapshotRaw(HUB, 'Daniel'); }
function getSnapshotRawAM_Tanya()  { return NX.getSnapshotRaw(HUB, 'Tanya');  }
function getSnapshotRawAM_Meghan() { return NX.getSnapshotRaw(HUB, 'Meghan'); }
function getSnapshotMetaAM_Carlos(){ return NX.getSnapshotMeta(HUB, 'Carlos'); }
function getSnapshotMetaAM_Daniel(){ return NX.getSnapshotMeta(HUB, 'Daniel'); }
function getSnapshotMetaAM_Tanya() { return NX.getSnapshotMeta(HUB, 'Tanya');  }
function getSnapshotMetaAM_Meghan(){ return NX.getSnapshotMeta(HUB, 'Meghan'); }

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
function resyncSnapshotSharingAM_Meghan() { return NX.resyncSnapshotSharing(HUB, 'Meghan'); }

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
function installSnapshotTriggerAM_Meghan(m) { return _installTeamTrigger_('generateSnapshotAM_Meghan', m); }

function installAllSnapshotTriggersAM(m) {
  return {
    Carlos: installSnapshotTriggerAM_Carlos(m),
    Daniel: installSnapshotTriggerAM_Daniel(m),
    Tanya:  installSnapshotTriggerAM_Tanya(m),
    Meghan: installSnapshotTriggerAM_Meghan(m)
  };
}

function removeSnapshotTriggersAM_Carlos() { return _removeTeamTrigger_('generateSnapshotAM_Carlos'); }
function removeSnapshotTriggersAM_Daniel() { return _removeTeamTrigger_('generateSnapshotAM_Daniel'); }
function removeSnapshotTriggersAM_Tanya()  { return _removeTeamTrigger_('generateSnapshotAM_Tanya');  }
function removeSnapshotTriggersAM_Meghan() { return _removeTeamTrigger_('generateSnapshotAM_Meghan'); }

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

// ── Legacy Campaign (back-compat, not used by new UI) ───────────────────────
function previewCampaign(sheetUrl, draftId, campaignName) {
  return NX.previewCampaign(HUB, sheetUrl, draftId, campaignName);
}
function sendCampaignFull(sheetUrl, draftId, campaignName) {
  return NX.sendCampaignFull(HUB, sheetUrl, draftId, campaignName);
}
function getExternalSheetData(url)  { return NX.getExternalSheetData(HUB, url); }

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

// ── Accounts ────────────────────────────────────────────────────────────────
function getAccountsList(team)                      { return NX.getAccountsList(HUB, team); }
function setAccountStatus(name, status, team)       { return NX.setAccountStatus(HUB, name, status, team); }
function proposeNewPartner(payload)                  { return NX.proposeNewPartner(HUB, payload); }

// ── Gmail ───────────────────────────────────────────────────────────────────
function getPartnerThreads(emails, max) { return NX.getPartnerThreads(HUB, emails, max); }
function getThreadMessages(threadId)    { return NX.getThreadMessages(HUB, threadId); }
function replyToThread(tid, html, name, team) { return NX.replyToThread(HUB, tid, html, name, team); }
function getGmailSignature()            { return NX.getGmailSignature(HUB); }

// ── Notes ───────────────────────────────────────────────────────────────────
function savePartnerNote(partner, text)      { return NX.savePartnerNote(HUB, partner, text); }
function getPartnerNotes(partner)            { return NX.getPartnerNotes(HUB, partner); }
function deletePartnerNote(partner, isoTs)   { return NX.deletePartnerNote(HUB, partner, isoTs); }

// ── Logging & Admin ─────────────────────────────────────────────────────────
function clearNexusCache()                   { return NX.clearNexusCache(HUB); }
function scheduledLogCleanup(team)           { return NX.scheduledLogCleanup(HUB, team); }
function clearAllLogs(team)                  { return NX.clearAllLogs(HUB, team); }
function getRecentLogs(n, status, team)      { return NX.getRecentLogs(HUB, n, status, team); }
function getLogSummary(days, team)           { return NX.getLogSummary(HUB, days, team); }
function getRecentSends(n, team)             { return NX.getRecentSends(HUB, n, team); }

// ── Accounts Spine ──────────────────────────────────────────────────────────
function buildAccountsSpineForTeam(team) { return NX.buildAccountsSpineForTeam(HUB, team); }
function rebuildSpine_Carlos()  { return NX.buildAccountsSpineForTeam(HUB, 'Carlos'); }
function rebuildSpine_Daniel()  { return NX.buildAccountsSpineForTeam(HUB, 'Daniel'); }
function rebuildSpine_Tanya()  { return NX.buildAccountsSpineForTeam(HUB, 'Tanya'); }
function rebuildSpine_Meghan()  { return NX.buildAccountsSpineForTeam(HUB, 'Meghan'); }

// ── V3.12 — Language migration: CRM Data → Accounts (store-level) ──────────
// One-shot bootstrap per team. Creates the 'Language' column on the team's
// Accounts tab if missing, then copies every CRM Data Language value into
// the matching Accounts row. After this runs, Accounts is the only place
// language is read or written. Idempotent — safe to re-run.
// Run from the script editor under the shared account, once per team.
function migrateLang_Carlos() { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Carlos'); }
function migrateLang_Daniel() { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Daniel'); }
function migrateLang_Tanya()  { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Tanya');  }
function migrateLang_Meghan() { return NX.migrateLanguageFromCrmToAccounts(HUB, 'Meghan'); }

// ── CRM Email Pool (V3.6.1) — manual rebuild runners ──────────────────────
// Use these when running from the script editor or as a scheduled trigger.
// The library's rebuildCRMEmailPool requires (hub, team) args; running it
// bare from the editor leaves _hub undefined and fails inside dbTab_/db_()
// with a misleading "User <email> not found in Permissions sheet" error.
function rebuildPool_Carlos() { return NX.rebuildCRMEmailPool(HUB, 'Carlos'); }
function rebuildPool_Daniel() { return NX.rebuildCRMEmailPool(HUB, 'Daniel'); }
function rebuildPool_Tanya()  { return NX.rebuildCRMEmailPool(HUB, 'Tanya'); }
function rebuildPool_Meghan() { return NX.rebuildCRMEmailPool(HUB, 'Meghan'); }

// ── AM_Emails tab (V3.8) — manual initializers, one-shot per team ──────────
// Creates an AM_Emails tab in the team's DB sheet with a 2-col header row
// (AM Name | Email). Team lead/admin fills rows manually after init.
// Read by NX.executeCampaign when the "CC Account Manager" toggle is on
// during shared-send outreach; the lookup is keyed on AM Name matching the
// value in Sales Data col E for each partner. No-op if the tab already exists.
function initAmEmails_Carlos() { return NX.initAmEmailsTab(HUB, 'Carlos'); }
function initAmEmails_Daniel() { return NX.initAmEmailsTab(HUB, 'Daniel'); }
function initAmEmails_Tanya()  { return NX.initAmEmailsTab(HUB, 'Tanya');  }
function initAmEmails_Meghan() { return NX.initAmEmailsTab(HUB, 'Meghan'); }

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

// ── Head dashboard (V3.9 — manager-only cross-team view) ───────────────────
function getHeadDashboardData(weeks)              { return NX.getHeadDashboardData(HUB, weeks); }
function getAllHuddlesForHead(weeks)              { return NX.getAllHuddlesForHead(HUB, weeks); }

// ── Team-lead lookup (V3.9 — for outreach CC checkbox visibility) ──────────
function getTeamLeadEmail(team)                   { return NX.getTeamLeadEmail(HUB, team); }

// ── Templates registry (V3.10 — multi-language) ────────────────────────────
function getTemplatesAll()                        { return NX.getTemplatesAll(HUB); }
function getLanguageCoverage()                    { return NX.getLanguageCoverage(HUB); }
function bustTemplatesCache()                     { return NX.bustTemplatesCache(HUB); }

/**
 * V3.10 — ONE-TIME SEED
 *
 * Run this once from the Apps Script editor (any team's NEXUS AM project)
 * after the new NEXUS_LIB version is published.
 *
 * What it does:
 *   1. Creates the 'Templates' tab in TEMPLATES_SHEET_ID if missing
 *   2. APPENDS the 19 current built-in templates as rows (Policy gets 4
 *      rows for EN/ES/FR/DE since those translations already exist)
 *   3. Marks all rows active=yes, stamps last_updated = now
 *
 * After this runs:
 *   - The frontend will pull templates from the sheet
 *   - You add other-language rows (PT, JA, ES/DE/FR for non-Policy templates)
 *     by typing in the sheet directly. AI-translate workflow: copy EN row,
 *     paste subject + body into Claude, ask for the target language, paste
 *     the result back as a new row with the same template_key + new language.
 *   - "Reload templates" button on the email page busts the cache so edits
 *     show up immediately without waiting the 5-min TTL.
 *
 * Idempotency: this APPENDS. Don't run twice without clearing the sheet
 * first, or you'll get duplicate rows.
 */
function seedTemplatesFromCore() {
  var templates = _builtinTemplatesPayload_();
  return NX.seedTemplatesSheet(HUB, templates);
}

/**
 * Returns the same 19 templates that currently live in nx_core's
 * EMAIL_TEMPLATES, shaped for seedTemplatesSheet. Body strings preserved
 * verbatim — no escape changes — so the output matches today's rendering
 * exactly, byte-for-byte (with the trivial exception of the Policy split:
 * 'Policy EN'/'Policy ES'/'Policy FR'/'Policy DE' collapse into 4 rows
 * under one canonical key 'Policy').
 */
function _builtinTemplatesPayload_() {
  var FOOTER = '<br><p>{{sender_name}}<br>Account Management<br><br><b style="letter-spacing:0.04em">FARFETCH</b></p></div>';
  var T = [];

  T.push({
    template_key: 'General', language: 'EN', display_name: 'General', category: 'General Outreach', icon: 'mail',
    subject: 'Partnership Update — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I hope this message finds you well. I wanted to reach out with a quick update on <b>{{partner_name}}</b>\'s performance and share some upcoming opportunities we think could be relevant for you.</p><p>I\'d love to connect for a brief chat whenever it suits you best.</p>' + FOOTER
  });
  T.push({
    template_key: 'Sales Risk', language: 'EN', display_name: 'Sales Risk', category: 'Performance', icon: 'trending-down',
    subject: 'Performance Check-in — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to reach out regarding <b>{{partner_name}}</b>\'s recent performance. Your YTD trend is currently at <b>{{ytd_yoy}}</b> vs last year, and I\'d love to connect to explore how we can work together to turn this around.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;">There are several levers we can look at together — catalogue, pricing strategy, and platform visibility among others. A short call this week could go a long way.</div><p>Would you be available for a quick call this week?</p>' + FOOTER
  });
  T.push({
    template_key: 'High Growth', language: 'EN', display_name: 'High Growth', category: 'Performance', icon: 'trending-up',
    subject: 'Congratulations on the Growth — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>Congratulations — <b>{{partner_name}}</b> is showing strong YTD growth of <b>{{ytd_yoy}}</b> vs last year. That\'s a fantastic result and a real testament to the work your team has been putting in.</p><p>I\'d love to discuss how we can build on this momentum and make the most of the opportunities ahead.</p>' + FOOTER
  });
  T.push({
    template_key: 'Stock Decline', language: 'EN', display_name: 'Stock Decline', category: 'Inventory', icon: 'package-minus',
    subject: 'Inventory Alert — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to flag that <b>{{partner_name}}</b>\'s online stock levels have declined significantly year-on-year. A sustained stock decline directly impacts your visibility and conversion on the platform, so I wanted to raise this as a priority.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Action needed:</strong> Please review your catalogue and consider uploading new stock as soon as possible to maintain your performance metrics.</div><p>I\'m happy to jump on a quick call to discuss your catalogue plans and how we can support you.</p>' + FOOTER
  });
  T.push({
    template_key: 'Stock Replenishment', language: 'EN', display_name: 'Stock Replenishment', category: 'Inventory', icon: 'package-plus',
    subject: 'Stock Upload Opportunity — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I\'m writing to flag an opportunity. <b>{{partner_name}}</b>\'s current online units are running low, and uploading fresh inventory now could significantly improve your visibility and sell-through heading into the next demand cycle.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Recommendation:</strong> Prioritise your best-performing categories and ensure pricing is competitive at full price. Reach out if you need guidance on which SKUs to prioritise.</div><p>Let me know if you\'d like to discuss a replenishment plan.</p>' + FOOTER
  });
  T.push({
    template_key: 'Low SOS', language: 'EN', display_name: 'Low SOS', category: 'Operational', icon: 'clock-alert',
    subject: 'Speed of Sending Performance Alert — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to flag that <b>{{partner_name}}</b>\'s Speed of Sending (SOS) rate has dropped below target. Late shipments can directly impact penalties and your ability to receive new order allocations.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Action needed:</strong> Please review your fulfilment pipeline and ensure orders are dispatched within the required window.</div><p>I\'m happy to discuss how we can support you in improving this metric.</p>' + FOOTER
  });
  T.push({
    template_key: 'KPI Penalty', language: 'EN', display_name: 'KPI Penalty', category: 'Operational', icon: 'alert-triangle',
    subject: 'Operational Penalty Notice — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>This is to inform you that <b>{{partner_name}}</b> has incurred operational penalties this period. Penalties are applied when key service-level thresholds are not met — including order cancellations, late shipments, and imperfect orders.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Next steps:</strong> Please review your operational processes and identify the root causes. We recommend focusing on no stock (NS) and speed of sending (SOS) rates as priority areas.</div><p>I\'m available to walk through the data and build an improvement plan together.</p>' + FOOTER
  });
  T.push({
    template_key: 'Perfect Order', language: 'EN', display_name: 'Perfect Order', category: 'Operational', icon: 'check-circle',
    subject: 'Perfect Order Rate Review — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to discuss <b>{{partner_name}}</b>\'s Perfect Order rate. Currently your score is below the 90% threshold, which affects your overall marketplace health and can trigger penalties.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Key areas to improve:</strong> Ensure stock levels are accurate to reduce cancellations, ship orders on time, and confirm items match listing descriptions precisely.</div><p>Would you be open to a brief call to review the data together?</p>' + FOOTER
  });
  T.push({
    template_key: 'No Stock', language: 'EN', display_name: 'No Stock', category: 'Inventory', icon: 'package-x',
    subject: 'No Stock Rate Alert — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I need to flag that <b>{{partner_name}}</b>\'s No Stock (NS) rate is currently above the acceptable threshold. A high NS rate means orders are being cancelled before shipment, which directly impacts customer experience and triggers penalties.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Immediate action:</strong> Please review your inventory accuracy and ensure that listed items are available for fulfilment. Consider deactivating SKUs that are frequently out of stock.</div><p>Let\'s connect this week to discuss your inventory management approach.</p>' + FOOTER
  });
  T.push({
    template_key: 'SOH Request', language: 'EN', display_name: 'SOH Request', category: 'Inventory', icon: 'file-spreadsheet',
    subject: 'Stock file request — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>We noticed no stock is currently flowing from <b>{{partner_name}}</b> to the platform, which usually points to a technical issue on the feed side rather than an actual inventory problem on your end.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>To help us diagnose quickly:</strong> could you send us your latest Stock-on-Hand (SOH) file — full catalogue with current available units per SKU? A CSV or Excel export works fine.</div><p>Once we have it, our integration team can cross-check against what we\'re receiving and get your stock visible again on the platform without delay.</p><p>Thanks in advance for your help on this.</p>' + FOOTER
  });
  T.push({
    template_key: 'Heavy Discounter', language: 'EN', display_name: 'Heavy Discounter', category: 'Pricing', icon: 'percent',
    subject: 'Pricing Strategy Review — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to share some insights regarding <b>{{partner_name}}</b>\'s pricing strategy. There is a real opportunity to strengthen full-price performance, which would have a meaningful impact on both revenue and brand positioning on the platform.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;">Our data suggests that reducing markdown depth and frequency could improve your overall GTV and margin. I\'d love to walk you through the numbers.</div><p>Would you be open to a brief conversation this week?</p>' + FOOTER
  });
  T.push({
    template_key: 'Onboarding', language: 'EN', display_name: 'Onboarding', category: 'Lifecycle', icon: 'user-plus',
    subject: 'Welcome to the Platform — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>Welcome! We\'re excited to have <b>{{partner_name}}</b> onboard. I\'m your dedicated account manager and I\'ll be your main point of contact for everything related to your presence on the platform.</p><p>Over the coming weeks, I\'ll be guiding you through the key setup steps — from catalogue upload and pricing alignment to operational readiness.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>First steps:</strong><br>1. Upload your initial catalogue<br>2. Review pricing guidelines<br>3. Set up fulfilment workflows<br>4. Familiarise yourself with Storm (our partner portal)</div><p>Let\'s schedule an introductory call at your earliest convenience.</p>' + FOOTER
  });
  T.push({
    template_key: 'Quarterly Review', language: 'EN', display_name: 'Quarterly Review', category: 'Cadence', icon: 'bar-chart-2',
    subject: '{{quarter}} Business Review — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>As we close out the quarter, I wanted to share a summary of <b>{{partner_name}}</b>\'s performance and discuss our priorities for the period ahead.</p><p>Your YTD GTV is at <b>{{ytd_gtv}}</b> (<b>{{ytd_yoy}}</b> vs PY), with 7-day momentum at <b>{{7d_gtv}}</b>.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Key topics for review:</strong><br>• Sales trajectory and growth levers<br>• Catalogue and pricing optimisation<br>• Operational health (KPIs, penalties)<br>• Upcoming campaigns and seasonal planning</div><p>I\'d like to set up a 30-minute review call. Please let me know your availability.</p>' + FOOTER
  });
  T.push({
    template_key: 'Campaign Invite', language: 'EN', display_name: 'Campaign Invite', category: 'Campaigns', icon: 'megaphone',
    subject: 'Upcoming Campaign Opportunity — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I wanted to flag an exciting upcoming campaign that could give <b>{{partner_name}}</b> significant visibility on the platform.</p><p>Participation in our curated campaigns has historically driven strong traffic and conversion uplift for partners with well-prepared catalogues.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>To participate:</strong><br>• Ensure your catalogue is up to date<br>• Review pricing for the promotional window<br>• Confirm stock availability for featured items</div><p>Let me know if you\'re interested and I\'ll share the full brief and deadlines.</p>' + FOOTER
  });
  T.push({
    template_key: 'Follow Up', language: 'EN', display_name: 'Follow Up', category: 'Cadence', icon: 'reply',
    subject: 'Following Up — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I hope you\'re well. I wanted to follow up on our recent conversation regarding <b>{{partner_name}}</b>. I understand things get busy, but I\'d love to ensure we keep momentum on the items we discussed.</p><p>If there\'s anything you need from our side, please don\'t hesitate to reach out.</p>' + FOOTER
  });
  T.push({
    template_key: 'Re-engagement', language: 'EN', display_name: 'Re-engagement', category: 'Cadence', icon: 'refresh-cw',
    subject: 'Reconnecting — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>It\'s been a while since we last connected, and I wanted to check in on <b>{{partner_name}}</b>. There have been some exciting updates on the platform that I believe could benefit your business.</p><p>I\'d love to schedule a brief catch-up to discuss how we can work together to maximise your potential this quarter.</p>' + FOOTER
  });
  T.push({
    template_key: 'Invoice Reminder', language: 'EN', display_name: 'Invoice Reminder', category: 'Finance', icon: 'file-text',
    subject: 'Action Required: Invoice Submission Reminder — {{month}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>This is a friendly reminder to please submit your <b>{{month}}</b> invoice.</p><p>Your purchase order (PO) is available in <b>Storm &rarr; Finance &rarr; Financial Documents</b>. After reviewing the PO, kindly issue your invoice to Farfetch for the corresponding amount.</p><div style="background-color:#f9f9f9;padding:15px;border-left:4px solid #000;margin:20px 0;"><strong>Deadline:</strong> Invoices must be sent no later than the <b>12th of each month</b> to:<br><a href="mailto:invoices+partners@farfetch.coupahost.com">invoices+partners@farfetch.coupahost.com</a></div><p>Please send your invoice as soon as possible. This allows enough time to resolve any discrepancies before the deadline and ensure the invoice is processed correctly.</p><p><i>If you have already sent your invoice, please disregard this email.</i></p>' + FOOTER
  });

  // Policy — already exists in 4 languages today. Collapse Policy EN/ES/FR/DE
  // into one canonical 'Policy' template with 4 language rows.
  T.push({
    template_key: 'Policy', language: 'EN', display_name: 'Policy', category: 'Promotions', icon: 'tag',
    subject: '{{partner_name}} Upcoming Promotion X25 Pre-Sale | Policy & Commercial Discount Analysis',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>As you may have seen in the recently shared newsletter, FARFETCH is planning the promo <b>"Pre-Sale 25% off Full Price"</b>. This represents a strong opportunity to boost your sell-through, increase visibility, and accelerate stock rotation on a global scale.</p><p>Sharing with you the usual promo CD recommendations policy required to be eligible for the upcoming X25 Pre-Sale Promotion (30th April – 11th May).</p><p><b>No extra costs are associated with your participation in the promotion, the expected difference in value comes from the adjustment you make to the commercial discount, not from applying the X25.</b></p><p>I recommend reviewing discounts (for uncompetitive items and for the promotion) while considering sell-through rates and days online, particularly for older season items. Given the expected surge in marketplace visits, this is the last opportunity to clear that stock before SS26 sale start.</p><p>Please find here the <a href="https://www.farfetchconnect.com/share/asset/view/366">link to the non-eligible brand list</a>.</p>' + FOOTER
  });
  T.push({
    template_key: 'Policy', language: 'ES', display_name: 'Policy', category: 'Promotions', icon: 'tag',
    subject: '{{partner_name}} Próxima Promoción X25 Pre-Sale | Análisis de Política y Descuento Comercial',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Estimado/a {{contact_name}},</p><p>Como habrá visto en el <i>newsletter</i> recientemente compartido, FARFETCH está planificando la promoción <b>"Pre-Sale 25% de descuento sobre precio completo"</b>. Esto representa una gran oportunidad para impulsar su sell-through, aumentar la visibilidad y acelerar la rotación de stock a nivel global.</p><p>Compartimos con usted la política habitual de recomendaciones de descuento comercial (CD) necesaria para ser elegible para la próxima promoción X25 Pre-Sale (30 de abril – 11 de mayo).</p><p><b>No existen costes adicionales asociados a su participación en la promoción; la diferencia de valor esperada proviene del ajuste que realice en el descuento comercial, no de la aplicación del X25.</b></p><p>Recomiendo revisar los descuentos (tanto para artículos no competitivos como para la promoción), teniendo en cuenta el sell-through y los días online, especialmente para artículos de temporadas anteriores. Dado el aumento previsto de visitas al marketplace, esta es la última oportunidad para liquidar ese stock antes del inicio de las rebajas SS26.</p><p>Encuentre <a href="https://www.farfetchconnect.com/share/asset/view/366">aquí el enlace a la lista de marcas no elegibles</a>.</p>' + FOOTER
  });
  T.push({
    template_key: 'Policy', language: 'FR', display_name: 'Policy', category: 'Promotions', icon: 'tag',
    subject: '{{partner_name}} Promotion X25 Pre-Sale à Venir | Analyse de Politique et Remise Commerciale',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Cher/Chère {{contact_name}},</p><p>Comme vous avez pu le voir dans la newsletter récemment partagée, FARFETCH prévoit la promotion <b>« Pre-Sale 25% de réduction sur le prix plein »</b>. Cela représente une excellente opportunité d\'augmenter votre sell-through, d\'améliorer votre visibilité et d\'accélérer la rotation des stocks à l\'échelle mondiale.</p><p>Nous partageons avec vous la politique habituelle de recommandations de remise commerciale (CD) requise pour être éligible à la prochaine promotion X25 Pre-Sale (30 avril – 11 mai).</p><p><b>Aucun coût supplémentaire n\'est associé à votre participation à la promotion ; la différence de valeur attendue provient de l\'ajustement que vous apportez à la remise commerciale, et non de l\'application du X25.</b></p><p>Je vous recommande de revoir les remises (pour les articles non compétitifs et pour la promotion) en tenant compte des taux de sell-through et des jours en ligne, en particulier pour les articles des saisons précédentes. Compte tenu de l\'augmentation attendue du trafic sur la marketplace, il s\'agit de la dernière opportunité d\'écouler ce stock avant le début des soldes SS26.</p><p>Veuillez trouver ici le lien vers <a href="https://www.farfetchconnect.com/share/asset/view/366">la liste des marques non éligibles</a>.</p>' + FOOTER
  });
  T.push({
    template_key: 'Policy', language: 'DE', display_name: 'Policy', category: 'Promotions', icon: 'tag',
    subject: '{{partner_name}} Bevorstehende Promotion X25 Pre-Sale | Richtlinien- und Rabattanalyse',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Hallo {{contact_name}},</p><p>Wie Ihr möglicherweise im kürzlich geteilten Newsletter gesehen habt, plant FARFETCH die Promotion <b>„Pre-Sale 25% Rabatt auf den Vollpreis"</b>. Dies stellt eine hervorragende Gelegenheit dar, Euren Sell-through zu steigern, die Sichtbarkeit zu erhöhen und die Lagerrotation auf globaler Ebene zu beschleunigen.</p><p>Wir teilen mit Euch die üblichen Richtlinien für die <i>recommended Promo CD´s</i>, die erforderlich sind, um für die bevorstehende X25 Pre-Sale Promotion (30. April – 11. Mai) berechtigt zu sein.</p><p><b>Mit Eurer Teilnahme an der Promotion sind keine zusätzlichen Kosten verbunden; der erwartete Wertunterschied ergibt sich aus der Anpassung des <i>commercial discounts</i> und nicht aus der Anwendung des X25.</b></p><p>Ich empfehle, die Promo CD´s (für nicht wettbewerbsfähige Artikel sowie für die Promotion) unter Berücksichtigung der Sell-through-Raten und der Online-Dauer zu überprüfen, insbesondere bei Artikeln aus älteren Saisons. Angesichts des erwarteten Anstiegs der Marketplace-Besuche ist dies die letzte Gelegenheit, diesen Bestand vor Beginn des SS26-Sales abzubauen.</p><p>Folgend der Link zur <a href="https://www.farfetchconnect.com/share/asset/view/366">Liste der nicht teilnahmeberechtigten Marken</a>.</p>' + FOOTER
  });

  T.push({
    template_key: 'Thank You', language: 'EN', display_name: 'Thank You', category: 'Cadence', icon: 'heart',
    subject: 'Thank You — {{partner_name}}',
    body_html: '<div style="font-family:Arial,sans-serif;color:#333;"><p>Dear {{contact_name}},</p><p>I just wanted to take a moment to thank you and the <b>{{partner_name}}</b> team for your continued collaboration. It\'s been a pleasure working together, and the results speak for themselves.</p><p>Looking forward to continued success in the months ahead.</p>' + FOOTER
  });

  return T;
}

function probe() {
  var d = NX.getUnifiedPartnerData('AM', 'Carlos');
  var p = d.partners.find(function(x) { return x.cy_ytd > 0; });
  Logger.log('account_manager field: ' + JSON.stringify(p.account_manager));
  Logger.log('company: ' + p.company);
}