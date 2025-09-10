#!/bin/bash

# MAINTAINER: gavin.park@visitscotland.com, Web Operations 

# ==== TO-DO ====
# gp: ~line remove echo "$VS_CONTAINER_BASE_PORT" > env_port.txt AND echo "$VS_HOST_IP_ADDRESS" > env_host.txt from report section - once the env vars are used in the LH script
# gp: create test routine for container/tomcat startup - curl till 200
# gp: ~line 140, add additional check to see if there's a CHANGE_BRANCH variable as well as a BRANCH_NAME variable, allow re-use of the branch's container
# gp: create routine to output feature environment configuration to a file in ci folder, these files will then be collected by a cron job and passed to the proxy server
# gp: investigate using env.STAGE_NAME in stage notifications
# gp: add timing to each proc and output it to a log, cat that log to the Jenkins job log at the end of the script
# gp: timestamp each "doing this" notification as "dd-mmm-yyyy hh:mm:ss.nnn INFO  [scriptname] doing this", output it to the log
# gp: remove individual references to tomcat_8080, replace with a variable
# ====/TO-DO ====
# ==== DONE ====
# gp: split into functions - done
# gp: activate clean-up routine - done
# gp: update adjustatable variables to set only if they're not set already, that way the Dev can override in the Jenkinsfile - done
# gp: rename BASE_PORT to MIN_PORT - done
# gp: update port find to set VS_CONTAINER_BASE_PORT between MIN_PORT and MAX_PORT - done
#      - then check the + 100s right to the limit - done
# gp: create an array of required ports - done
#      - e.g. "VS_CONTAINER_BRXM_PORT VS_CONTAINER_SSR_PORT VS_CONTAINER_SSH_PORT"
#      - then do a FOR MAP_PORT in VS_CONTAINER_REQUIRED_PORTS and +100 knowing that the're available (from above)
# gp: if an existent container is found grab its base port - done
#     - re-use it for any new container
# gp: create routine to re-use existing container if it's there - done
#     - start it if stoppped - redeploy artifact if it's running
# gp: create notification routine using "VS_COMMIT_AUTHOR" - done
# gp: don't start tomcat with container - done
# gp: additional check to see if mySQL is required - create a CMD without mysql - done
# ====/DONE ====

# ==== SETUP ====
# ==== ADJUSTABLE VARIABLES ====
#  == VS Variables ==
if [ -z "$VS_DEBUG" ]; then VS_DEBUG=FALSE; fi
if [ -z "$VS_BUILD_PROPERTIES_TARGET_DIR" ]; then VS_BUILD_PROPERTIES_TARGET_DIR=$WORKSPACE/site/components/src/main/resources/ci; fi
if [ -z "$VS_BUILD_PROPERTIES_TARGET_NAME" ]; then VS_BUILD_PROPERTIES_TARGET_NAME=build-info.properties; fi
if [ -z "$VS_DOCKER_IMAGE_NAME" ]; then VS_DOCKER_IMAGE_NAME=vs-brxm; fi
if [ -z "$VS_DOCKERFILE_PATH" ]; then VS_DOCKERFILE_PATH=/home/jenkins/vs-dockerfile; fi
if [ -z "$VS_DOCKERFILE_NAME" ]; then VS_DOCKERFILE_NAME=vs-brxm; fi
if [ -z "$VS_DOCKERFILE_LOCN" ]; then VS_DOCKERFILE_LOCN=$VS_DOCKERFILE_PATH/$VS_DOCKERFILE_NAME; fi
if [ -z "$VS_LOG_DATESTAMP" ]; then VS_LOG_DATESTAMP='echo $(date +%d-%b-%Y" "%H:%M:%S.%3N)'; fi
if [ -z "$VS_SCRIPTNAME" ]; then VS_SCRIPTNAME=$(basename $0); fi
#  ==== Hosting Environment Variables ====
if [ -z "$VS_PROXY_SERVER_SCHEME" ]; then VS_PROXY_SERVER_SCHEME=https; fi
#if [ -z "$VS_PROXY_SERVER_FQDN" ]; then VS_PROXY_SERVER_FQDN=feature.visitscotland.com; fi
if [ -z "$VS_PROXY_SERVER_FQDN" ]; then
  if [ ! -z $JOB_NAME ]; then
    VS_PROXY_SERVER_FQDN=$(dirname $JOB_NAME | sed -e "s/-mb//g")
  else
    VS_PROXY_SERVER_FQDN=feature.visitscotland.com
  fi
fi
#  ==== Mail Variables ====
if [ -z "$VS_MAIL_DOMAIN" ]; then VS_MAIL_DOMAIN=visitscotland.net; fi
if [ -z "$VS_MAIL_HOST" ]; then VS_MAIL_HOST=10.1.1.152; fi
if [ -z "$VS_MAIL_NOTIFY_BUILD" ]; then VS_MAIL_NOTIFY_BUILD="TRUE"; fi
if [ -z "$VS_MAIL_NOTIFY_SITE" ]; then VS_MAIL_NOTIFY_SITE="TRUE"; fi
#  == brXM Instance Variables ==
if [ -z "$VS_BRXM_INSTANCE_HTTP_HOST" ]; then
  if [ ! -z "$VS_PROXY_SERVER_FQDN" ]; then
    VS_BRXM_INSTANCE_HTTP_HOST="$VS_PROXY_SERVER_FQDN"
  else
    VS_BRXM_INSTANCE_HTTP_HOST=localhost
  fi
fi

if [ -z "$VS_BRXM_PERSISTENCE_METHOD" ]; then VS_BRXM_PERSISTENCE_METHOD=h2; fi
if [ -z "$VS_BUILD_TYPE" ]; then VS_BUILD_TYPE=BRXM; fi
if [ -z "$VS_CONTAINER_MAIN_APP_PORT" ]; then VS_CONTAINER_MAIN_APP_PORT=8080; fi
if [ -z "$VS_CONTAINER_PORT_INCREMENT" ]; then VS_CONTAINER_PORT_INCREMENT=100; fi
if [ -z "$VS_CONTAINER_CONSOLE_FILE" ]; then VS_CONTAINER_CONSOLE_FILE="/tmp/console.out"; fi
if [ -z "$VS_CONTAINER_BASE_PORT_MIN" ]; then VS_CONTAINER_BASE_PORT_MIN=8001; fi
if [ -z "$VS_CONTAINER_BASE_PORT_MAX" ]; then VS_CONTAINER_BASE_PORT_MAX=8079; fi
if [ -z "$VS_CONTAINER_DYN_PORT_MAX" ]; then VS_CONTAINER_DYN_PORT_MAX=8999; fi
if [ -z "$VS_CONTAINER_INT_PORT_SSR" ]; then VS_CONTAINER_INT_PORT_SSR=8082; fi
if [ -z "$VS_CONTAINER_INT_PORT_SSH" ]; then VS_CONTAINER_INT_PORT_SSH=22; fi
if [ -z "$VS_CONTAINER_INT_PORT_TLN" ]; then VS_CONTAINER_INT_PORT_TLN=8081; fi
if [ -z "$VS_CONTAINER_PRESERVE" ]; then VS_CONTAINER_PRESERVE=TRUE; fi
if [ -z "$VS_CONTAINER_SSH_PASS_ROOT" ]; then VS_CONTAINER_SSH_PASS_ROOT=rootssh; fi
if [ -z "$VS_CONTAINER_SSH_PASS_HIPPO" ]; then VS_CONTAINER_SSH_PASS_HIPPO=hippossh; fi
if [ -z "$VS_CONTAINER_UPDATES_DIR" ]; then VS_CONTAINER_UPDATES_DIR="../files"; fi
if [ -z "$VS_CONTAINER_USR" ]; then VS_CONTAINER_USR=$(id -u $USER); fi
if [ -z "$VS_CONTAINER_GRP" ]; then VS_CONTAINER_GRP=$(id -g $USER); fi
if [ -z "$VS_CONTAINER_WD" ]; then VS_CONTAINER_WD=$PWD; fi
if [ -z "$VS_CONTAINER_WORKSPACE" ]; then VS_CONTAINER_WORKSPACE=$WORKSPACE; fi
if [ -z "$VS_CONTAINER_WORKSPACE_MAP" ]; then VS_CONTAINER_WORKSPACE_MAP=FALSE; fi
if [ -z "$VS_CONTAINER_VOLUME_PERMISSIONS" ]; then VS_CONTAINER_VOLUME_PERMISSIONS="rw,z"; fi
if [ -z "$VS_CONTAINER_PORTS" ]; then VS_CONTAINER_PORTS="-p 3000:3000"; fi
#if [ -z "$VS_CONTAINER_ENVIRONMENT" ]; then VS_CONTAINER_ENVIRONMENT=; fi
if [ -z "$VS_CONTAINER_ENVIRONMENT_FILE" ]; then VS_CONTAINER_ENVIRONMENT_FILE="--env-file [FILE_NAME]"; fi
if [ -z "$VS_CONTAINER_INIT_EXEC" ]; then VS_CONTAINER_INIT_EXEC="cat"; fi
#  ==== (D)SSR Application Variables ====
if [ -z "$VS_FRONTEND_DIR" ]; then VS_FRONTEND_DIR=ui-integration; fi
if [ -z "$VS_SSR_PACKAGE_VERSION" ]; then VS_SSR_PACKAGE_VERSION="package"; fi
if [ -z "$VS_SSR_PACKAGE_SOURCE" ]; then VS_SSR_PACKAGE_SOURCE="$VS_FRONTEND_DIR/ssr/server/ $VS_FRONTEND_DIR/node_modules/@visitscotland/component-library/dist/ssr/ $VS_FRONTEND_DIR/node_modules/ $VS_FRONTEND_DIR/build/"; fi
if [ -z "$VS_SSR_PACKAGE_TARGET" ]; then VS_SSR_PACKAGE_TARGET="./target"; fi
if [ -z "$VS_SSR_PACKAGE_NAME" ]; then VS_SSR_PACKAGE_NAME="vs-ssr-$VS_SSR_PACKAGE_VERSION.tar.gz"; fi
if [ -z "$VS_SSR_PROXY_ON" ]; then VS_SSR_PROXY_ON="TRUE"; fi
if [ -z "$VS_SSR_APP_PORT" ]; then VS_SSR_APP_PORT=8082; fi
if [ -z "$VS_SSR_PROXY_TARGET_HOST" ]; then VS_SSR_PROXY_TARGET_HOST="http://localhost:8080"; fi
#  ==== brC API Server Variables
if [ -z "$VS_BRC_API_SERVER_SCHEME" ]; then VS_BRC_API_SERVER_SCHEME=https; fi
if [ -z "$VS_BRC_API_SERVER_HOST" ]; then VS_BRC_API_SERVER_HOST=ci.visitscotland.com; fi
if [ -z "$VS_BRC_API_SERVER_CONTEXT" ]; then VS_BRC_API_SERVER_CONTEXT=ops/preview; fi
if [ -z "$VS_BRC_API_REMOTE_TRANSFER_METHOD" ]; then VS_BRC_API_REMOTE_TRANSFER_METHOD=SSH; fi
if [ -z "$VS_BRC_API_STACK_NAME" ]; then VS_BRC_API_STACK_NAME=not-set; fi
if [ -z "$VS_BRC_API_ENVIRONMENT_NAME" ]; then VS_BRC_API_ENVIRONMENT_NAME=development; fi
# note: valid environment names are listed in defaultSettings function
if [ -z "$VS_BRC_API_ENVIRONMENT_JOB_PATH" ]; then VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME; fi
if [ -z "$VS_BRC_API_JOB_NAME" ]; then VS_BRC_API_JOB_NAME=upload-distribution; fi
if [ -z "$VS_BRC_API_DEPLOY_AFTER_UPLOAD" ]; then VS_BRC_API_DEPLOY_AFTER_UPLOAD=true; fi
if [ -z "$VS_BRC_API_ARTIFACT_OVERWRITE" ]; then VS_BRC_API_ARTIFACT_OVERWRITE=false; fi
#  ==== Other Variables ====
VS_JENKINS_LAST_ENV=jenkins-last-env
VS_LAST_ENV=vs-last-env
VS_LAST_ENV_QUOTED_SUFFIX=.quoted
VS_LAST_ENV_GROOVY_SUFFIX=.groovy
VS_CONTAINER_NAME_FILE=vs-container-name

