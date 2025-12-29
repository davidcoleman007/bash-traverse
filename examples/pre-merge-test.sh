#!/bin/bash -e

echo "Begin pre-merge-test.sh"

# The name of the branch being tested
echo "BRANCH=$BRANCH"

# The name of the main branch
echo "MAIN_BRANCH=$MAIN_BRANCH"

auth=$(curl -s -u$ARTIFACTORY_USER:$ARTIFACTORY_API_TOKEN https://your-artifactory/auth/url)
[[ "$auth" =~ email\ *=\ *([[:graph:]]*) ]]; export NPM_EMAIL="${BASH_REMATCH[1]}"
[[ "$auth" =~ _auth\ *=\ *([[:graph:]]*) ]]; export NPM_AUTH="${BASH_REMATCH[1]}"

# Overlay actual values temporarily to .npmrc due to issue with auto-increment-version, etc.
echo "Move and re-create .npmrc"
mv -f .npmrc .npmrc.copy
sed -E \
    -e 's/(email *= *)[[:graph:]]*/\1'$NPM_EMAIL'/' \
    -e 's/(_auth *= *)[[:graph:]]*/\1'$NPM_AUTH'/' \
    .npmrc.copy >.npmrc

npm ci

echo "DEV_EPHEMERAL_BASE_URL: ${DEV_EPHEMERAL_BASE_URL}"
echo "DEV_EPHEMERAL_VERSION_BASE_URL: ${DEV_EPHEMERAL_VERSION_BASE_URL}"
echo "STAGE_EPHEMERAL_BASE_URL: ${STAGE_EPHEMERAL_BASE_URL}"
echo "STAGE_EPHEMERAL_VERSION_BASE_URL: ${STAGE_EPHEMERAL_VERSION_BASE_URL}"

# Temporarily turn off exit-on-error
set +e

# This variable will track test status
test_status=0

############################################# BEGIN - ADD YOUR TESTS HERE #############################################
# Use this section to define the tests that you want to run. For example, dropinharness, integration, heartbeat.
# When this script runs, your content has already been deployed to an ephemeral location, and you must test that
# content either via version override or by using the dropinharness available at the ephemeral location.
#
# The content is accessible on both dev and stage hostnames, and is provided by environment variables:
# DEV_EPHEMERAL_BASE_URL:           The root of your ephemeral deployment, via dev hostname
# DEV_EPHEMERAL_VERSION_BASE_URL:   The version folder of your ephemeral deployment, via dev hostname
# STAGE_EPHEMERAL_BASE_URL:         The root of your ephemeral deployment, via stage hostname
# STAGE_EPHEMERAL_VERSION_BASE_URL: The version folder of your ephemeral deployment, via stage hostname
#
# Use the variable(s) most appropriate for your usecase.
#
# You can run more than one set of tests (e.g. dropinharness, integration, heartbeat).
# For EACH AND EVERY test command, you must explicitly check the exit status immediately after running the command and
# set test_status to 1 if the test command exits with non-zero.
#
# *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT ***
# *** DO NOT *** pipe your tests to true. Example: npm run wdio:stage:grid || true
# Teams did this in the Moonbeam world to make the UI test job always pass, even with failing tests.
# They would then manually review logs during deployment and decide whether or not to proceed.
# THIS DOES NOT WORK for pre-merge tests. If you pipe your tests to true, then they're useless and will not
# prevent merge of bad code.
#
# *** DO *** fix or exclude failing tests instead of piping to true.
#
# It has been determined that the heartbeat tests are too flaky at this time to include in blocking pre-merge tests.
# Until the issues have been resolved, the suggestion is to NOT include them here. Consider putting them in
# post-deploy-test.sh for the time being.
# *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT *** IMPORTANT ***
#
# Running dropinharness or integration tests is simple. Just export the variable WDIO_BASE_URL to point to the
# content you want to test, and then execute the test. i.e.
#
# Run the dropinharness tests on the ephemeral content at STAGE_EPHEMERAL_VERSION_BASE_URL
export WDIO_BASE_URL="${STAGE_EPHEMERAL_VERSION_BASE_URL}/"

npx dc-test-runner \
  --client=dc-web \
  --env=stage \
  --grid=openstack3 \
  --test-bundle=dc-viewer-dropin:latest \
  --io-bundle=dc-context-board-dropin:latest \
  --io-bundle=dc-files2-dropin:latest \
  --spec="./.aristotle/.cache/dc-viewer-dropin/__LATEST__/uitests/specs/RegressionBugs.spec.js"

if [ $? -ne 0 ]; then
  test_status=1
fi

#    # Run the integration tests against Stage, overriding our "example" dropin to point at the ephemeral content at STAGE_EPHEMERAL_VERSION_BASE_URL
#    npm run wdio:stage:grid
#    if [ $? -ne 0 ]; then
#      test_status=1
#    fi

# Restore exit-on-error.
set -e

# If the screenshots directory exists, run the script to upload screenshots to S3
echo "Uploading failed tests screenshots to S3."
if [[ -d screenshots ]]; then
    npm run upload-screenshots-to-s3
fi
# If the reports/uitests directory exists, run the script to upload test reports to S3
echo "Uploading failed tests reports to S3."
if [[ -d reports/uitests ]]; then
    npm run upload-test-reports-to-s3
fi

# Restore the original content of .npmrc
echo "Restoring .npmrc"
mv -f .npmrc.copy .npmrc

echo "End pre-merge-test.sh with status $test_status"

# Exit with the test status.
exit $test_status
