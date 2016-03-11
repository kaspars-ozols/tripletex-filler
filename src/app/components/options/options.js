"use strict";

angular.module("tf.components.options", ["ngRoute"])
    .config([
        "$routeProvider", function($routeProvider) {
            $routeProvider.when("/options", {
                templateUrl: "app/components/options/options.html",
                controller: "optionsCtrl",
                controllerAs: "vm"
            });
        }
    ])
    .controller("configureCtrl", [
        "config",
        function (config) {

            var vm = this;
            vm.jiraConfig = {};
            vm.gitHubConfig = {};

            vm.saveGitHubConfig = saveGitHubConfig;
            vm.saveJiraConfig = saveJiraConfig;

            initialize();

            function initialize() {
                config.loadJiraConfig()
                    .then(function(result) {
                        vm.jiraConfig = result;
                    });

                config.loadGitHubConfig()
                   .then(function (result) {
                       vm.gitHubConfig = result;
                   });
            }

            function saveGitHubConfig() {
                config.saveGitHubConfig(vm.gitHubConfig);
            }

            function saveJiraConfig() {
                config.saveJiraConfig(vm.jiraConfig);
            }
        }
    ]);