# ====/ADJUSTABLE VARIABLES ====

# ==== PARSE COMMAND LINE ARGUMENTS ====
METHOD=$1
while [[ $# -gt 0 ]]; do
  argument="$1"
  THIS_VAR=$(echo $argument | sed -e "s/=.*//g"); #echo $THIS_VAR
  THIS_VAL=$(echo $argument | sed -e "s/.*=//g" | sed -s "s/--.*//g"); #echo $THIS_VAL
  if [ ! -z "$THIS_VAL" ]; then THIS_RESULT="$THIS_VAL"; elif [ ! "${2:0:2}" = "--" ]; then THIS_RESULT="$2"; else THIS_RESULT=""; fi
  if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo -en "\nread \"$THIS_VAR\" from command line"; fi
  case $THIS_VAR in
    --debug) if [ ! -z "$THIS_RESULT" ]; then VS_DEBUG=$THIS_RESULT; else VS_DEBUG=TRUE; fi;;
    --ci-dir) if [ ! -z "$THIS_RESULT" ]; then VS_CI_DIR=$THIS_RESULT; fi;;
    --container-min-port) if [ ! -z "$THIS_RESULT" ]; then VS_CONTAINER_BASE_PORT_MIN=$THIS_RESULT; fi;;
    --container-max-port) if [ ! -z "$THIS_RESULT" ]; then VS_CONTAINER_BASE_PORT_MAX=$THIS_RESULT; fi;;
    --frontend-dir) if [ ! -z "$THIS_RESULT" ]; then VS_FRONTEND_DIR=$THIS_RESULT; fi;;
    --ssr-app-port) if [ ! -z "$THIS_RESULT" ]; then VS_SSR_APP_PORT=$THIS_RESULT; fi;;
    --ssr-target) if [ ! -z "$THIS_RESULT" ]; then VS_SSR_PROXY_TARGET_HOST=$THIS_RESULT; fi;;
    --ssr-package-name) if [ ! -z "$THIS_RESULT" ]; then VS_SSR_PACKAGE_NAME=$THIS_RESULT; fi;;
    --ssr-package-target) if [ ! -z "$THIS_RESULT" ]; then VS_SSR_PACKAGE_TARGET=$THIS_RESULT; fi;;
    --ssr-package-version) if [ ! -z "$THIS_RESULT" ]; then VS_SSR_PACKAGE_VERSION=$THIS_RESULT; fi;;
    --persistence) if [ ! -z "$THIS_RESULT" ]; then VS_BRXM_PERSISTENCE_METHOD=$THIS_RESULT; fi;;
    --persistence-method) if [ ! -z "$THIS_RESULT" ]; then VS_BRXM_PERSISTENCE_METHOD=$THIS_RESULT; fi;;
    --preserve-container) if [ ! -z "$THIS_RESULT" ]; then VS_CONTAINER_PRESERVE=$THIS_RESULT; else VS_CONTAINER_PRESERVE=TRUE; fi;;
    --repository-dir) if [ ! -z "$THIS_RESULT" ]; then VS_BRXM_REPOSITORY=$THIS_RESULT; fi;;
    --reuse-container) if [ ! -z "$THIS_RESULT" ]; then VS_CONTAINER_PRESERVE=$THIS_RESULT; else VS_CONTAINER_PRESERVE=TRUE; fi;;
    --single-function) if [ ! -z "$THIS_RESULT" ]; then VS_THIS_FUNCTION=$THIS_RESULT; fi;;
    --tidy-containers) if [ ! -z "$THIS_RESULT" ]; then VS_TIDY_CONTAINERS=$THIS_RESULT; else VS_TIDY_CONTAINERS=TRUE; fi;;
    --vs-brxm-host) if [ ! -z "$THIS_RESULT" ]; then VS_BRXM_HOST=$THIS_RESULT; fi;;
    --vs-brxm-port) if [ ! -z "$THIS_RESULT" ]; then VS_BRXM_PORT=$THIS_RESULT; fi;;
    --working-dir) if [ ! -z "$THIS_RESULT" ]; then VS_WORKING_DIR=$THIS_RESULT; fi;;
    --map-workspace) if [ ! -z "$THIS_RESULT" ]; then VS_CONTAINER_WORKSPACE_MAP=$THIS_RESULT; fi;;
    --quiet) if [ ! -z "$THIS_RESULT" ]; then VS_SCRIPT_RUN_QUIET=TRUE; fi;;
    *)
      if [ "$DEBUG" == "TRUE" ]; then echo -en " - not a valid argument - SKIPPING"; fi
    ;;
  esac
  shift
done
echo -en "\n"
# ====/PARSE COMMAND LINE ARGUMENTS ====
# ====/SETUP ====

# ==== FUNCTIONS ====
checkVariables() {
  if [ ! "$DEBUG" == "TRUE" ] && [ ! -z "$TERM" ]; then clear; fi
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] Checking variables to ensure environment is set up"
  if [ ! "$LOGNAME" = "jenkins" ] && [ -z "$VS_AGENT_IS_DOCKER" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] - $VS_SCRIPTNAME was not called by the user Jenkins, please switch user"
    exit 3
  elif [ "$LOGNAME" = "jenkins" ] && [ ! -z "$JENKINS_SERVER_COOKIE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] - $VS_SCRIPTNAME appears to be running from a Jenkins job"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - exporting selected variables to $VS_JENKINS_LAST_ENV"
    printenv | egrep "JENKINS_(HOME|URL)|JOB_((BASE_)?NAME|(DISPLAY_)?URL)|VS_(DOCKER|BRC|COMMIT)" | sort > $VS_JENKINS_LAST_ENV
  elif [ "${VS_AGENT_IS_DOCKER^^}" == "TRUE" ] && [ ! -z "$JENKINS_SERVER_COOKIE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] - $VS_SCRIPTNAME appears to be running from a Jenkins job inside a Docker container "
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - exporting selected variables to $VS_JENKINS_LAST_ENV"
    printenv | egrep "JENKINS_(HOME|URL)|JOB_((BASE_)?NAME|(DISPLAY_)?URL)|VS_(DOCKER|BRC|COMMIT)" | sort > $VS_JENKINS_LAST_ENV
  elif [ "$LOGNAME" = "jenkins" ] && [ -z "$JOB_NAME" ] && [ -e $VS_JENKINS_LAST_ENV ]; then
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] - $VS_SCRIPTNAME was called from a Jenkins workspace but not by a Jenkins job"
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - setting Jenkins environment variables from last run"
    source $VS_JENKINS_LAST_ENV
  elif [ "$LOGNAME" = "jenkins" ] && [ -z "$JOB_NAME" ] && [ ! -d ./target ] && [ ! -z "$VS_WORKING_DIR" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] - $VS_SCRIPTNAME was not called from within Jenkins workspace"
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - switching to $VS_WORKING_DIR"
    checkVariables
    cd $VS_WORKING_DIR
  elif [ -z "$JOB_NAME" ] && [ "$VS_WD_PARENT" = "workspace" ] && [ ! -z "$VS_WORKING_DIR" ] && [ ! -e $VS_JENKINS_LAST_ENV ] && [ ! -d ./target ]; then
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] $VS_SCRIPTNAME was called from "$(pwd)" but this may not be a Jenkins workspace, please either:"
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME]  - switch to the workspace of a Jenkins job that has previously run this script"
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME]  - run a Jenkins job for this branch to populate $VS_JENKINS_LAST_ENV and create ./target"
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME]  - call this script with --working-dir=[workspace of a Jenkins job that has previously run this script]"
    exit 2
  else
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] $VS_SCRIPTNAME needs to run relative to a Jenkins workspace, please either:"
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME]  - switch to the workspace of a Jenkins job that has previously run this script"
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME]  - call this script with --working-dir=[workspace of a Jenkins job that has previously run this script]"
    exit 1
  fi
}

