# DocuOps Project TODO List

## 🎯 Active Tasks
- [x] Separate Template Document Structure from Form Fields — Document Structure should only define the structural layout of the form, while Form Fields handles admin-defined custom data inputs based on document type
- [ ] Integrate `IntakeModal` with the generator pipeline
- [ ] Final UI/UX polish on the template builder sidebar and progress indicators
- [ ] Cleanup: Remove debug payload logging from browser and server consoles

## ✅ Completed (May 4, 2026)
- [x] Fixed 500 Internal Server Error on template publish by ensuring the `title` property is always present in fields
- [x] Preserved backend field IDs when mapping API fields to local sections to prevent unnecessary field recreation
- [x] Corrected mapping of `systemPrompt` back to `prompt` in outgoing API payload
- [x] Flattened `config` properties to the root of the field payload for backend ingestion
- [x] Fixed issue where Document Structure tab data disappeared on save/refresh by properly reading `apiTemplate.structure`
- [x] Added detailed console logging for template payloads to aid in debugging
- [x] Refactored `COMPANY_STATS` endpoint configuration to drop the `userId` requirement and updated hook usages

## ✅ Completed (May 1, 2026)
- [x] Separate Template Document Structure from Form Fields — `documentStructure` and `formFields` are now independent; store migration v2 handles legacy data

## ✅ Completed (April 29, 2026)
- [x] Run load testing with multi-section templates

## ✅ Completed (April 24, 2026)
- [x] Implemented core generation engine with context injection from template inputs
- [x] Structural optimization of the generator payload for backend processing
- [x] Defined and implemented `GeneratorPayload` for backend/CJ integration
- [x] Refactored Document creation modal to use searchable Template system
- [x] Implementation of searchable combobox for template selection in IntakeModal
- [x] Full Document Template CRUD lifecycle (Create, Edit, Delete)
- [x] Implementation of "Draft" states for persistent template editing
- [x] Advanced field configuration logic (conditional visibility & validation)
- [x] Multi-type rendering support (Multi-select, Date-time, etc.)
- [x] Store migration (v1) to purge corrupted legacy data
- [x] Removed all mock data dependencies in favor of Backend API sourcing
- [x] Optimized React Query hooks for real-time synchronization

## 📁 Future / Backlog
- Version history for published templates
- Cross-user editing locks
- Mobile responsiveness audit for rendering output
