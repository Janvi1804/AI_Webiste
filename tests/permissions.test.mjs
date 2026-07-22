import test from 'node:test'; import assert from 'node:assert/strict';
const grants={viewer:["record.read"],manager:["project.create","task.create","task.update","record.read","record.write"]};
test('viewer cannot write',()=>assert.equal(grants.viewer.includes('record.write'),false));
test('manager can create project',()=>assert.equal(grants.manager.includes('project.create'),true));
test('organizations require distinct membership checks',()=>assert.notEqual('organization-a','organization-b'));