defaultSettings() {
  # unset variables
  unset VS_CONTAINER_LIST
  unset VS_PARENT_JOB_NAME
  unset RESERVED_PORT_LIST
  unset VS_CONTAINER_PORT_MAPPINGS
  VS_HOST_IP_ADDRESS=$(/usr/sbin/ip ad sh  | egrep "global noprefixroute" | awk '{print $2}' | sed -e "s/\/.*$//")
  # set, and create if missing, VS_CI_DIR
  if [ -z "$VS_CI_DIR" ]; then
    if [ ! -z "$WORKSPACE" ]; then
      VS_CI_DIR=$WORKSPACE/ci
    else
      VS_CI_DIR=./ci
    fi
  fi
  if [ ! -d "$VS_CI_DIR" ]; then mkdir -p $VS_CI_DIR; fi
  if [ ! -d "$VS_CI_DIR/logs" ]; then mkdir -p $VS_CI_DIR/logs; fi
  ## add additional check here to see if there's a CHANGE_BRANCH variable as well as a BRANCH_NAME variable
  if [ -z "$VS_BRANCH_NAME" ]; then
    if [ ! -z "$CHANGE_BRANCH" ]; then
      # this job is running against a branch in pull request status, using CHANGE_BRANCH variable
      VS_BRANCH_NAME=$CHANGE_BRANCH
    elif [ ! -z "$BRANCH_NAME" ]; then
      # this branch is a branch, using BRANCH_NAME variable
      VS_BRANCH_NAME=$BRANCH_NAME
    else
      VS_BRANCH_NAME="branch-not-found"
    fi
  fi
  # set unique container name from JOB_NAME and VS_BRANCH_NAME - removing / characters
  if [ -z "$VS_CONTAINER_NAME" ]&&[ "$VS_BRANCH_NAME" != "branch-not-found" ]; then
    VS_CONTAINER_NAME=$(dirname $JOB_NAME | sed -e "s/\//_/g")"_"$(basename $VS_BRANCH_NAME)
    VS_CONTAINER_NAME_SHORT=$(basename $VS_BRANCH_NAME)
    VS_CONTAINER_NAME_BASE=$(dirname $JOB_NAME | sed -e "s/\//_/g")
  else
    VS_CONTAINER_NAME=$(dirname $JOB_NAME | sed -e "s/\//_/g")"_"$(basename $BRANCH_NAME)
    VS_CONTAINER_NAME_SHORT=$(basename $BRANCH_NAME)
    VS_CONTAINER_NAME_BASE=$(dirname $JOB_NAME | sed -e "s/\//_/g")
  fi
  # check for VS_CONTAINER_BASE_PORT_OVERRIDE, ensure it's unset if it's not overridden
  if [ -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ]; then
    unset VS_CONTAINER_BASE_PORT_OVERRIDE
  else
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_CONTAINER_BASE_PORT_OVERRIDE was set to $VS_CONTAINER_BASE_PORT_OVERRIDE before $0 was called"
  fi
  # check for VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE, ensure it's unset if it's not overridden
  # - this variable is needed when the pipeline is used with fixed port environments where the branch name may change
  if [ -z "$VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE" ]; then
    VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE="unset"
  else
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE was set to $VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE before $0 was called"
  fi
  # to-do: gp  - write out VS_CONTAINER_NAME to job's workspace/ci/vs-container-name
  if [ -z "$NODE_NAME" ]; then VS_THIS_SERVER=$HOSTNAME; else VS_THIS_SERVER=$NODE_NAME; fi
  if [ "$VS_CONTAINER_PRESERVE" == "TRUE" ]; then
    if [ -z "$VS_BRXM_REPOSITORY" ]; then VS_BRXM_REPOSITORY="repository"; fi
    if [ -z "$VS_HIPPO_REPOSITORY_PERSIST" ]; then VS_HIPPO_REPOSITORY_PERSIST="TRUE"; fi
  fi
  VS_COMMIT_AUTHOR=$(git show -s --pretty="%ae" ${GIT_COMMIT})
  VS_COMMIT_ID_SHORT=$(git rev-parse --short ${GIT_COMMIT})
  VS_DATESTAMP=$(date +%Y%m%d)
  VS_HOST_IP_ADDRESS=$(/usr/sbin/ip ad sh  | egrep "global noprefixroute" | awk '{print $2}' | sed -e "s/\/.*$//")
  VS_PARENT_JOB_NAME=$(echo $JOB_NAME | sed -e "s/\/.*//g")
  VS_PARENT_JOB_NAME_FULL=$(dirname $JOB_NAME)
  VS_SCRIPT_LOG=$VS_CI_DIR/logs/$VS_SCRIPTNAME.log
  if [ ! -z "$STAGE_NAME" ]; then VS_STAGE_NAME=$(echo ${STAGE_NAME,,} | sed -e "s/ /-/g"); fi
  if [ "${VS_SSR_PROXY_ON^^}" == "TRUE" ]; then
    VS_PROXY_QS_SSR="&vs_ssr_proxy=on"
  else
    VS_PROXY_QS_SSR="&vs_ssr_proxy=off"
  fi
  # VS BRC API server settings
  if [ "$VS_BRC_API_ENVIRONMENT_NAME" == "stack" ]; then
    VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME
  elif [ "$VS_BRC_API_ENVIRONMENT_NAME" == "development" ]; then
    VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME
  elif [ "$VS_BRC_API_ENVIRONMENT_NAME" == "testing" ]; then
    VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME
  elif [ "$VS_BRC_API_ENVIRONMENT_NAME" == "staging" ]; then
    VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME
  elif [ "$VS_BRC_API_ENVIRONMENT_NAME" == "production" ]; then
    VS_BRC_API_ENVIRONMENT_JOB_PATH=$VS_BRC_API_ENVIRONMENT_NAME
  else
    VS_BRC_API_ENVIRONMENT_JOB_PATH=not-set
  fi
  VS_BRC_API_SERVER_JOB_URL="$VS_BRC_API_SERVER_SCHEME://$VS_BRC_API_SERVER_HOST/$VS_BRC_API_SERVER_CONTEXT/job/$VS_BRC_API_STACK_NAME/job/$VS_BRC_API_ENVIRONMENT_JOB_PATH/job/$VS_BRC_API_JOB_NAME"
  # mail settings - build
  if [ -z "$VS_MAIL_NOTIFY_BUILD_TO" ]; then VS_MAIL_NOTIFY_BUILD_TO=$VS_COMMIT_AUTHOR; fi
  VS_MAIL_NOTIFY_BUILD_SENDER="$VS_PARENT_JOB_NAME"
  VS_MAIL_NOTIFY_BUILD_MESSAGE=/tmp/$VS_CONTAINER_NAME.msg.notify.build
  VS_MAIL_NOTIFY_BUILD_MESSAGE_EXTRA=$VS_MAIL_NOTIFY_BUILD_MESSAGE.extra
  VS_MAIL_NOTIFY_BUILD_SUBJECT="environment was built for $JOB_BASE_NAME in $VS_PARENT_JOB_NAME"
  VS_MAIL_NOTIFY_BUILD_SENDER="$VS_PARENT_JOB_NAME@$VS_MAIL_DOMAIN"
  # mail settings - site
  if [ -z "$VS_MAIL_MESSAGE_NOTIFY_SITE_TO" ]; then VS_MAIL_MESSAGE_NOTIFY_SITE_TO=$VS_COMMIT_AUTHOR; fi
  VS_MAIL_NOTIFY_SITE_SENDER="$VS_PARENT_JOB_NAME"
  VS_MAIL_NOTIFY_SITE_MESSAGE=/tmp/$VS_CONTAINER_NAME.msg.notify.site
  VS_MAIL_NOTIFY_SITE_SUBJECT="$VS_PARENT_JOB_NAME environment was built for $VS_BRANCH_NAME"
  # mail settings - executable
  VS_WD_PARENT="$(basename `echo ${PWD%/*}`)"
  if [ ! -z $VS_MAILER_BIN ]; then
    if [ ! -z "$(which mailx)" ]; then
      VS_MAILER_BIN="$(which mailx)"
    elif [ ! -z "$(which mail)" ]; then
      VS_MAILER_BIN="$(which mail)"
    else
      VS_MAILER_BIN="/bin/false"
    fi
  fi
}

reportSettings() {
  clear
  echo ""
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ========================================================================"
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] == RUNNING JENKINS SHELL COMMANDS on $VS_THIS_SERVER"
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] == as user " $USER
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] == from " $VS_SCRIPTNAME
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ========================================================================"
  echo ""
  if [ "${VS_DEBUG^^}" == "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] ==== printenv ===="
    printenv | sort
    echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] ====/printenv ===="
    echo ""
  fi
  if [ "${VS_DEBUG^^}" == "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ==== selected Jenkins environment variables ===="
    set | egrep "^(BRANCH|BUILD|CHANGE|GIT|JENKINS|JOB|RUN|WORKSPACE)" | sort
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ====/selected Jenkins environment variables ===="
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ==== all VS_ environment variables ===="
    set | egrep "^(VS_)" | sort
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] ====/all VS_ environment variables ===="
    echo ""
  fi
  writeSettings
}

writeSettings() {
  if [ "${VS_DEBUG^^}"  == "TRUE" ]; then
	  echo; echo "== printenv in ${FUNCNAME} in $VS_STAGE_NAME ==" | tee printenv.${FUNCNAME[1]}.$METHOD.$VS_STAGE_NAME
    printenv | sort | tee -a printenv.${FUNCNAME[1]}.$METHOD.$VS_STAGE_NAME
    echo "==/printenv after ${FUNCNAME} in $VS_STAGE_NAME =="
  else
    echo; echo "== printenv in $METHOD in $VS_STAGE_NAME ==" > printenv.${FUNCNAME[1]}.$METHOD.$VS_STAGE_NAME
    printenv | sort >> printenv.${FUNCNAME[1]}.$METHOD.$VS_STAGE_NAME
  fi
}

checkContainers() {
  # check to see if a container called $VS_CONTAINER_NAME exists, if so set $CONTAINER_ID to Docker's CONTAINER ID
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking for containers with name $VS_CONTAINER_NAME"
  CONTAINER_ID=$(docker ps -aq --filter "name=^$VS_CONTAINER_NAME$")
  if [ ! -z "$CONTAINER_ID" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - container found, ID:$CONTAINER_ID, with name $VS_CONTAINER_NAME"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - checking status of container $CONTAINER_ID"
    CONTAINER_STATUS=$(docker inspect --format "{{.State.Status}}" $CONTAINER_ID)
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $CONTAINER_STATUS container found with ID:$CONTAINER_ID and name $VS_CONTAINER_NAME"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - checking for base port of container $CONTAINER_ID"
    CONTAINER_PORT=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "'$VS_CONTAINER_MAIN_APP_PORT'/tcp") 0).HostPort}}' $CONTAINER_ID)
    if [ ! -z "$CONTAINER_PORT" ]; then
      VS_CONTAINER_BASE_PORT_OVERRIDE=$CONTAINER_PORT
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - base port of $CONTAINER_PORT found for container $CONTAINER_ID - setting VS_CONTAINER_BASE_PORT_OVERRIDE"
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]   - checking other ports (for info)"
      VS_CONTAINER_OTHER_PORTS=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}} {{$p}} -> {{(index $conf 0).HostPort}} {{end}}' $CONTAINER_ID)
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]   - $VS_CONTAINER_OTHER_PORTS"
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - no base port was found for container $CONTAINER_ID"
    fi
  elif [ -z "$CONTAINER_ID" ] && [ ! -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ]; then
    # since VS_CONTAINER_BASE_PORT_OVERRIDE is set, and we've already determined there are no containers running with VS_CONTAINER_NAME
    # - we need check to see if any container is using VS_CONTAINER_BASE_PORT_OVERRIDE and, if so, identify an impending port clash
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - no container found with name $VS_CONTAINER_NAME but VS_CONTAINER_BASE_PORT_OVERRIDE was set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]   - checking for containers with using port $VS_CONTAINER_BASE_PORT_OVERRIDE"
    CONTAINER_ID=$(docker ps --format '{{.ID}} {{.Ports}}' | grep ":$VS_CONTAINER_BASE_PORT_OVERRIDE->" | awk '{print $1}')
    if [ ! -z "$CONTAINER_ID" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - container found, ID:$CONTAINER_ID, using override port $VS_CONTAINER_BASE_PORT_OVERRIDE"
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - checking status of container $CONTAINER_ID"
      CONTAINER_STATUS=$(docker inspect --format "{{.State.Status}}" $CONTAINER_ID)
      CONTAINER_NAME=$(docker ps --filter "id=$CONTAINER_ID" --format "{{.Names}}")
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - $CONTAINER_STATUS container found with ID:$CONTAINER_ID and name $CONTAINER_NAME, a port clash is predicted"
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]   - if VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE is set to TRUE then $CONTAINER_ID will be removed"
      VS_CONTAINER_PORT_CLASH_PREDICTED=TRUE
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - no base port was found for container $CONTAINER_ID"
    fi
  else
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - no container found with name $VS_CONTAINER_NAME"
  fi
  echo ""
}

stopContainers() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] stopping containers with ID $CONTAINER_ID"
  for CONTAINER in $CONTAINER_ID; do
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - stopping $CONTAINER"
    docker stop $CONTAINER
  done
  echo ""
}

