#!groovy​

def app

pipeline {
    agent {
        label 'devel11'
    }
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = "bibliotekdk-next-frontend-${env.BRANCH_NAME.toLowerCase()}:${BUILD_NUMBER}"
        DOCKER_COMPOSE_NAME = "compose-${IMAGE_NAME}-${BRANCH_NAME.toLowerCase()}"
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
        GITLAB_ID = "704"
        CLIENT_ID = credentials("bibdk_client_id")
        CLIENT_SECRET = credentials("bibdk_client_secret")
        CLIENT_ID_PROD = credentials("bibdk_prod_client_id")
        CLIENT_SECRET_PROD = credentials("bibdk_prod_client_secret")
    }
    options {
        disableConcurrentBuilds()
	}
    stages {
        stage('clean workspace') {
            steps {
                cleanWs()
                checkout scm
            }
        }
        stage('Build image') {
            steps {
                script {
                    currentBuild.description = "Build ${IMAGE_NAME}"
                    ansiColor("xterm") {
                        // Work around bug https://issues.jenkins-ci.org/browse/JENKINS-44609 , https://issues.jenkins-ci.org/browse/JENKINS-44789
                        sh "docker build -t ${IMAGE_NAME} --pull ."
                        app = docker.image(IMAGE_NAME)
                    }
                }
            }
        }
        stage('Integration test') {
            steps {
                script {
                    // @TODO cypress:latest from docker-dbc.artifacts.dbccloud.dk
                    ansiColor("xterm") {
                        sh "docker pull docker-dbc.artifacts.dbccloud.dk/cypress:latest"
                        sh "docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} build"
                        
                        // def envVars = "IMAGE=${IMAGE_NAME}"

                        // // on prod we want to run tests against the prod api
                        // if (env.BRANCH_NAME == 'prod') {
                        //     envVars += " NEXT_PUBLIC_FBI_API_BIBDK21_URL=https://fbi-api.dbc.dk/bibdk21/graphql"
                        //     envVars += " NEXT_PUBLIC_FBI_API_URL=https://fbi-api.dbc.dk/bibdk21/graphql"
                        // }

                            sh  '''NEXT_PUBLIC_FBI_API_BIBDK21_URL=${env.BRANCH_NAME == 'allow-map-files' ? 'https://fbi-api.dbc.dk/bibdk21/graphql' : 'https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql'} \
                                NEXT_PUBLIC_FBI_API_URL=${env.BRANCH_NAME == 'allow-map-files' ? 'https://fbi-api.dbc.dk/bibdk21/graphql' : 'https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql'} \
                                CLIENT_ID=${env.BRANCH_NAME == 'allow-map-files' ? CLIENT_ID_PROD : CLIENT_ID} \
                                CLIENT_SECRET=${env.BRANCH_NAME == 'allow-map-files' ? CLIENT_SECRET_PROD : CLIENT_SECRET} \
                                IMAGE=${IMAGE_NAME} docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} run --rm e2e'''

                    //todo add client and secret ids

                      //  sh "${envVars} docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} run --rm e2e"
                      //  sh "IMAGE=${IMAGE_NAME} docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} run --rm e2e"
                    }
                }
            }
        }
        stage('Push to Artifactory') {
            when {
                anyOf {
                    branch 'main';
                    branch 'alfa-0'
                    branch 'prod'
                    expression{env.BRANCH_NAME.startsWith('feature')}
                }
            }
            steps {
                script {
                    if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                        docker.withRegistry('https://docker-frontend.artifacts.dbccloud.dk', 'docker') {
                            app.push()
                            app.push("latest")
                        }
                    }
                }
            }
        }

        stage("Update staging version number") {
            agent {
                docker {
                    label 'devel11'
                    image "docker-dbc.artifacts.dbccloud.dk/build-env:latest"
                    alwaysPull true
                }
            }
            when {
                anyOf {
                    branch 'main';
                    branch 'alfa-0'
                    branch 'prod'
                }
            }
            steps {
                dir("deploy") {
                    script {
                        if (env.BRANCH_NAME == 'main') {
                            sh '''
                                #!/usr/bin/env bash                        
                                set-new-version configuration.yaml ${GITLAB_PRIVATE_TOKEN} ${GITLAB_ID} ${BUILD_NUMBER} -b staging
                            '''
                        } else if (env.BRANCH_NAME == 'alfa-0') {
                            sh '''
                                #!/usr/bin/env bash                        
                                set-new-version configuration.yaml ${GITLAB_PRIVATE_TOKEN} ${GITLAB_ID} ${BUILD_NUMBER} -b alfa-0
                            '''
                        }
                        else if (env.BRANCH_NAME == 'prod') {
                            sh '''
                                #!/usr/bin/env bash
                                set-new-version configuration.yaml ${GITLAB_PRIVATE_TOKEN} ${GITLAB_ID} ${BUILD_NUMBER} -b integration
                            '''
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            sh '''
                echo Clean up
                mkdir -p logs
                docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} logs web > logs/web-log.txt
                docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} down -v
                docker rmi ${IMAGE_NAME}
            '''

            junit skipPublishingChecks: true, testResults: 'app/e2e/reports/*.xml'
            archiveArtifacts 'cypress/screenshots/*, cypress/videos/*, logs/*'
        }
        failure {
            script {
                if ("${BRANCH_NAME}" == 'main') {
                    slackSend(channel: 'fe-drift',
                            color: 'warning',
                            message: "${JOB_NAME} #${BUILD_NUMBER} failed and needs attention: ${BUILD_URL}",
                            tokenCredentialId: 'slack-global-integration-token')
                }
            }
        }
        success {
            script {
                if ("${BRANCH_NAME}" == 'main') {
                    slackSend(channel: 'fe-drift',
                            color: 'good',
                            message: "${JOB_NAME} #${BUILD_NUMBER} completed, and pushed ${IMAGE_NAME} to artifactory.",
                            tokenCredentialId: 'slack-global-integration-token')

                }
            }
        }
        fixed {
            slackSend(channel: 'fe-drift',
                    color: 'good',
                    message: "${JOB_NAME} #${BUILD_NUMBER} back to normal: ${BUILD_URL}",
                    tokenCredentialId: 'slack-global-integration-token')

        }
    }
}
