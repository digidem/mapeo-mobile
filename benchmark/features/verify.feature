Feature: Verify tests and benchmarks

  Scenario: As a user I see the test results
    Then I wait for 6 seconds
    Then I see the text '{"asserts":429,"passes":429,"failures":0}'