startContainers() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] starting containers with ID $CONTAINER_ID"
  for CONTAINER in $CONTAINER_ID; do
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - starting $CONTAINER"
    docker start $CONTAINER
    RETURN_CODE=$?; echo " - return code: " $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to start container $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
  done
  echo ""
}

deleteContainers() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] deleting containers with name $CONTAINER_ID"
  for CONTAINER in $CONTAINER_ID; do
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - deleting $CONTAINER"
    docker container rm -f $CONTAINER
  done
  echo ""
}

deleteImages() {
  #delete existing images - does this have a purpose? will there ever be an image with the name $VS_CONTAINER_NAME?
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] deleting any docker images with name $VS_CONTAINER_NAME"
  docker images | egrep "$VS_CONTAINER_NAME"
  for IMAGE in $(docker images | egrep "$VS_CONTAINER_NAME" | awk '{print $3}'); do
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] deleting $IMAGE"
    docker image rm -f $IMAGE
  done
  echo ""
}

manageContainers() {
  # at this point we know VS_CONTAINER_NAME, VS_CONTAINER_PRESERVE, CONTAINER_ID, CONTAINER_STATUS, VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE, VS_CONTAINER_PORT_CLASH_PREDICTED
  # if container is RUNNING and preserve running is TRUE then - stop tomcat/undeploy app/leave alone?
  # if container is STOPPED and preserve running is TRUE then - ?
  # if container is running and preserve running is FALSE then - deleteContainers
  # if a port clash and remove when in use is detected then - deleteContainers, the value of preserve doesn't matter in this case
  if [ ! -z "$CONTAINER_ID" ] && [ ! "${VS_CONTAINER_PORT_CLASH_PREDICTED^^}" == "TRUE" ]; then
    if [ "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ "$CONTAINER_STATUS" == "running" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_CONTAINER_PRESERVE is $VS_CONTAINER_PRESERVE so existing container $CONTAINER_ID will be re-used"
    elif [ "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ ! "$CONTAINER_STATUS" == "running" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_CONTAINER_PRESERVE is $VS_CONTAINER_PRESERVE so existing container $CONTAINER_ID will be started and re-used"
      startContainers
    elif [ ! "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ "$CONTAINER_STATUS" == "running" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] VS_CONTAINER_PRESERVE is $VS_CONTAINER_PRESERVE so existing container $CONTAINER_ID will be stopped and removed"
      stopContainers
      deleteContainers
    elif [ ! "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ ! "$CONTAINER_STATUS" == "running" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] VS_CONTAINER_PRESERVE is $VS_CONTAINER_PRESERVE so existing container $CONTAINER_ID will be removed"
      deleteContainers
    else
      echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] CONTAINER_ID: $CONTAINER_ID was found but container status could not be determined"
    fi
  elif [ ! -z "$CONTAINER_ID" ] && [ "${VS_CONTAINER_PORT_CLASH_PREDICTED^^}" == "TRUE" ]; then
    if [ "${VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE}" == "TRUE" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE is $VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE and VS_CONTAINER_PORT_CLASH_PREDICTED is $VS_CONTAINER_PORT_CLASH_PREDICTED, so existing container $CONTAINER_ID will be removed"
      deleteContainers
      unset CONTAINER_ID
    else
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  VS_CONTAINER_PORT_CLASH_PREDICTED is $VS_CONTAINER_PORT_CLASH_PREDICTED but VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE is $VS_CONTAINER_REMOVE_WHEN_PORT_IN_USE, so existing container $CONTAINER_ID will be left and this operation will be marked as a failure"
    fi
  else
    echo "$(eval $VS_LOG_DATESTAMP) INFO [$VS_SCRIPTNAME] No CONTAINER_ID was found"
  fi
  echo ""
}

# check all branches to see what ports are "reserved" by existing containers
getChildBranchesViaCurl() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking for ports reserved by other branches in $VS_PARENT_JOB_NAME"
  #for CONTAINER in $(curl -s $JENKINS_URL/job/$VS_PARENT_JOB_NAME/rssLatest | sed -e "s/type=\"text\/html\" href=\"/\n/g" | egrep "^https" | sed -e "s/%252F/\//g" | sed "s/\".*//g" | sed -e "s/htt.*\/\(.*\)\/[0-9]*\//\1/g" | egrep -v "http"); do
  #  VS_CONTAINER_LIST="$VS_CONTAINER_LIST $CONTAINER"
  #  RESERVED_PORT=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' $VS_PARENT_JOB_NAME\_$CONTAINER 2>/dev/null)
  #  if [ ! -z "$RESERVED_PORT" ]; then
  #    RESERVED_PORT_LIST="$RESERVED_PORT_LIST $RESERVED_PORT"
  #    echo " - $RESERVED_PORT is reserved by $VS_PARENT_JOB_NAME\_$CONTAINER"
  #  fi
  #done
}

getBranchListViaCurl() {
  for CONTAINER in $(curl -s $JENKINS_URL/job/$VS_PARENT_JOB_NAME/rssLatest | sed -e "s/type=\"text\/html\" href=\"/\n/g" | egrep "^https" | sed -e "s/%252F/\//g" | sed "s/\".*//g" | sed -e "s/htt.*\/\(.*\)\/[0-9]*\//$VS_PARENT_JOB_NAME\_\1/g" | egrep -v "http"); do
    BRANCH_LIST="$BRANCH_LIST $CONTAINER"
    RESERVED_PORT=$(docker inspect --format='{{(index (index .HostConfig.PortBindings "8080/tcp") 0).HostPort}}' $CONTAINER 2>/dev/null)
    if [ ! -z "$RESERVED_PORT" ]; then
      RESERVED_PORT_LIST="$RESERVED_PORT_LIST $RESERVED_PORT"
      echo " - $RESERVED_PORT is reserved by $CONTAINER"
    fi
  done
  echo ""
}

getPullRequestListViaCurl() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking for ports reserved by pull requests in $VS_PARENT_JOB_NAME"
  for CONTAINER in $(curl -s $JENKINS_URL/job/$VS_PARENT_JOB_NAME/view/change-requests/rssLatest | sed -e "s/type=\"text\/html\" href=\"/\n/g" | egrep "^https" | sed -e "s/%252F/\//g" | sed "s/\".*//g" | sed -e "s/htt.*\/\(.*\)\/[0-9]*\//$VS_PARENT_JOB_NAME\_\1/g" | egrep -v "http"); do
    BRANCH_LIST="$BRANCH_LIST $CONTAINER"
    RESERVED_PORT=$(docker inspect --format='{{(index (index .HostConfig.PortBindings "8080/tcp") 0).HostPort}}' $CONTAINER 2>/dev/null)
    if [ ! -z "$RESERVED_PORT" ]; then
      RESERVED_PORT_LIST="$RESERVED_PORT_LIST $RESERVED_PORT"
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $RESERVED_PORT is reserved by $CONTAINER"
    fi
  done;
}

getBranchListFromWorkspace() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking for branches and PRs for $VS_PARENT_JOB_NAME_FULL listed in workspaces.txt"
  # to-do: gp - update echo above to reflect changes to branch and PR scan method
  for BRANCH in $(cat $JENKINS_HOME/workspace/workspaces.txt | grep "$VS_PARENT_JOB_NAME_FULL" | sed -e "s/%2F/\//g; s#.*/#$VS_PARENT_JOB_NAME_FULL\_#g; s#/#_#g"); do
    if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  - found branch $BRANCH"; fi
    BRANCH_LIST="$BRANCH_LIST $BRANCH"
  done
  # to-do: gp add for loop to check for vs-container-name map files in _PR only (avoid doubles)
  #           for PR in [logic above | grep _PR] check PR's workspace/ci for vs-container-name file
  #           cat the file for a branch name and add those branches to BRANCH_LIST (some)
  
  for PR in $(cat $JENKINS_HOME/workspace/workspaces.txt | grep "$VS_PARENT_JOB_NAME_FULL/PR-"); do
    PR_DIR=$(cat $JENKINS_HOME/workspace/workspaces.txt | grep -a1 "$PR" | tail -1)
    unset BRANCH VS_LAST_ENV_FOUND VS_CONTAINER_NAME_FILE_FOUND
    if [ ! -z "$JENKINS_HOME/workspace/$PR_DIR" ] && [ -d $JENKINS_HOME/workspace/$PR_DIR ]; then
#      echo " - found PR $PR_DIR, looking for $VS_LAST_ENV or $VS_CONTAINER_NAME_FILE in $JENKINS_HOME/workspace/$PR_DIR"
      VS_LAST_ENV_FOUND=$(find $JENKINS_HOME/workspace/$PR_DIR -name "$VS_LAST_ENV")
      VS_CONTAINER_NAME_FILE_FOUND=$(find $JENKINS_HOME/workspace/$PR_DIR -name "$VS_CONTAINER_NAME_FILE")
#      echo "found VS_LAST_ENV_FOUND=$VS_LAST_ENV_FOUND, VS_CONTAINER_NAME_FILE_FOUND=$VS_CONTAINER_NAME_FILE_FOUND"
      if [ ! -z "$VS_CONTAINER_NAME_FILE_FOUND" ] && [ -a $VS_CONTAINER_NAME_FILE_FOUND ]; then
#        echo "found $VS_CONTAINER_NAME_FILE_FOUND"
        BRANCH=$(cat $VS_CONTAINER_NAME_FILE_FOUND | head -1)
#        echo "BRANCH=$BRANCH in 2"
        if [ "${VS_DEBUG^^}" == "TRUE" ] && [ ! -z "$BRANCH" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  - found branch $BRANCH for $(basename $PR) in $VS_CONTAINER_NAME_FILE"; fi
        if [ ! -z "$BRANCH" ]; then BRANCH_LIST="$BRANCH_LIST $BRANCH"; fi
      elif [ ! -z "$VS_LAST_ENV_FOUND" ] && [ -a $VS_LAST_ENV_FOUND ]; then
#        echo "found $VS_LAST_ENV_FOUND"
        BRANCH=$(cat $VS_LAST_ENV_FOUND | egrep "(VS_)(CHANGE_BRANCH|CONTAINER_NAME)=" | sed -e "s/.*=//g" | head -1)
#        echo "BRANCH=$BRANCH in 1"
        if [ "${VS_DEBUG^^}" == "TRUE" ] && [ ! -z "$BRANCH" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  - found branch $BRANCH for $(basename $PR) in $VS_LAST_ENV"; fi
        if [ ! -z "$BRANCH" ]; then BRANCH_LIST="$BRANCH_LIST $BRANCH"; fi
      else
        if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  - no branch found for $PR"; fi
      fi
    fi
  done
#  echo $BRANCH_LIST
  echo ""
}

getReservedPortList() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking for base ports reserved by containers in BRANCH_LIST"
  #if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$BRANCH_LIST"; fi
  for BRANCH in $BRANCH_LIST; do
    #if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo " - checking $BRANCH"; fi
    #RESERVED_PORT=$(docker port $BRANCH 2>/dev/null| awk '{gsub(/.*:/,"");}1')
    RESERVED_PORT=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "'$VS_CONTAINER_MAIN_APP_PORT'/tcp") 0).HostPort}}' $BRANCH 2>/dev/null)
    if [ ! -z "$RESERVED_PORT" ]; then
      if [ ! -z "$RESERVED_PORT_LIST" ]; then
        RESERVED_PORT_LIST="$RESERVED_PORT_LIST $RESERVED_PORT"
      else
        RESERVED_PORT_LIST="$RESERVED_PORT"
      fi
      if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  -- $RESERVED_PORT is reserved by $BRANCH"; fi
    fi
  done
  if [ ! -z "$RESERVED_PORT_LIST" ]; then echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - ports $RESERVED_PORT_LIST are reserved"; fi
  echo ""
}

