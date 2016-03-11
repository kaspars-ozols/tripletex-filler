'use strict';

angular.module('tf.components.import', ['ngRoute'])
    .config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'app/components/import/import.html',
                controller: 'importCtrl',
                controllerAs: 'vm'
            });
        }
    ])
    .controller('importCtrl', ['$window', '$q', 'github', 'jira', 'tripletex',
        function ($window, $q, github, jira, tripletex) {

            var vm = this;

            vm.startDate = Date.now() + -3 * 24 * 3600 * 1000; //5 days ago in milliseconds
            vm.endDate = Date.now();
            vm.processedEvents = [];

            vm.importAll = importAll;

            initialize();

            function initialize() {
                importAll();
            }

            function importAll() {

                tripletex.getCurrentPeriod().then(function(result) {
                        vm.startDate = result.startDate;
                        vm.endDate = result.endDate;

                        var sources = [
                            jira.getEvents(vm.startDate, vm.endDate) //,
                            //github.getEvents(vm.startDate, vm.endDate)
                        ];

                        $q.all(sources).then(function(results) {

                            var allEvents = Enumerable.From(results)
                                .SelectMany(function(x) { return x; })
                                .ToArray();

                            vm.processedEvents = processEvents(allEvents);
                        });
                    }
                );
            }

            function processEvents(events) {

                return Enumerable.From(events)
                    .GroupBy(
                        function (x) { return new Date(x.date).setHours(0, 0, 0); },
                        null,
                        function (key, g) {
                            return {
                                key: key,
                                events: g.ToArray()
                            };
                        })


                    .ToArray();
            }
        }
    ]);