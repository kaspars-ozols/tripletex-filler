angular.module("tf.header", [])
    .directive("gpHeader", function () {
        return {
            templateUrl: "app/shared/header/header.html",
            controller: "headerCtrl",
            controllerAs: "vm"
        };
    })
    .controller("headerCtrl", ['$location',
        function ($location) {

            var vm = this;

            vm.menuItems = [
                {
                    url: '/',
                    title: 'Import'
                },
                {
                    url: '/home',
                    title: 'Home'
                },
                {
                    url: '/configure',
                    title: 'Configure'
                },
                {
                    url: '/rules',
                    title: 'Rules'
                }
            ];

            vm.isMenuActive = isMenuActive;

            function isMenuActive(pageUrl) {
                return $location.path() === pageUrl;
            }

        }
    ]);