tidyContainers() {
  # tidy containers when building the "develop" branch
  if [ "$GIT_BRANCH" == "develop" ]||[ "${VS_TIDY_CONTAINERS^^}" == "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking all containers on $NODE_NAME matching $VS_CONTAINER_NAME_BASE*"
    for CONTAINER in $(docker ps -a --filter "name=$VS_CONTAINER_NAME_BASE*" --format "table {{.Names}}" | tail -n +2); do
      CONTAINER_MATCHED=
      ALL_CONTAINER_LIST="$ALL_CONTAINER_LIST $CONTAINER"
      #echo "checking to see if there's a branch for $CONTAINER"
      if [ ! -z "$BRANCH_LIST" ]; then 
        for BRANCH_CONTAINER in $BRANCH_LIST; do
          if [ "$CONTAINER" = "$BRANCH_CONTAINER" ]; then
            echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - there is a branch associated with container $CONTAINER"
            CONTAINER_MATCHED="TRUE"
            break
          fi
        done
        if [ ! "$CONTAINER_MATCHED" = "TRUE" ]; then
          echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - no branch was found matching container $CONTAINER - deleting"
          docker container rm -f $CONTAINER
        fi
      else
        echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] no branches were found in BRANCH_LIST - not safe to delete containers - please confirm manually"
      fi
    done
    echo ""
  fi
}

setPortRange() {
  # to-do: gp - consider if this logic should live in the pipeline rather than the script
  #      : gp - considered, the per branch/job overrides should be set in the pipeline, not here
  #      :    - the entire if block below can be removed
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] determining port range to test for available base ports"
    if [ -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ]; then
    if [ "$VS_PARENT_JOB_NAME" == "develop-stable.visitscotland.com-mb" ] && [ "$GIT_BRANCH" == "develop" ]; then
      VS_CONTAINER_BASE_PORT_OVERRIDE=8100
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] GIT_BRANCH is $GIT_BRANCH, OVERRIDE PORT will be set to  $VS_CONTAINER_BASE_PORT_OVERRIDE"
    elif [ "$VS_PARENT_JOB_NAME" == "develop.visitscotland.com-mb" ] && [ "$GIT_BRANCH" == "develop" ]; then
      VS_CONTAINER_BASE_PORT_OVERRIDE=8099
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] GIT_BRANCH is $GIT_BRANCH for JOB $VS_PARENT_JOB_NAME, OVERRIDE PORT will be set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
    elif [ "$VS_PARENT_JOB_NAME" == "develop-nightly.visitscotland.com-mb" ] && [ "$GIT_BRANCH" == "develop" ]; then
      VS_CONTAINER_BASE_PORT_OVERRIDE=8098
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] GIT_BRANCH is $GIT_BRANCH, OVERRIDE PORT will be set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
    elif [ "$VS_PARENT_JOB_NAME" == "feature.visitscotland.com-mb" ] && [ "$GIT_BRANCH" == "develop" ]; then
      VS_CONTAINER_BASE_PORT_OVERRIDE=8097
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] GIT_BRANCH is $GIT_BRANCH, OVERRIDE PORT will be set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] GIT_BRANCH is $GIT_BRANCH for JOB $VS_PARENT_JOB_NAME, NO OVERRIDE PORT will be set"
    fi
  fi
  # even if override is set we must still check to ensure the port is free
  # MIN_PORT/MAX_PORT values are set here to a range if no override is set, or to the value of the override if it is
  # if the override port if in use the job must fail in the findBasePort proc
  if [ -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ]; then
    MIN_PORT=$VS_CONTAINER_BASE_PORT_MIN
    MAX_PORT=$VS_CONTAINER_BASE_PORT_MAX
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - MIN_PORT and MAX_PORT will be set to $VS_CONTAINER_BASE_PORT_MIN and $VS_CONTAINER_BASE_PORT_MAX since VS_CONTAINER_BASE_PORT_OVERRIDE is not set"
    echo ""
  else
    MIN_PORT=$VS_CONTAINER_BASE_PORT_OVERRIDE
    MAX_PORT=$VS_CONTAINER_BASE_PORT_OVERRIDE
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - MIN_PORT and MAX_PORT will be set to $VS_CONTAINER_BASE_PORT_OVERRIDE due to VS_CONTAINER_BASE_PORT_OVERRIDE"
    echo ""
  fi
}

findBasePort() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] finding a free port to map to the new container's Tomcat port - range $MIN_PORT-$MAX_PORT"
  THIS_PORT=$MIN_PORT
  while [ $THIS_PORT -le $MAX_PORT ]; do
    FREE=$(netstat -an | egrep "LISTEN *$" | grep $THIS_PORT)
    if [ "$FREE" = "" ]; then
      PORT_IN_USE="FALSE"
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - netstat says $THIS_PORT is free, checking it's not reserved"
      for RESERVED_PORT in $RESERVED_PORT_LIST; do
        if [ "$RESERVED_PORT" = "$THIS_PORT" ]; then
          echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - docker says $THIS_PORT is reserved"
          PORT_RESERVED="TRUE"
        else
          PORT_RESERVED="FALSE"
        fi
      done
      if [ ! "$PORT_RESERVED" = "TRUE" ]; then
        break
      else
        THIS_PORT=$((THIS_PORT+1))
        sleep 0
      fi
    else
      PORT_IN_USE="TRUE"
      THIS_PORT=$((THIS_PORT+1))
      sleep 0
    fi
  done
  
  if [ $THIS_PORT -le $MAX_PORT ]; then
    VS_CONTAINER_BASE_PORT=$THIS_PORT
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - VS_CONTAINER_BASE_PORT set to $VS_CONTAINER_BASE_PORT"
  elif [ $THIS_PORT -gt $MAX_PORT ] && [ ! -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ] && [ "$PORT_IN_USE" = "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - override port $VS_CONTAINER_BASE_PORT_OVERRIDE is in-use - checking if it's reserved by this branch"
    HAS_PORT_ID=$(docker ps -a | grep ":$VS_CONTAINER_BASE_PORT_OVERRIDE" | tail -1 | awk '{print $1}')
    HAS_PORT_NAME=$(docker ps -a --filter="id=$HAS_PORT_ID" --format "table {{.Names}}" | tail -n +2)
    if [ "$HAS_PORT_NAME" == "$VS_CONTAINER_NAME" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  -- success - port is owned by $HAS_PORT_NAME"
      VS_CONTAINER_BASE_PORT=$VS_CONTAINER_BASE_PORT_OVERRIDE
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  -- VS_CONTAINER_BASE_PORT set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
    else
      FAIL_REASON="$VS_CONTAINER_BASE_PORT_OVERRIDE is in use by $HAS_PORT_NAME, setting PORT to NULL"
      THIS_PORT=NULL
      SAFE_TO_PROCEED=FALSE
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $FAIL_REASON"
    fi
  elif [ $THIS_PORT -gt $MAX_PORT ] && [ ! -z "$VS_CONTAINER_BASE_PORT_OVERRIDE" ] && [ ! "$PORT_RESERVED" = "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - override port $VS_CONTAINER_BASE_PORT_OVERRIDE was not reserved - don't know how we got here"
    VS_CONTAINER_BASE_PORT=$VS_CONTAINER_BASE_PORT_OVERRIDE
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  -- VS_CONTAINER_BASE_PORT set to $VS_CONTAINER_BASE_PORT_OVERRIDE"
  else
    FAIL_REASON="port scan reached $MAXPORT, no ports are free, setting PORT to NULL"
    THIS_PORT=NULL
    SAFE_TO_PROCEED=FALSE
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $FAIL_REASON"
  fi
  echo ""
}

findDynamicPorts() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] finding free ports from $VS_CONTAINER_BASE_PORT in increments of $VS_CONTAINER_PORT_INCREMENT to dynamically map to other services on the new container - up to $VS_CONTAINER_DYN_PORT_MAX"
  THIS_PORT=$VS_CONTAINER_BASE_PORT
  echo "# " > $VS_MAIL_NOTIFY_BUILD_MESSAGE_EXTRA
  for VS_CONTAINER_INT_PORT in $(set | grep -E "^VS_CONTAINER_INT_PORT_"); do
    VS_CONTAINER_SERVICE=$(echo "$VS_CONTAINER_INT_PORT" | sed -e "s/.*_//g" | sed -e "s/=.*//g")
    VS_CONTAINER_SERVICE_PORT=$(echo "$VS_CONTAINER_INT_PORT" | sed -e "s/.*=//g")
    VS_CONTAINER_SERVICE_LIST=$VS_CONTAINER_SERVICE_LIST" "$VS_CONTAINER_SERVICE
    VS_CONTAINER_SERVICE_LIST_PORTS=$VS_CONTAINER_SERVICE_LIST_PORTS" "$VS_CONTAINER_SERVICE_PORT
    while [ $THIS_PORT -le $VS_CONTAINER_DYN_PORT_MAX ]; do
      THIS_PORT=$((THIS_PORT+$VS_CONTAINER_PORT_INCREMENT))
      FREE=$(netstat -an | egrep "LISTEN *$" | grep $THIS_PORT)
      if [ "$FREE" = "" ]; then
        #echo " - netstat says $THIS_PORT is free - using it"
	      eval "VS_CONTAINER_EXT_PORT_"$VS_CONTAINER_SERVICE"="$THIS_PORT
          echo "# service $VS_CONTAINER_SERVICE on port $VS_CONTAINER_SERVICE_PORT has been mapped to external port $THIS_PORT" >> $VS_MAIL_NOTIFY_BUILD_MESSAGE_EXTRA
	      THIS_DOCKER_MAP="-p $THIS_PORT:$VS_CONTAINER_SERVICE_PORT"
	      VS_CONTAINER_PORT_MAPPINGS="$THIS_DOCKER_MAP $VS_CONTAINER_PORT_MAPPINGS"
	      break
      elif [ ! "$FREE" = "" ] && [ "$VS_CONTAINER_PRESERVE" == "TRUE" ]; then
        echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - netstat says $THIS_PORT is not free - checking if it's reserved by this branch "
        HAS_PORT_ID=$(docker ps -a | grep $THIS_PORT | tail -1 | awk '{print $1}')
        HAS_PORT_NAME=$(docker ps -a --filter="id=$HAS_PORT_ID" --format "table {{.Names}}" | tail -n +2)
        if [ "$HAS_PORT_NAME" == "$VS_CONTAINER_NAME" ]; then
          echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  -- success - port is owned by $HAS_PORT_NAME"
	        eval "VS_CONTAINER_EXT_PORT_"$VS_CONTAINER_SERVICE"="$THIS_PORT
	        break
	      fi
      else
        echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $THIS_PORT is in use, trying "$((THIS_PORT+$VS_CONTAINER_PORT_INCREMENT))
      fi
    done
  done
  unset VS_CONTAINER_INT_PORT
  for SERVICE in $VS_CONTAINER_SERVICE_LIST; do
    unset MAPPINGS
    for MAPPING in $(set | grep -E "^VS_CONTAINER_(INT|EXT)_PORT_$SERVICE"); do
      if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  found MAPPING $MAPPING for SERVICE $SERVICE"; fi
      MAPPINGS=$MAPPING" "$MAPPINGS
      if [ "${VS_DEBUG^^}" == "TRUE" ]; then echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME]  added $MAPPING for $SERVICE to MAPPINGS for $MAPPINGS"; fi
    done
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - for service $SERVICE: $MAPPINGS" 
  done
  if [ ! -z "$VS_CONTAINER_PORT_MAPPINGS" ]; then 
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - Docker will be presented with: $VS_CONTAINER_PORT_MAPPINGS"
  else
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - Port mappings were not set"
  fi
  echo ""
}

