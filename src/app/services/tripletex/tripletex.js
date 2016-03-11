angular.module("tf.services.tripletex", [])
    .factory("tripletex", [
        "$q", "$rootScope", function($q, $rootScope) {

            return {
                getProjectList: getProjectList,
                getCurrentPeriod: getCurrentPeriod
            };

            function getProjectList() {
                return callAction("getProjectList");
            }

            function getCurrentPeriod() {
                return callAction("getCurrentPeriod");
            }

            function callAction(action, params) {

                var deferred = $q.defer();

                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {

                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: action,
                            params: params
                        },
                        function(response) {
                            $rootScope.$apply(function() {
                                deferred.resolve(response);
                            });
                        });
                });
                return deferred.promise;
            }
        }
    ]);