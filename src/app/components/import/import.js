"use strict";

angular.module("tf.components.import", ["ngRoute"])
    .config([
        "$routeProvider", function($routeProvider) {
            $routeProvider.when("/", {
                templateUrl: "components/import/import.html",
                controller: "importCtrl",
                controllerAs: "vm"
            });
        }
    ])
    .controller("importCtrl", [
        "$q", "$linq", "github", "jira", "tripletex",
        function($q, $linq, github, jira, tripletex) {

            var vm = this;

            vm.selectedDate = moment().toDate();

            vm.processedEvents = [];

            vm.importAll = importAll;

            initialize();

            function initialize() {
                importAll();
            }

            function importAll() {
                vm.processedEvents = [];
                var sources = [
                    jira.getActivity(vm.selectedDate),
                    github.getActivity(vm.selectedDate)
                ];

                $q.all(sources).then(function(results) {

                    var allEvents = $linq.Enumerable().From(results)
                        .SelectMany(function(x) { return x; })
                        .ToArray();

                    vm.processedEvents = allEvents;
                });
            }

            function processEvents(events) {

                return $linq.Enumerable().From(events)
                    .GroupBy(
                        function(x) { return new Date(x.date).setHours(0, 0, 0); },
                        null,
                        function(key, g) {
                            return {
                                key: key,
                                events: g.ToArray()
                            };
                        })
                    .ToArray();
            }
        }
    ]);