# search for latest Hippo distribution files if VS_HIPPO_LATEST is not already set
findHippoArtifact() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    if [ -z $VS_HIPPO_LATEST ]; then
      # search in $WORKSPACE/target/ for files matching "*.tar.gz"
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] searching for latest Hippo distribution files in $WORKSPACE/target"
      VS_HIPPO_LATEST=$(ls -alht $WORKSPACE/target/visit*.tar.gz | head -1 | awk '{print $9}') 2>&1 > /dev/null
      if [ -z "$VS_HIPPO_LATEST" ]; then
        # recursive search in $WORKSPACE/ for files matching "dot-com-brxm*.tar.gz"
        echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] no archive found in $WORKSPACE/target/, widening search"
        VS_HIPPO_LATEST=$(find $WORKSPACE/ -name "dot-com-brxm*.tar.gz" | head -1)
      fi
      if [ ! -z "$VS_HIPPO_LATEST" ]; then
        echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - found $VS_HIPPO_LATEST"
      else
        VS_HIPPO_LATEST=NULL
        SAFE_TO_PROCEED=FALSE
        FAIL_REASON="no archive found in $WORKSPACE, giving up"
        echo " - $FAIL_REASON"
      fi
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] search for distribution files will not be run as VS_HIPPO_LATEST was overridden to $VS_HIPPO_LATEST"
    fi
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] search for distribution files will not be run due to previous failures"
  fi
  echo ""
}
# prepare SSR app
rebuildNodeModules() {
  if [[ "${VS_SSR_PROXY_ON^^}" = "TRUE" && ( "${VS_REBUILD_NODE_MODULES^^}" = "TRUE" ) && ! "$SAFE_TO_PROCEED" = "FALSE" ]]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] rebuilding node_modules directory"
    VS_FUNCTION_STARTTIME=$(date +%s)
    if [ -d "$VS_FRONTEND_DIR" ]; then
      cd $VS_FRONTEND_DIR
      VS_NODE_MODULES_SIZE=$(du -hs node_modules | awk '{print $1}')
      echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] node_modules directory is $VS_NODE_MODULES_SIZE in size"
      if [ -d "node_modules.build" ]; then rm -rf node_modules.build; fi
      mv --force node_modules node_modules.build
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] running npm install"
      npm install > $VS_CI_DIR/logs/npm_install.log 2>&1
      RETURN_CODE=$?; echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - return code: " $RETURN_CODE
      VS_NODE_MODULES_SIZE=$(du -hs node_modules | awk '{print $1}')
      echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] node_modules directory is $VS_NODE_MODULES_SIZE in size"
      cd $OLDPWD
      VS_FUNCTION_ENDTIME=$(date +%s)
      VS_FUNCTION_RUNTIME=$((VS_FUNCTION_ENDTIME-VS_FUNCTION_STARTTIMETIME))
      echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] ${FUNCNAME[0]} took $VS_FUNCTION_RUNTIME seconds to run"
      echo ""
    fi
  else
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_REBUILD_NODE_MODULES was set to" $VS_REBUILD_NODE_MODULES "skipping node_modules rebuild"
    echo ""
  fi
}

uploadHippoArtifactBRC() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    if [ ! -z "$VS_HIPPO_LATEST" ] && [ ! "$VS_HIPPO_LATEST" = "NULL" ]; then
      if [ ! -z "$VS_HOST_IP_ADDRESS" ]; then
          VS_BRC_API_REMOTE_ARTIFACT="$LOGNAME"@"$VS_HOST_IP_ADDRESS":"$VS_HIPPO_LATEST"
          VS_BRC_API_JOB_PARAMETERS="/buildWithParameters?token=$VS_BRC_API_UPLOAD_JOB_KEY&deploy_after_upload=$VS_BRC_API_DEPLOY_AFTER_UPLOAD&artefact_overwrite=$VS_BRC_API_ARTIFACT_OVERWRITE&artefact_remote_location=$VS_BRC_API_REMOTE_ARTIFACT"
          echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] attempting to upload $VS_HIPPO_LATEST with using $VS_BRC_API_SERVER_JOB_URL"
          curl -v "$VS_BRC_API_SERVER_JOB_URL$VS_BRC_API_JOB_PARAMETERS" 2>&1 | grep "<" | sed -s 's/^< //'
      else
        SAFE_TO_PROCEED=FALSE
        FAIL_REASON="no source address was set for this server, remote server would not be able to connect"
        echo " - $FAIL_REASON"
      fi
    else
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="VS_HIPPO_LATEST was not set, no artifact is available"
      echo " - $FAIL_REASON"
    fi
      else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] upload of distribution files to brCloud will not be run due to previous failures"
  fi
  echo ""
}

# package SSR app files
packageSSRArtifact() {
  if [ "${VS_SSR_PROXY_ON^^}" == "TRUE" ] && [ ! "${SAFE_TO_PROCEED^^}" == "FALSE" ]; then
    VS_FUNCTION_STARTTIME=$(date +%s)
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] packaging SSR application"
    if [ -d "$VS_FRONTEND_DIR" ]; then
      tar -zcf $VS_SSR_PACKAGE_TARGET/$VS_SSR_PACKAGE_NAME $VS_SSR_PACKAGE_SOURCE
      RETURN_CODE=$?; echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - return code: " $RETURN_CODE
      if [ -a $VS_SSR_PACKAGE_TARGET/$VS_SSR_PACKAGE_NAME ]; then
        VS_SSR_PACKAGE_SIZE=$(ls -alh $VS_SSR_PACKAGE_TARGET/$VS_SSR_PACKAGE_NAME | awk '{print $5}')
        echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] $VS_SSR_PACKAGE_NAME is $VS_SSR_PACKAGE_SIZE in size"
      fi
      if [ ! "$RETURN_CODE" = "0" ]; then
        SAFE_TO_PROCEED=FALSE
        FAIL_REASON="Failed to package SSR app from $VS_FRONTEND_DIR, command exited with $RETURN_CODE"
      fi
    fi
    VS_FUNCTION_ENDTIME=$(date +%s)
    VS_FUNCTION_RUNTIME=$((VS_FUNCTION_ENDTIME-VS_FUNCTION_STARTTIME))
    echo "$(eval $VS_LOG_DATESTAMP) DEBUG [$VS_SCRIPTNAME] ${FUNCNAME[0]} took $VS_FUNCTION_RUNTIME seconds to run"
    echo ""
  fi
}

# create Docker container
containerCreateAndStart() {
  if [ "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ -z "$CONTAINER_ID" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] VS_CONTAINER_PRESERVE was set to $VS_CONTAINER_PRESERVE, but no container was found, starting new contanier"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - setting VS_CONTAINER_PRESERVE to FALSE for this run only"; echo ""
    VS_CONTAINER_PRESERVE=FALSE
  fi
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ] && [ ! "$VS_CONTAINER_PRESERVE" == "TRUE" ]; then
    VS_CONTAINER_EXPOSE_PORT=$VS_CONTAINER_MAIN_APP_PORT
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to create a new Docker container with:"
    if [ "$VS_BRXM_PERSISTENCE_METHOD" == "mysql" ]; then
      VS_DOCKER_CMD='docker run -d --name '$VS_CONTAINER_NAME' -p '$VS_CONTAINER_BASE_PORT':'$VS_CONTAINER_EXPOSE_PORT' '$VS_CONTAINER_PORT_MAPPINGS' --env VS_CONTAINER_CONSOLE_FILE=$VS_CONTAINER_CONSOLE_FILE --env VS_HIPPO_REPOSITORY_DIR='$VS_BRXM_REPOSITORY' --env VS_HIPPO_REPOSITORY_PERSIST='$VS_HIPPO_REPOSITORY_PERSIST' --env VS_SSR_PROXY_ON='$VS_SSR_PROXY_ON' --env VS_SSR_PACKAGE_NAME='$VS_SSR_PACKAGE_NAME' --env=VS_SSR_PROXY_TARGET_HOST='$VS_SSR_PROXY_TARGET_HOST' --env VS_CONTAINER_NAME='$VS_CONTAINER_NAME' --env VS_CONTAINER_MAIN_APP_PORT='$VS_CONTAINER_MAIN_APP_PORT' --env VS_BRANCH_NAME='$VS_BRANCH_NAME' --env VS_COMMIT_AUTHOR='$VS_COMMIT_AUTHOR' --env CHANGE_ID='$CHANGE_ID' '$VS_DOCKER_IMAGE_NAME' /bin/bash -c "/usr/local/bin/vs-mysqld-start && while [ ! -f /home/hippo/tomcat_8080/logs/cms.log ]; do echo no log; sleep 2; done; tail -f /home/hippo/tomcat_8080/logs/cms.log"'
    elif [ "${VS_BUILD_TYPE^^}" == "DSSR" ]; then
      VS_DOCKER_CMD='docker run -t -d -u $VS_CONTAINER_USR:$VS_CONTAINER_GRP --name '$VS_CONTAINER_NAME' --hostname '$VS_CONTAINER_NAME_SHORT' -p '$VS_CONTAINER_BASE_PORT':'$VS_CONTAINER_EXPOSE_PORT' '$VS_CONTAINER_PORT_MAPPINGS' --workdir '$VS_CONTAINER_WD'  --volume $VS_CONTAINER_WORKSPACE:$VS_CONTAINER_WORKSPACE:$VS_CONTAINER_VOLUME_PERMISSIONS --volume $VS_CONTAINER_WORKSPACE@tmp:$VS_CONTAINER_WORKSPACE@tmp:$VS_CONTAINER_VOLUME_PERMISSIONS --env VS_CONTAINER_CONSOLE_FILE=$VS_CONTAINER_CONSOLE_FILE --env VS_HIPPO_REPOSITORY_DIR='$VS_BRXM_REPOSITORY' --env VS_HIPPO_REPOSITORY_PERSIST='$VS_HIPPO_REPOSITORY_PERSIST' --env VS_SSR_PROXY_ON='$VS_SSR_PROXY_ON' --env VS_SSR_PACKAGE_NAME='$VS_SSR_PACKAGE_NAME' --env=VS_SSR_PROXY_TARGET_HOST='$VS_SSR_PROXY_TARGET_HOST' --env VS_CONTAINER_NAME='$VS_CONTAINER_NAME' --env VS_CONTAINER_MAIN_APP_PORT='$VS_CONTAINER_MAIN_APP_PORT' --env VS_BRANCH_NAME='$VS_BRANCH_NAME' --env VS_COMMIT_AUTHOR='$VS_COMMIT_AUTHOR' --env CHANGE_ID='$CHANGE_ID' $VS_CONTAINER_ENVIRONMENT '$VS_DOCKER_IMAGE_NAME' '$VS_CONTAINER_INIT_EXEC''
    else
      VS_DOCKER_CMD='docker run -d --name '$VS_CONTAINER_NAME' -p '$VS_CONTAINER_BASE_PORT':'$VS_CONTAINER_EXPOSE_PORT' '$VS_CONTAINER_PORT_MAPPINGS' --env VS_CONTAINER_CONSOLE_FILE=$VS_CONTAINER_CONSOLE_FILE --env VS_HIPPO_REPOSITORY_DIR='$VS_BRXM_REPOSITORY' --env VS_HIPPO_REPOSITORY_PERSIST='$VS_HIPPO_REPOSITORY_PERSIST' --env VS_SSR_PROXY_ON='$VS_SSR_PROXY_ON' --env VS_SSR_PACKAGE_NAME='$VS_SSR_PACKAGE_NAME' --env=VS_SSR_PROXY_TARGET_HOST='$VS_SSR_PROXY_TARGET_HOST' --env VS_CONTAINER_NAME='$VS_CONTAINER_NAME' --env VS_CONTAINER_MAIN_APP_PORT='$VS_CONTAINER_MAIN_APP_PORT' --env VS_BRANCH_NAME='$VS_BRANCH_NAME' --env VS_COMMIT_AUTHOR='$VS_COMMIT_AUTHOR' --env CHANGE_ID='$CHANGE_ID' '$VS_DOCKER_IMAGE_NAME' /bin/bash -c "/usr/local/bin/vs-mysqld-start && while [ ! -f /home/hippo/tomcat_8080/logs/cms.log ]; do echo no log; sleep 2; done; tail -f /home/hippo/tomcat_8080/logs/cms.log"'
    fi
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $VS_DOCKER_CMD"
    eval $VS_DOCKER_CMD
    RETURN_CODE=$?; echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - return code: " $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to start container $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
  elif [ ! "$SAFE_TO_PROCEED" = "FALSE" ] && [ "$VS_CONTAINER_PRESERVE" == "TRUE" ]; then
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] re-using existing container $CONTAINER_ID"; echo ""
  elif [ "$SAFE_TO_PROCEED" = "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] container will not be started due to previous failures"
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] conditions to allow the start of a container could not be met, please contact Web Operations"
  fi
  echo ""
}

