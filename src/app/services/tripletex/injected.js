(function ($) {

    if (!window.tripletexAutofillIsAlreadyInjected) {
        window.tripletexAutofillIsAlreadyInjected = true;
        $('body img').css('border', '3px solid green');



        function injectUI() {


            var $button = $("<iframe src='chrome-extension://ghilfcgbdenigkofchbgabmdbpompcik/index.html#/configure'></iframe>");


            $('#ajaxContenthourListTable th').append($button);
        }

        setTimeout(injectUI, 1000);












        var messageHandler = {
            getProjectList: getProjectList,
            getActivityList: getActivityList,
            getCurrentPeriod: getCurrentPeriod
        };


        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                messageHandler[request.action](sendResponse, request.params);
                return true;
            });



        function getProjectList(sendResponse) {
            var contextId = getContextId();
            var employeeId = getEmployeeId();

            var data = {
                "marshallSpec": [
                    "id",
                    "displayName"
                ],
                "className": "JSONRpcClient.RequestExtraInfo",
                "id": 21,
                "method": "Project.searchForProjects",
                "params": [
                    contextId,
                    -1,
                    -1,
                    -1,
                    -1,
                    employeeId,
                    0,
                    1,
                    -1,
                    false,
                    false,
                    {
                        "javaClass": "java.util.Date",
                        "time": 0
                    },
                    {
                        "javaClass": "java.util.Date",
                        "time": 9999999999999
                    },
                    ""
                ]
            };


            $.ajax({
                type: "POST",
                url: "https://tripletex.no/JSON-RPC?syncSystem=0&contextId=" + contextId,
                data: JSON.stringify(data),
                success: function (response) {

                    var projectList = Enumerable.From(response.result)
                        .Select(function (x) { return { id: x.id, name: x.displayName }; })
                        .ToArray();

                    sendResponse(projectList);
                },


                dataType: "json",
                contentType: "text/plain",
                processData: false
            });


        }

        function getActivityList(sendResponse) {

            var data = {
                "marshallSpec": [
                    "id",
                    "number",
                    "name",
                    "nameAndNumber",
                    "ownerName"
                ],
                "className": "JSONRpcClient.RequestExtraInfo",
                "id": 22,
                "method": "Activity.searchForActivities",
                "params": [
                    648338,
                    8859792,
                    1,
                    -1,
                    {
                        "javaClass": "java.util.Date",
                        "time": 1455487200000
                    },
                    {
                        "javaClass": "java.util.Date",
                        "time": 1456092000000
                    },
                    "",
                    -1,
                    -1
                ]
            };

            $.ajax({
                type: "POST",
                url: "https://tripletex.no/JSON-RPC?syncSystem=0&contextId=648338",
                data: JSON.stringify(data),
                success: function (response) {

                    var projectList = Enumerable.From(response.result)
                        .Select(function (x) { return { id: x.id, name: x.displayName }; })
                        .ToArray();

                    sendResponse(projectList);
                },


                dataType: "json",
                contentType: "text/plain",
                processData: false
            });


        }

        function getCurrentPeriod(sendResponse) {
            var period =  {
                startDate: getStartDate(),
                endDate: getEndDate()
            };

            sendResponse(period);
        }


        function getEmployeeId() {

            return parseUserProfileLink()[1];
        }

        function getContextId() {
            return parseUserProfileLink()[2];
        }

        function getStartDate() {
            return Date.parse(parseTableHeadText()[1]);
        }

        function getEndDate() {
            return Date.parse(parseTableHeadText()[2]);
        }

        function parseUserProfileLink() {
            var userProfileLink = $('#menuUser a').attr('href');
            var regex = /employeeId=(\d*).*contextId=(\d*)/g;
            return regex.exec(userProfileLink);
        }

        function parseTableHeadText() {
            var text = $('#ajaxContenthourListTable thead').text();
            return /(\d\d\d\d-\d\d-\d\d) - ((\d\d\d\d-\d\d-\d\d))/g.exec(text);
        }
    }

})(jQuery);