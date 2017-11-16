require 'calabash-android/calabash_steps'

Then("I wait {int} seconds") do |int|
  sleep(seconds.to_i)
end

Then("I see the text {string}") do |string|
  wait_for_text(string, timeout: 10)
end