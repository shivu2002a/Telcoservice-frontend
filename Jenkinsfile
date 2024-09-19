pipeline {
    agent any

    environment {
        NODE_HOME = 'C:\\Program Files\\nodejs'  // Specify Node.js version
	PATH = "${NODE_HOME};${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull from GitHub
                git branch: 'main', url: 'https://github.com/shivu2002a/Telcoservice-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                bat '''
                npm install
                '''
            }
        }

        stage('Build') {
            steps {
                // Build the React app
                bat '''
                npm run build
                '''
            }
        }

        stage('Test') {
            steps {
                // Run tests
                bat '''
                npm test -- --watchAll=false
                '''
            }
        }

        stage('Run') {
            steps {
                // Serve the app locally (useful for local testing)
                bat '''
                npm start
                '''
            }
        }
    }

    post {
        success {
            // Notify success
            echo 'Build and test successful!'
        }

        failure {
            // Notify failure
            echo 'Build or test failed.'
        }
    }
}
