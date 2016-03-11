angular.module("tf.services.jira", [])
    .factory("jira", [
        "$http", "$q", "$sce", "config", function ($http, $q, $sce, config) {
            return {
                getEvents: getEvents
            };

            function getProjects(config) {
                var url = "https://" + config.organization + ".atlassian.net/rest/api/2/project?maxResults=1000";
                return callApi(url, config, false);
            }

            function getActivityStream(config, startDate, endDate) {
                var url = "https://" + config.organization + ".atlassian.net/activity?streams=user+IS+" + config.username + "&streams=update-date+BETWEEN+" + startDate + "+" + endDate + "&maxResults=1000";
                return callApi(url, config, true);
            }

            function getEvents(startDate, endDate) {
                return config.loadJiraConfig()
                    .then(function (config) {
                        var tasks = [
                            getProjects(config),
                            getActivityStream(config, startDate, endDate)
                        ];
                        return $q.all(tasks)
                            .then(function (taskResults) {
                                var projects = Enumerable.From(taskResults[0]);
                                var activities = Enumerable.From(taskResults[1].feed.entry);

                                var issueEvents = activities
                                    .Select(function (x) {
                                        return {
                                            date: Date.parse(x.updated),
                                            issueNumber: (x.object.title || x.target.title).__text,
                                            issueSummary: (x.object.summary || x.target.summary).__text,
                                            project: projects
                                                .Where(function (p) { return (x.object.title || x.target.title).__text.startsWith(p.key + "-"); })
                                                .Select(function (p) { return p.name; })
                                                .FirstOrDefault("-", function (p) { return p; }),
                                            message: $sce.trustAsHtml(x.title.__text)
                                        };
                                    })
                                    .ToArray();

                                return issueEvents;







                                var events = activities
                                    .Select(function (x) {
                                        return {
                                            date: Date.parse(x.updated),
                                            issue: (x.object.title || x.target.title).__text,
                                            project: projects
                                                .Where(function (p) { return (x.object.title || x.target.title).__text.startsWith(p.key + "-"); })
                                                .Select(function (p) { return p.name; })
                                                .FirstOrDefault("-", function (p) { return p; }),
                                            message: (x.object.title || x.target.title).__text + " " + (x.object.summary || x.target.summary).__text
                                        };
                                    })
                                    .Distinct(function (x) { return JSON.stringify(x); })
                                    .ToArray();
                                return events;
                            });
                    });
            }

            function callApi(url, config, isXml) {
                return $http({
                    method: "GET",
                    url: url,
                    headers: {
                        "Authorization": "Basic " + btoa(config.username + ":" + config.password)
                    }
                }).then(function successCallback(response) {
                    if (isXml) {
                        var x2js = new X2JS();
                        return x2js.xml_str2json(response.data);
                    }
                    return response.data;
                }, function errorCallback(response) {
                });
            }
        }
    ]);