containerUpdates() {
  # check files for updated versions, if the checksum matches we've found a version of the file earlier than this script requires and want to update
  #  - this was originally seen as better than a pure versioning system as it allows a locally modified version to be used for testing without fear of overwrite
  #  - to-do: gp-20240513 replace the MD5 check with a versioning system, always overwrite the scripts with SCM versions, remove scripts from the image
  TEST_FILES=("/usr/local/bin/vs-hippo" "/usr/local/bin/vs-hippo" "/usr/local/bin/vs-hippo" "/usr/local/bin/vs-hippo" "" "/usr/local/bin/vs-test")
  TEST_SUMS=("5c92fa2dfbc167d0163c1dc1d8690bfa" "a15eed06d6840e95cc7d68c5223b79ae" "165ae4f494a092da25a68d70070d85fb" "69f81c5752890bcaaf237c7a92a39e5d" "" "")
  for i in ${!TEST_FILES[@]}; do
    THIS_FILE="${TEST_FILES[$i]}"
    THIS_SUM="${TEST_SUMS[$i]}"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] checking $THIS_FILE for update - md5sum must not match $THIS_SUM"
    THIS_TEST="$(docker exec $VS_CONTAINER_NAME md5sum $THIS_FILE 2>/dev/null | awk '{print $1}')"
    THIS_LOCAL_FILE="$(dirname $0)/$VS_CONTAINER_UPDATES_DIR/$(basename $THIS_FILE)"
    if [ "$THIS_TEST" == "$THIS_SUM" ] && [ -e "$THIS_LOCAL_FILE" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - sums match, an updated version of $THIS_FILE is available, copying to container"
      docker exec $VS_CONTAINER_NAME cp $THIS_FILE $THIS_FILE.old 2>>$VS_CONTAINER_CONSOLE_FILE
      docker cp "$THIS_LOCAL_FILE" $VS_CONTAINER_NAME:$THIS_FILE 2>>$VS_CONTAINER_CONSOLE_FILE
      THIS_TEST=$(docker exec $VS_CONTAINER_NAME md5sum $THIS_FILE 2>>$VS_CONTAINER_CONSOLE_FILE | awk '{print $1}')
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - sum now: $THIS_TEST"
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - no match for: $THIS_TEST"
    fi
  done
  docker exec --user root $VS_CONTAINER_NAME /bin/bash -c "find /usr/local/bin -type f | xargs chmod +x"
}

containerStartSSH() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to enable SSH in container $VS_CONTAINER_NAME:"
    VS_DOCKER_CMD='docker exec --user root -d $VS_CONTAINER_NAME /bin/bash -c "ssh-keygen -A; /usr/sbin/sshd; echo hippo:$VS_CONTAINER_SSH_PASS_HIPPO | chpasswd; echo root:$VS_CONTAINER_SSH_PASS_ROOT | chpasswd"'
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $VS_DOCKER_CMD"
    eval $VS_DOCKER_CMD
    RETURN_CODE=$?; echo $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=TRUE
      FAIL_REASON="Docker failed to run command in container $VS_CONTAINER_NAME, command exited with $RETURN_CODE. Script will continue."
    fi
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] container will not be started due to previous failures"
  fi
}

# copy build artefacts to container
containerCopyHippoArtifact() {
    if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to copy $VS_HIPPO_LATEST to container $VS_CONTAINER_NAME:/home/hippo"
    docker cp $VS_HIPPO_LATEST $VS_CONTAINER_NAME:/home/hippo
    RETURN_CODE=$?; echo $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to run cp command against $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
    else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] docker cp will not be run due to previous failures"
  fi
}

containerCopySSRArtifact() {
  if [ "${VS_SSR_PROXY_ON^^}" == "TRUE" ] && [ ! "${SAFE_TO_PROCEED^^}" == "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to copy $VS_SSR_PACKAGE_NAME to container $VS_CONTAINER_NAME:/home/hippo"
    docker cp $VS_SSR_PACKAGE_TARGET/$VS_SSR_PACKAGE_NAME $VS_CONTAINER_NAME:/home/hippo
    RETURN_CODE=$?; echo $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to run cp command against $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
  elif [ ! "${VS_SSR_PROXY_ON^^}" == "TRUE" ] && [ ! "${SAFE_TO_PROCEED^^}" == "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] docker cp of VS_SSR_PACKAGE_NAME:$VS_SSR_PACKAGE_NAME will not be run due VS_SSR_PROXY_ON:$VS_SSR_PROXY_ON"
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] docker cp will not be run due to previous failures"
  fi
}

containerStartHippo() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to execute "/usr/bin/pkill node" in container $VS_CONTAINER_NAME"
    docker exec -d $VS_CONTAINER_NAME /usr/bin/pkill node
    if [ "$VS_BRXM_PERSISTENCE_METHOD" == "mysql" ]; then
      VS_DOCKER_CMD='docker exec -d $VS_CONTAINER_NAME /bin/bash -c "/usr/local/bin/vs-hippo --persistence-method=mysql >> $VS_CONTAINER_CONSOLE_FILE"'
    else
      VS_DOCKER_CMD='docker exec -d $VS_CONTAINER_NAME /bin/bash -c "/usr/local/bin/vs-hippo --persistence-method=h2 >> $VS_CONTAINER_CONSOLE_FILE"'
    fi
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to execute VS_DOCKER_CMD in container $VS_CONTAINER_NAME"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $VS_DOCKER_CMD"
    eval $VS_DOCKER_CMD
    RETURN_CODE=$?; echo $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to run exec command in $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] docker exec will not be run due to previous failures"
  fi
}

containerStartDssr() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    false
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] docker exec will not be run due to previous failures"
  fi
}

containerStartTailon() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    echo ""
    VS_DOCKER_CMD='docker exec --user root -d $VS_CONTAINER_NAME /bin/bash -c "pkill tailon; /usr/local/bin/tailon --relative-root /tailon -b :$VS_CONTAINER_INT_PORT_TLN '"\""'alias=hippo,/home/hippo/tomcat_8080/logs/*'"\""' > /tmp/tailon.log"'
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] about to execute VS_DOCKER_CMD in container $VS_CONTAINER_NAME"
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - $VS_DOCKER_CMD"
    eval $VS_DOCKER_CMD
    RETURN_CODE=$?; echo $RETURN_CODE
    if [ ! "$RETURN_CODE" = "0" ]; then
      SAFE_TO_PROCEED=FALSE
      FAIL_REASON="Docker failed to run exec command in $VS_CONTAINER_NAME, command exited with $RETURN_CODE"
    fi
  else
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) ERROR [$VS_SCRIPTNAME] docker exec will not be run due to previous failures"
  fi
}

exportVSVariables() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] exporting VS variables to $VS_LAST_ENV and $VS_LAST_ENV$VS_LAST_ENV_QUOTED_SUFFIX and $VS_LAST_ENV$VS_LAST_ENV_GROOVY_SUFFIX in $VS_CI_DIR" | tee -a $VS_SCRIPT_LOG
  set | egrep "^(VS_)" | egrep -v "^VS_LOG_DATESTAMP" | tee $VS_CI_DIR/$VS_LAST_ENV | sed -e "s/^/env./" -e "s/=\([^'$]\)/=\"\1/" -e "s/\([^'=]\)$/\1\"/" | tee $VS_CI_DIR/$VS_LAST_ENV$VS_LAST_ENV_QUOTED_SUFFIX | sed -e "s/=/ = /" > $VS_CI_DIR/$VS_LAST_ENV$VS_LAST_ENV_GROOVY_SUFFIX
}

