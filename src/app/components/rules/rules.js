"use strict";

angular.module("tf.components.rules", ["ngRoute"])
    .config([
        "$routeProvider", function ($routeProvider) {
            $routeProvider.when("/rules", {
                templateUrl: "app/components/rules/rules.html",
                controller: "rulesCtrl",
                controllerAs: "vm"
            });
        }
    ])
    .controller("rulesCtrl", [
        "config",
        function (config) {

            var vm = this;


            initialize();

            function initialize() {
                config.loadJiraConfig()
                    .then(function (result) {
                        vm.jiraConfig = result;
                    });
            }
        }
    ]);