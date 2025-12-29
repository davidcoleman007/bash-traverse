#!/bin/bash -e

# This script is responsible for building the project's static content.
# It is also responsible for running code coverage (i.e. SonarQube) and updating Tessa.
#
# Developers are free to alter the build process, even significantly, as long
# as they ensure:
# - Their build produces a dist folder
# - Their entry point asset exists at the top of dist
# - All child assets are placed in dist/__VERSION__
#
# They also must acknowledge that at deploy time:
# - The string __VERSION__ will be replaced in all of their assets with a
#   string unique to the deployment
# - The contents of the dist/__VERSION__ folder will be deployed to a new
#   subfolder of dist in the S3 bucket named using that same unique string
# - Any files under dist/__VERSION__ will be assigned a long cache time
#   (default 1 day). All other files will be assigned a short cache time
#   (default 1 minute).

# Getting "_auth" and "email" values from Artifactory for .npmrc file.
# Assumption: ARTIFACTORY_USER and ARTIFACTORY_API_TOKEN need to have
# already been defined in the environment.
export NPM_AUTH=your-auth-code
export NPM_EMAIL=you@your.org

# The following code is a workaround for the problem of auto-increment-version
# and check-published-artifact utilities, which are using an NPM library called
# npm-utils that does not handle the environment variable reference expressions
# like ${NPM_AUTH} in .npmrc file.
echo "Copying .npmrc to .npmrc.copy"
cp .npmrc .npmrc.copy
echo "Replacing _auth and email in .npmrc"
egrep -v '_auth|email' .npmrc.copy > .npmrc
cat >> .npmrc << EOF
email=$NPM_EMAIL
legacy-peer-deps=true
EOF

# Finally the actual build steps.
rm -rf dist dist-test
npm ci
npm run auto-increment-version
npm run update-version
npm run build
npm run test
npx rollup-pageobjects

# If SONAR_TOKEN is provided, run SonarQube analysis
if [ -n "$SONAR_TOKEN" ]; then

# To run SonarQube only on build jobs (not PR), comment out the line above and uncomment the following line
# if [ -n "$SONAR_TOKEN" ] && [ "$SONAR_ANALYSIS_TYPE" = "build" ];
    echo "SONAR_TOKEN found. Running SonarQube analysis with SONAR_ANALYSIS_TYPE=$SONAR_ANALYSIS_TYPE"

    if [ -z "$sha" ]; then
        echo "Error: sha is required for SonarQube analysis"
        exit 1
    fi

    npm run test:sonar
fi

if [[ "$BUILD_TYPE" == "build" && -d dist-test ]]; then
    cat > dist-test/.npmrc << EOF
email=$NPM_EMAIL
always-auth=true
EOF

    # Verify whether we should publish this artifiact
    sha=`git rev-parse --short HEAD`
    check_artifact=`npm run "check-artifact" -- $sha | tail -1`
    case "$check_artifact" in publish)
            (cd dist-test; npm publish)
        ;;
        conflict)
        echo "Attempted to override previously published version"
        exit 1
        ;;
        error*)
        echo $check_artifact
        exit 1
        ;;
        skip)
        echo "Published artifact has not changed.  Skipping publish."
        exit 1
        ;;
    esac
fi

# Restore the original content of .npmrc
echo "Restoring .npmrc"
mv -f .npmrc.copy .npmrc
