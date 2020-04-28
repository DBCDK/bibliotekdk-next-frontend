#!groovy​

def app

pipeline {
    agent {
        label 'devel9-head'
    }
    environment {
        IMAGE_NAME = "bibliotekdk-next-widgets${env.BRANCH_NAME != 'master' ? "-${env.BRANCH_NAME.toLowerCase()}" : ''}:${BUILD_NUMBER}"
        DOCKER_COMPOSE_NAME = "compose-${IMAGE_NAME}-${BRANCH_NAME.toLowerCase()}"
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
        // GITLAB_ID = "623"
	}
    stages {
       
        stage('Build image') {
            steps { 
                script {
                    ansiColor("xterm") {
                        // Work around bug https://issues.jenkins-ci.org/browse/JENKINS-44609 , https://issues.jenkins-ci.org/browse/JENKINS-44789
                        sh "docker build -t ${IMAGE_NAME} --pull ."
                        app = docker.image(IMAGE_NAME)
                    }
                } 
            }
        }
        
        // stage('Static and unittest') {
        //     steps { 
        //         script {
        //             ansiColor("xterm") {
        //                 sh "docker run --rm ${IMAGE_NAME} npm run test" 
        //                 sh "docker run --rm ${IMAGE_NAME} npm run lint" 
        //             }
        //         }
        //     }
        // }
        // stage('Integration test') {
        //     steps { 
        //         script {
        //             ansiColor("xterm") {
        //                 sh "docker pull docker.dbc.dk/cypress:latest" 
        //                 sh "docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} build"                        
        //                 sh "IMAGE=${IMAGE_NAME} LOWEL_CONNECTION_STRING=${LOWEL_CONNECTION_STRING} docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} run --rm e2e" 
        //             }
        //         }
        //     }
        // }
        stage('Push to Artifactory') {
            when {
                branch "master"
            }
            steps { 
                script {
                if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                    docker.withRegistry('https://docker-ux.dbc.dk', 'docker') {
                        app.push()
                        app.push("latest")
                    }
                }
            } }
        }
        // stage("Update staging version number") {
		// 	agent {
		// 		docker {
		// 			label 'devel9-head'
		// 			image "docker-io.dbc.dk/python3-build-image"
		// 			alwaysPull true
		// 		}
		// 	}
		// 	when {
		// 		branch "master"
		// 	}
		// 	steps {
		// 		dir("deploy") {
		// 			git(url: "gitlab@gitlab.dbc.dk:frontend/content-first-widget-deploy.git", credentialsId: "gitlab-svi", branch: "staging")
		// 			sh """#!/usr/bin/env bash
		// 				set -xe
		// 				rm -rf auto-committer-env
		// 				python3 -m venv auto-committer-env
		// 				source auto-committer-env/bin/activate
		// 				pip install -U pip
		// 				pip install git+https://github.com/DBCDK/kube-deployment-auto-committer#egg=deployversioner
		// 				set-new-version configuration.yaml ${GITLAB_PRIVATE_TOKEN} ${GITLAB_ID} ${BUILD_NUMBER} -b staging
		// 			"""
		// 		}
		// 	}
		// }
    }
    post {
        always {
            sh """
                echo Clean up
                #mkdir -p logs
                #docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} logs web > logs/web-log.txt
                #docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} down -v
                docker rmi ${IMAGE_NAME}
            """
            // archiveArtifacts 'e2e/cypress/screenshots/*, e2e/cypress/videos/*, logs/*'
        }
        failure {
            script {
                if ("${BRANCH_NAME}" == 'master') {
                    slackSend(channel: 'fe-drift',
                        color: 'warning',
                        message: "${JOB_NAME} #${BUILD_NUMBER} failed and needs attention: ${BUILD_URL}",
                        tokenCredentialId: 'slack-global-integration-token')
                }
            }
        }
        success {
            script {
                if ("${BRANCH_NAME}" == 'master') {
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
