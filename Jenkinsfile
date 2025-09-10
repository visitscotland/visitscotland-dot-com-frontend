def MAIL_TO = "webops@visitscotland.net"
def thisAgent
thisAgent = "docker-02"

// set any environment-specific environment variables here using the format: env.MY_VAR = "conditional_value" }
// please see ci/README_PIPELINE_VARIABLES.md or consult Web Operations for details on environment variables and their purposes
echo "== Setting conditional environment variables"
if (BRANCH_NAME == "main" && (JOB_NAME ==~ "([^/]*/)?feature.visitscotland.(com|org)(-frontend)?(-mb)?/main")) {
    echo "=== Setting conditional environment variables for branch $BRANCH_NAME in job $JOB_NAME"
    env.VS_CONTAINER_BASE_PORT_OVERRIDE = "3060"
    env.VS_TIDY_CONTAINERS = "TRUE"
} else if (BRANCH_NAME == "main" && (JOB_NAME ==~ "([^/]*/)?develop.visitscotland.(com|org)(-frontend)?(-mb)?/main")) {
    echo "=== Setting conditional environment variables for branch $BRANCH_NAME in job $JOB_NAME"
    env.VS_CONTAINER_BASE_PORT_OVERRIDE = "3064"
} else if (BRANCH_NAME == "main" && (JOB_NAME ==~ "([^/]*/)?develop-brc.visitscotland.(com|org)(-frontend)?(-mb)?/main")) {
    echo "=== Setting conditional environment variables for branch $BRANCH_NAME in job $JOB_NAME"
    env.VS_CONTAINER_BASE_PORT_OVERRIDE = "3061"
} else if (BRANCH_NAME == "main" && (JOB_NAME ==~ "([^/]*/)?release-brc.visitscotland.(com|org)(-frontend)?(-mb)?/main")) {
    echo "=== Setting conditional environment variables for branch $BRANCH_NAME in job $JOB_NAME"
    env.VS_CONTAINER_BASE_PORT_OVERRIDE = "3002"
} else if (BRANCH_NAME ==~ "ops/(feature-environment(s)?-enhancements|pipeline-updates)" && (JOB_NAME ==~ "([^/]*/)?feature(-(businessevents|support))?.visitscotland.(com|org)(-mb)?(-frontend)?/ops%(25)?2F(feature-environment(s)?-enhancements|pipeline-updates)")) {
    echo "=== Setting conditional environment variables for branch $BRANCH_NAME in job $JOB_NAME"
    env.VS_CONTAINER_BASE_PORT_OVERRIDE = "3069"
    env.VS_CONTAINER_PRESERVE = "FALSE"
} else {
    echo "=== No conditional environment variables found for branch $BRANCH_NAME in job $JOB_NAME, using defaults"
}
echo "==/Setting conditional environment variables"

// set or override any default environment variables here using the format: if (!env.MY_VAR) { env.MY_VAR = "default_value" }
// please see ci/README_PIPELINE_VARIABLES.md or consult Web Operations for details on environment variables and their purposes
// NOTE: these values will only be set if currently null, they may have been set by the "conditional environment variables" section above
echo "== Setting default pipeline environment variables"
if (!env.VS_CI_DIR) { env.VS_CI_DIR = "ci" }
if (!env.VS_BRANCH_PROPERTIES_DIR) { env.VS_BRANCH_PROPERTIES_DIR = env.VS_CI_DIR + "/properties" }
if (!env.VS_BRC_STACK_URI) { env.VS_BRC_STACK_URI = "visitscotland" }
if (!env.VS_BRC_ENV) { env.VS_BRC_ENV = "demo" }
if (!env.VS_BRC_STACK_URL) { env.VS_BRC_STACK_URL = "https://api.${VS_BRC_STACK_URI}.bloomreach.cloud" }
if (!env.VS_BRC_STACK_API_VERSION) { env.VS_BRC_STACK_API_VERSION = "v3" }
if (!env.VS_DSSR_PROXY_ON) { env.VS_DSSR_PROXY_ON = "TRUE" }
if (!env.VS_BUILD_FEATURE_ENVIRONMENT) { env.VS_BUILD_FEATURE_ENVIRONMENT = "false" }
if (!env.VS_DOCKER_IMAGE_NAME) { env.VS_DOCKER_IMAGE_NAME = "vs/vs-brxm15:node18" }
if (!env.VS_DOCKER_BUILDER_IMAGE_NAME) { env.VS_DOCKER_BUILDER_IMAGE_NAME = "vs/vs-brxm15-builder:node18" }
if (!env.VS_SSR_PROXY_ON) { env.VS_SSR_PROXY_ON = "FALSE" }
if (!env.VS_RELEASE_SNAPSHOT) { env.VS_RELEASE_SNAPSHOT = "FALSE" }
if (!env.VS_PROXY_SERVER_FQDN) { env.VS_PROXY_SERVER_FQDN = "feature.visitscotland.com" }
if (!env.HOSTNAME) { env.HOSTNAME = env.NODE_NAME }
if (!env.VS_BRANCH_PROPERTIES_FILE && !env.CHANGE_BRANCH) {
	env.VS_BRANCH_PROPERTIES_FILE = env.BRANCH_NAME.substring(env.BRANCH_NAME.lastIndexOf('/') + 1) + ".properties" 
} else if (!env.VS_BRANCH_PROPERTIES_FILE && env.CHANGE_BRANCH) {
	env.VS_BRANCH_PROPERTIES_FILE = env.CHANGE_BRANCH.substring(env.CHANGE_BRANCH.lastIndexOf('/') + 1) + ".properties" 
}
echo "==/Setting default pipeline environment variables"

