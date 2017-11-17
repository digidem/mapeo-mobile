Feature: Verify tests and benchmarks

  Scenario: As a user I see the test results
    Then I wait for 60 seconds
    Then I see the text '{"asserts":2297,"passes":2297,"failures":0}'
