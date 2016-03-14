"use strict";

angular.module("tf", [
        "ngRoute",
        "ui.bootstrap",
        "angular-linq",
        "angular-momentjs",
        "cb.x2js",
        "tf.services.config",
        "tf.services.github",
        "tf.services.jira",
        "tf.services.tripletex",
        "tf.components.import",
        "tf.components.options"
    ]).
    config([
        "$routeProvider", "$compileProvider", function($routeProvider, $compileProvider) {
            $routeProvider.otherwise({ redirectTo: "/" });
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        }
    ]);