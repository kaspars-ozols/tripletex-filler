﻿angular.module("tf.services.github", [])
    .factory("github", [
        "$http", "$q", "$linq", "$moment", "config", function ($http, $q, $linq, $moment, config) {

            return {
                getRepos: getRepos,
                getActivity: getActivity
            };

            function getRepos() {

                return config.loadGitHubConfig()
                    .then(function (config) {

                        var url = "https://api.github.com/orgs/" + config.organization + "/repos?per_page=100";
                        return callApi(url, config);

                    });
            }

            function getActivity(date) {
                return config.loadGitHubConfig()
                    .then(function (config) {

                        var url = "https://api.github.com/users/" + config.username + "/events?per_page=300";
                        return callApi(url, config)
                            .then(function (response) {
                                return $linq.Enumerable().From(response)
                                    .Where(function (x) { return x.type === "PushEvent" })
                                    .SelectMany(
                                        function (x) {
                                            return x.payload.commits;
                                        }, function (x, y) {
                                            return {
                                                date: $moment(x.created_at),
                                                issue: getIssueNumberFromMessage(y.message),
                                                project: x.repo.name,
                                                message: y.message
                                            };
                                        })
                                    .Where(function (x) { return $moment(x.date).isSame(date, "day") })
                                    .ToArray();;
                            });
                    });
            }
            function getIssueNumberFromMessage(message) {
                var matches = /(?:\s|^)([A-Z]*-\d*)(?:\s|$)/.exec(message);

                if (matches && matches.length > 0)
                    return matches[1];

                return null;
            }

            function callApi(url, config) {

                return $http({
                    method: "GET",
                    url: url,
                    headers: {
                        "Authorization": "Basic " + btoa(config.username + ":" + config.password)
                    }
                }).then(function successCallback(response) {
                    return response.data;
                }, function errorCallback(response) {
                    return response.data;
                });
            }


        }
    ]);