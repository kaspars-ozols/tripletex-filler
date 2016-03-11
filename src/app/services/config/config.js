angular.module("tf.services.config", [])
    .factory("config", [
        "$q", function ($q) {

            var jiraConfigKey = "tripletex-autofill-jira-config";
            var gitHubConfigKey = "tripletex-autofill-github-config";

            return {
                loadJiraConfig: loadJiraConfig,
                saveJiraConfig: saveJiraConfig,
                loadGitHubConfig: loadGitHubConfig,
                saveGitHubConfig: saveGitHubConfig
            };


            function loadJiraConfig() {
                return loadConfig(jiraConfigKey);
            }

            function saveJiraConfig(jiraConfig) {
                return saveConfig(jiraConfigKey, jiraConfig);
            }

            function loadGitHubConfig() {
                return loadConfig(gitHubConfigKey);
            }

            function saveGitHubConfig(githubConfig) {
                return saveConfig(gitHubConfigKey, githubConfig);
            }



            function loadConfig(configName) {
                var deferred = $q.defer();
                chrome.storage.sync.get(configName, function (data) {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                        deferred.reject();
                    }

                    deferred.resolve(data[configName]);
                });
                return deferred.promise;
            }

            function saveConfig(configName, config) {

                var configToSave = {};
                configToSave[configName] = config;

                chrome.storage.sync.set(configToSave, function () {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });
            }
        }
    ]);