
var api = require("../index.js");
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

describe('getDependencies', function() {
    it('Checking the npm api is working',async function() {
        let dependencies = await api.getDependencies('qs','6.9.1');
        dependencies.should.be.a('array');
        dependencies.should.have.length(0);
    });
});

describe('getDependenciesTree', function () {
    it('Checking for correct response', async function() {
        let dependenciesTree = await api.getDependenciesTree('mime-types','2.1.24');
        console.log(dependenciesTree);
        expect(dependenciesTree).to.deep.equal(
            {
                package: "mime-types",
                version: "2.1.24",
                dependencies: [ { package: 'mime-db', version: '1.40.0', dependencies: [] } ]
            }
        )
    })
});