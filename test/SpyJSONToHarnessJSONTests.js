var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect
var SpyJSONToHarnessJSON = require('../src/SpyJSONToHarnessJSON')

mocha.describe('Spy JSON to Harness JSON', function () {

    mocha.it('One Variable', function () {

        var spyJSON = {
            testedFunctionCall: 'testFunction(a)',
            result: 'NOTSET',
            variables:
                [{
                    name: 'a',
                    values: [{
                        timing: 'Initial',
                        value: 2
                    }]
                }
                ],
            functions: []
        }
        var expectedJSON = [
            { variableDefinition: { name: 'a', value: 2 } }
        ]
        expect(SpyJSONToHarnessJSON(spyJSON)).to.deep.equal(expectedJSON)
    })
    mocha.it('One Function', function () {

        var spyJSON = {
            testedFunctionCall: 'testFunction(a)',
            result: 8,
            variables: [],
            functions: [{
                name: 'a',
                traffic: [{
                    callNumber: 0,
                    arguments: [1, 5],
                    returnValue: 6
                }, {
                    callNumber: 1,
                    arguments: [5, -3],
                    returnValue: 2
                }]
            }]
        }
        var expectedJSON = [
            {
                functionHarness: [
                    {
                        variableDefinition: {
                            name: 'MOCK0_DB',
                            value: [{
                                arguments: [1, 5],
                                returnValue: 6
                            }, {
                                arguments: [5, -3],
                                returnValue: 2
                            }]
                        }
                    }, { variableDefinition: { name: 'MOCK0_counter', value: 0 } },
                    {
                        functionDefinition: {
                            name: 'a',
                            content: [
                                { validateInputAndGetOutput: { function: 'a', DB: 'MOCK0_DB', counter: 'MOCK0_counter', returnVariable: 'output' } },
                                { increaseCounterByOne: { counter: 'MOCK0_counter' } },
                                { returnOutput: { returnVariable: 'output' } }]
                        }
                    }
                ]
            }, { testFunctionAssertion: { result: 8, testFunctionCall: 'testFunction(a)' } }
        ]
        expect(SpyJSONToHarnessJSON(spyJSON)).to.deep.equal(expectedJSON)
    })
})