echo "== Setting default application variables"
if (!env.BR_CMS_ORIGIN_LOCATION ) { env.BR_CMS_ORIGIN_LOCATION = "https://feature.visitscotland.com" }
if (!env.BR_RESOURCE_API_ENDPOINT ) { env.BR_RESOURCE_API_ENDPOINT = "https://feature.visitscotland.com/resourceapi?vs_brxm_port=8087&vs_no_redirect" }
if (!env.BR_X_FORWARDED_HOST ) { env.BR_X_FORWARDED_HOST = "feature.visitscotland.com" }
echo "==/Setting default application variables"

echo "== Setting default container variables"
if (!env.VS_CONTAINER_BASE_PORT_MIN ) { env.VS_CONTAINER_BASE_PORT_MIN = 3070 }
if (!env.VS_CONTAINER_BASE_PORT_MAX ) { env.VS_CONTAINER_BASE_PORT_MAX = 3099 }
if (!env.VS_CONTAINER_EXEC ) { env.VS_CONTAINER_EXEC = "/bin/bash -c \"node .output/server/index.mjs\"" }
if (!env.VS_CONTAINER_PRESERVE) { env.VS_CONTAINER_PRESERVE = "FALSE" }
if (!env.VS_CONTAINER_MAIN_APP_PORT) { env.VS_CONTAINER_MAIN_APP_PORT = 3000 }
echo "==/Setting default container variables"

pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
    }

    agent {label thisAgent}

    environment {
		//GITHUB_PAT_JENKINS_CI = credentials('github-pat-jenkins-ci')
		GITHUB_PAT_JENKINS_CI = "not-in-use"
    }

    stages {
	    stage ('Pre-build') {
	        steps {
                    echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
	            // make all branch-specific variables available to pipeline, load file must be in env.VARIABLE="VALUE" format
	            script {
                        echo "looking for branch specific properties file at $WORKSPACE/$VS_BRANCH_PROPERTIES_DIR/$VS_BRANCH_PROPERTIES_FILE"
                        echo " - if the pipeline fails at this point please check the format of your properties file!"
	                if (fileExists("$WORKSPACE/$VS_BRANCH_PROPERTIES_DIR/$VS_BRANCH_PROPERTIES_FILE")) {
	                    echo "loading environment variables from $WORKSPACE/$VS_BRANCH_PROPERTIES_DIR/$VS_BRANCH_PROPERTIES_FILE"
    	                load "$WORKSPACE/$VS_BRANCH_PROPERTIES_DIR/$VS_BRANCH_PROPERTIES_FILE"
	                } else {
	                    echo "branch specific properties won't be loaded, file $WORKSPACE/$VS_BRANCH_PROPERTIES_DIR/$VS_BRANCH_PROPERTIES_FILE does not exist"
	                }
	            }
		    // the two script blocks below are necessary to allow infrastructure.sh to set variables and then import them back to the pipeline
                    //  - if we determine that none of these variables are actually used until the Deploy stage, then this is not necessary
                    //  - the printenv commands in every stage are useful for debugging but may not be required long-term
                    // run infrastructure.sh to set default variables and then import them into the pipeline
		    script {
	                if (fileExists("$WORKSPACE/ci/infrastructure/scripts/infrastructure.sh")) {
                        echo "calling \"/infrastructure.sh setvars\" to set default pipeline variables"
	                    sh '$VS_CI_DIR/infrastructure/scripts/infrastructure.sh setvars --quiet'
	                } else {
	                    echo; echo "infrastructure.sh was not found - default environment variables will not be set"
	                }
		        }
		    script {
	                if (fileExists("$WORKSPACE/ci/vs-last-env.quoted")) {
	                    echo "loading environment variables from $WORKSPACE/ci/vs-last-env.quoted"
	                    load "$WORKSPACE/ci/vs-last-env.quoted"
	                    echo "found commit author: ${env.VS_COMMIT_AUTHOR}"
                        sh '$VS_CI_DIR/infrastructure/scripts/infrastructure.sh writevars --quiet'
	                } else {
	                    echo; echo "$WORKSPACE/ci/vs-last-env.quoted - default environment variables will not be loaded"
	                }
		    }
                }
	    } // end stage

        stage ('SCM checkout') {
            agent {
                docker {
		    image '$VS_DOCKER_BUILDER_IMAGE_NAME'
                    label thisAgent
                    reuseNode true
                }
            }
            steps {
                echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
                sh '$VS_CI_DIR/infrastructure/scripts/infrastructure.sh writevars --quiet'
                sh '''
                    set +x
                    export HOME=$WORKSPACE
                    export npm_config_cache=$HOME
                    echo; echo "==== TOOLS CHECK ====="
                '''
                sh 'set +x; node --version; exit 0'
                sh 'set +x; npm --version; exit 0'
                sh 'set +x; yarn --version; exit 0'
                sh 'set +x; echo "====/TOOLS CHECK ====="; echo'
                checkout scm
            }
        } //end stage

        stage ('Install Dependencies') {
            agent {
                docker {
		    image 'vs/vs-brxm15-builder:node18'
		    label thisAgent
		    reuseNode true
                }
            }
            steps {
                echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
                sh '''
                    set +x
                    export HOME=$WORKSPACE
                    export npm_config_cache=$HOME/.npm
                    if [ ! -d $npm_config_cache ]; then mkdir -p $npm_config_cache; fi
                    yarn
                '''
            }
        } //end stage

        stage ('Run Tests') {
            agent {
                docker {
                    image '$VS_DOCKER_BUILDER_IMAGE_NAME'
                    label thisAgent
                    reuseNode true
                }
            }
            steps {
                echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh '''
                        set +x
                        export HOME=$WORKSPACE
                        export npm_config_cache=$HOME/.npm
                        if [ ! -d $npm_config_cache ]; then mkdir -p $npm_config_cache; fi
                        yarn test
                    '''
                }
            }
        } //end stage

        stage ('NPM Build') {
            agent {
                docker {
                    image '$VS_DOCKER_BUILDER_IMAGE_NAME'
                    label thisAgent
                    reuseNode true
                }
            }
            steps {
                echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
                sh '''
                    set +x
                    export HOME=$WORKSPACE
                    export npm_config_cache=$HOME/.npm
                    if [ ! -d $npm_config_cache ]; then mkdir -p $npm_config_cache; fi
                    yarn build
                '''
            }
        } //end stage

        stage ('Deploy') {
	    when {
		anyOf {
		    branch 'main'
		    branch 'release/*'
		    changeRequest()
		    environment name: 'VS_BUILD_FEATURE_ENVIRONMENT', value: 'true'
		    expression {return env.VS_BUILD_FEATURE_ENVIRONMENT ==~ /(TRUE|true)/}
		}
	    }
            steps {
                echo "running stage $STAGE_NAME in $HOSTNAME on $NODE_NAME"
                // the two script blocks below are necessary to allow infrastructure.sh to set variables and then import them back to the pipeline
                //  - in a future iteration, where the container is started by the shell script, these will no longer be required
                script {
                    if (fileExists("$WORKSPACE/ci/infrastructure/scripts/infrastructure.sh")) {
	                    sh '$VS_CI_DIR/infrastructure/scripts/infrastructure.sh dssr-server --debug --map-workspace=true'
	                } else {
	                    echo; echo "infrastructure.sh was not found - no container will be created"
	                }
                }
                script {
	                if (fileExists("$WORKSPACE/ci/vs-last-env.quoted")) {
	                    echo "loading environment variables from $WORKSPACE/ci/vs-last-env.quoted"
	                    load "$WORKSPACE/ci/vs-last-env.quoted"
	                    echo "found ${env.VS_COMMIT_AUTHOR}"
	                } else {
	                    echo; echo "$WORKSPACE/ci/vs-last-env.quoted - updated environment variables will not be loaded"
	                }
		        }
                sh '''
                    set +x
                    echo $VS_CONTAINER_EXEC
                    VS_CONTAINER_ID=$(docker ps -aq --filter "name=^$VS_CONTAINER_NAME$")
                    docker exec -d -t $VS_CONTAINER_ID /bin/bash -c "NODE_DEBUG=cluster,net,http,fs,tls,module,timers node .output/server/index.mjs 2>&1 | tee -a ./nodeapp.log"
                '''
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: false,
                    reportDir: '',
                    reportFiles: "${env.VS_MAIL_NOTIFY_BUILD_MESSAGE}",
                    reportName: 'Environment Details',
                    reportTitles: ''
                ]
            }
        } //end stage
    } //end stages
}