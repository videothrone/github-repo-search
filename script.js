(function() {
    initHandlebars();

    var username, password, userToSearch;
    var baseUrl = "https://api.github.com";

    $("#go-button").on("click", function() {
        username = $('input[name="username"]').val();
        password = $('input[name="password"]').val();
        userToSearch = $('input[name="user-to-search"]').val();
        var endPoint = "/users/" + userToSearch + "/repos";

        $.ajax({
            url: baseUrl + endPoint,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },
            success: function(response) {
                console.log("response ", response);
                var repos = Handlebars.templates.repos({
                    repos: response
                });
                $("#results-container").html(repos);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#results-container").on("click", ".card", function(event) {
        username = $('input[name="username"]').val();
        password = $('input[name="password"]').val();
        userToSearch = $('input[name="user-to-search"]').val();
        var name = $(event.target)
            .parent()
            .text()
            .trim();
        // event.stopPropagation();
        var newEndPoint = "/repos/" + name + "/commits?per_page=5";

        $.ajax({
            url: baseUrl + newEndPoint,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },
            success: function(response) {
                var commits = Handlebars.templates.commits({
                    commits: response
                });
                $(event.target)
                    .parent()
                    .append(commits);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    //do not touch
    function initHandlebars() {
        Handlebars.templates = Handlebars.templates || {};

        var templates = document.querySelectorAll(
            'script[type="text/x-handlebars-template"]'
        );

        Array.prototype.slice.call(templates).forEach(function(script) {
            Handlebars.templates[script.id] = Handlebars.compile(
                script.innerHTML
            );
        });
    }
    //do not touch
})();