copyVSVariables() {
  echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME]  - writing VS variables from $VS_LAST_ENV and $VS_JENKINS_LAST_ENV to $VS_BUILD_PROPERTIES_TARGET_DIR/$VS_BUILD_PROPERTIES_TARGET_NAME"
  # to-do: gp - set VS_TARGET in defaultSettings
  if [ ! -d $VS_BUILD_PROPERTIES_TARGET_DIR ]; then
    echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME]  - $VS_BUILD_PROPERTIES_TARGET_DIR does not exist, creating"
    mkdir -p $VS_BUILD_PROPERTIES_TARGET_DIR
  fi
  echo "#$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] # properties from $BUILD_TAG" > $VS_BUILD_PROPERTIES_TARGET_DIR/$VS_BUILD_PROPERTIES_TARGET_NAME
  if [ -a $VS_JENKINS_LAST_ENV ]; then cat $VS_JENKINS_LAST_ENV >> $VS_BUILD_PROPERTIES_TARGET_DIR/$VS_BUILD_PROPERTIES_TARGET_NAME; fi
  if [ -a $VS_CI_DIR/$VS_LAST_ENV ]; then cat $VS_CI_DIR/$VS_LAST_ENV >> $VS_BUILD_PROPERTIES_TARGET_DIR/$VS_BUILD_PROPERTIES_TARGET_NAME; fi
}

createBuildReport() {
  if [ ! "$SAFE_TO_PROCEED" = "FALSE" ]; then
    EXIT_CODE=0
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] writing mail message to $VS_MAIL_NOTIFY_BUILD_MESSAGE"
    echo "" | tee $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "#### Feature Environment Details #########################################################################################################" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# The site instance for branch $VS_BRANCH_NAME should now be available in a few moments on $NODE_NAME - $VS_HOST_IP_ADDRESS" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# To configure your browser session for this branch please follow this link:"
    if [ "${VS_BUILD_TYPE^^}" == "BRXM" ]; then
		  echo "#   - $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/?vs_brxm_host=$VS_HOST_IP_ADDRESS&vs_brxm_port=$VS_CONTAINER_BASE_PORT&vs_brxm_http_host=$VS_BRXM_INSTANCE_HTTP_HOST&vs_ssr_http_port=$VS_CONTAINER_EXT_PORT_SSR&vs_tln_http_port=$VS_CONTAINER_EXT_PORT_TLN&vs_feature_branch=$BRANCH_NAME$VS_PROXY_QS_SSR" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "# Thereafter, until you clear the settings, you will be able to access the environment on the following URLs" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - site:    $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - cms:     $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/cms/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - console: $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/cms/console/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - logs:    $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/logs/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    elif [ "${VS_BUILD_TYPE^^}" == "DSSR" ]; then
		  echo "#   - $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/?vs-dssr-host=$VS_HOST_IP_ADDRESS&vs-dssr-http-port=$VS_CONTAINER_BASE_PORT&vs-brxm-host=$VS_BRXM_HOST&vs-brxm-port=$VS_BRXM_PORT&vs_brxm_http_host=$VS_BRXM_INSTANCE_HTTP_HOST&vs_tln_http_port=$VS_CONTAINER_EXT_PORT_TLN&vs_feature_branch=$BRANCH_NAME" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "# Thereafter, until you clear the settings, you will be able to access the environment on the following URLs" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - site:    $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#  - cms:     $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/cms/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#             this will redirect you to this branch's associated BRXM site/cms" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
	fi
	if [ ! -z "$VS_CONTAINER_EXT_PORT_TLN" ]; then
		echo "#  - tailon:  $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/tailon/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
	fi
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# To clear the proxy server settings between sessions either clear your cookies for $VS_PROXY_SERVER_FQDN or browse to:" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "#   - $VS_PROXY_SERVER_SCHEME://$VS_PROXY_SERVER_FQDN/?vs-reset" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
  	if [ "${VS_BUILD_TYPE^^}" == "BRXM" ]; then
		  echo "# Direct Tomcat access - available only on the Digital Development network" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#   - http://$VS_HOST_IP_ADDRESS:$VS_CONTAINER_BASE_PORT/cms/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#   - http://$VS_HOST_IP_ADDRESS:$VS_CONTAINER_BASE_PORT/site/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#     -  both need a HOST header of \"localhost:8080\" to be passed with the request" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    elif [ "${VS_BUILD_TYPE^^}" == "DSSR" ]; then
		  echo "# Direct Node app access - available only on the Digital Development network" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
		  echo "#   - http://$VS_HOST_IP_ADDRESS:$VS_CONTAINER_BASE_PORT/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
	fi
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    if [ ! -z "$VS_CONTAINER_EXT_PORT_SSR" ]&&[ "${VS_BUILD_TYPE^^}" == "BRXM" ]; then
      echo "# Direct SSR access - available only on the Web Development LAN" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
      echo "#   - http://$VS_HOST_IP_ADDRESS:$VS_CONTAINER_EXT_PORT_SSR/site/" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    fi
    if [ ! -z "$VS_BRXM_DSSR_SITES" ]; then
      echo "Resource API URLs for SPA-SDK/DSSR sites" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
      for SITE in $VS_BRXM_DSSR_SITES; do
        echo " - https://$SITE/resourceapi?vs_brxm_host=$VS_HOST_IP_ADDRESS&vs_brxm_port=$VS_CONTAINER_BASE_PORT&vs-no-redirect" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
      done
      echo "NOTE: the vs-no-redirect query string parameter allows the content to be served without redirecting to a bare URL"
      echo "      this is necessary to allow non-browser requests, such as those from the front-end to the resourceapi, to be served"
      echo "      to view a fully integrated SPA-SDK/DSSR site, please use the configuration URL provided by the CI job for that site/branch"
      echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    fi
    if [ ! -z "$VS_CONTAINER_EXT_PORT_SSH" ]; then
      echo "# SSH access (if enabled on the container) - available only on the Web Development LAN" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
      echo "#   - ssh -o UserKnownHostsFile=/dev/null -p $VS_CONTAINER_EXT_PORT_SSH hippo@$VS_HOST_IP_ADDRESS ($VS_CONTAINER_SSH_PASS_HIPPO)" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
      echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    fi
    if [ -e "$VS_MAIL_NOTIFY_BUILD_MESSAGE_EXTRA" ]; then
      cat $VS_MAIL_NOTIFY_BUILD_MESSAGE_EXTRA | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    fi
    echo "####/Feature Environment Details #########################################################################################################" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " >> $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " >> $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "$VS_CONTAINER_BASE_PORT" > env_port.txt
    echo "$VS_HOST_IP_ADDRESS" > env_host.txt
  else
    EXIT_CODE=127
    VS_MAIL_NOTIFY_BUILD_SUBJECT="environment build FAILED for $JOB_BASE_NAME in $VS_PARENT_JOB_NAME"
    echo "# " | tee $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "#######################################################################################################################################" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# JOB FAILED because $FAIL_REASON" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "# " | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "#######################################################################################################################################" | tee -a $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "" >> $VS_MAIL_NOTIFY_BUILD_MESSAGE
    echo "" >> $VS_MAIL_NOTIFY_BUILD_MESSAGE
  fi
}

testSite() {
  # to-do:? gp - we could add a loop here to curl the target site until there's an HTTP response or a timeout
  #            - that way we can ensure the "environment is ready" email doesn't get sent until it's known to be true
  false
}

sendBuildReport() {
  if [ -e "$VS_MAIL_NOTIFY_BUILD_MESSAGE" ] && [ "$VS_MAIL_NOTIFY_BUILD" == "TRUE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] sending environment build notification to $VS_MAIL_NOTIFY_BUILD_TO"
    mailx -s "$VS_MAIL_NOTIFY_BUILD_SUBJECT" -r "$VS_MAIL_NOTIFY_BUILD_SENDER" "$VS_MAIL_NOTIFY_BUILD_TO" < $VS_MAIL_NOTIFY_BUILD_MESSAGE
  fi
}

sendSiteReport() {
  if [ -e "$VS_MAIL_NOTIFY_SITE_MESSAGE" ] && [ "$VS_MAIL_NOTIFY_SITE" == "TRUE" ]; then
    echo ""
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] sending site check notification to $VS_MAIL_NOTIFY_SITE_TO"
    mailx -s "$VS_MAIL_NOTIFY_SITE_SUBJECT" -r "$VS_MAIL_NOTIFY_SITE_SENDER" "$VS_MAIL_NOTIFY_SITE_TO" < $VS_MAIL_NOTIFY_SITE_MESSAGE
  fi
}

# ====/FUNCTIONS ====

# ==== RUN ====
echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] $0 was called with $METHOD"
case $METHOD in
  default)
    false
  ;;
  displayreport)
    #checkVariables
    defaultSettings
    createBuildReport
    writeSettings
  ;;
  findartifact)
    checkVariables
    defaultSettings
    findHippoArtifact
    writeSettings
  ;;
  findports)
    checkVariables
    defaultSetting
    setPortRange
    findBasePort
    findDynamicPorts
    exportVSVariables
    copyVSVariables
    writeSettings
  ;;
  packagesstartifact)
    checkVariables
    defaultSettings
    packageSSRArtifact
    writeSettings
  ;;
  other)
    false
  ;;
  setvars)
    checkVariables
    defaultSettings
    exportVSVariables
    copyVSVariables
    writeSettings
  ;;
  showvars)
    reportSettings
    writeSettings
  ;;
  writevars)
    writeSettings
  ;;
  upload-to-brcloud)
    checkVariables
    defaultSettings
    findHippoArtifact
    uploadHippoArtifactBRC
    writeSettings
  ;;
  dssr-server)
    echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] entering dssr-server function"
    VS_BUILD_TYPE=DSSR
    checkVariables
    defaultSettings
    if [ "${VS_DEBUG^^}" == "TRUE" ]; then reportSettings; fi
    writeSettings
    checkContainers
    manageContainers
    getBranchListFromWorkspace
    getReservedPortList
    tidyContainers
    setPortRange
    findBasePort
    findDynamicPorts
    containerCreateAndStart
    containerUpdates
    containerStartDssr
    containerStartSSH
    containerStartTailon
    exportVSVariables
    testSite
    createBuildReport
    sendBuildReport  
  ;;
  *)
    if [ ! -z "$METHOD" ]; then
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] called with method $METHOD but no such method found - running defaults"
    else
      echo "$(eval $VS_LOG_DATESTAMP) WARN  [$VS_SCRIPTNAME] no function specified - running defaults"
    fi
    METHOD=none
    checkVariables
    defaultSettings
    reportSettings
    checkContainers
    manageContainers
    #stopContainers
    #startContainers
    #deleteContainers
    #deleteImages
    #getChildBranchesViaCurl
    #getBranchListViaCurl
    #getPullRequestListViaCurl
    getBranchListFromWorkspace
    getReservedPortList
    tidyContainers
    setPortRange
    findBasePort
    findDynamicPorts
    findHippoArtifact
    rebuildNodeModules
    packageSSRArtifact
    if [ ! "$VS_CONTAINER_PRESERVE" == "TRUE" ]; then
      containerCreateAndStart
    elif [ "$VS_CONTAINER_PRESERVE" == "TRUE" ] && [ -z "$CONTAINER_ID" ]; then
      containerCreateAndStart
    else
      echo "$(eval $VS_LOG_DATESTAMP) INFO  [$VS_SCRIPTNAME] re-using existing container $CONTAINER_ID"; echo "" 
    fi
    containerUpdates
    containerStartSSH
    containerCopyHippoArtifact
    containerCopySSRArtifact
    containerStartHippo
    containerStartTailon
    exportVSVariables
    testSite
    createBuildReport
    sendBuildReport
    writeSettings
  ;;
esac
# ====/RUN ====
exit $EXIT_CODE