#!/bin/bash

if [[ $CI_COMMIT_REF_NAME =~ $VERSION_PARSING_REGEX ]]
then
		full_version_group="${BASH_REMATCH[1]}"
		export PREPARED_RELEASE_VERSION=$full_version_group
else
		export PREPARED_RELEASE_VERSION="$NX_CDK_STAGE:latest"
fi
echo $PREPARED_RELEASE_VERSION
