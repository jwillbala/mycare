preloader();
$.ajax({
    url: localStorage.server + "/post_my.php",
    data: {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass
                //no_view: true
    },
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: 5000
})
        .always(function () {
            preloader(false);
        })

        .fail(function () {
            //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
        })

        .done(function (res) {
            if (res !== null) {
                console.log(res);

                if (res === false) {
                    $("#nenhum").show();
                    return;
                }
                if (res[0]) {
                    $.each(res, function (key, val) {

                        $("#post_template")
                                .clone()
                                .prop({
                                    id: "post_" + val["post_id"]
                                })
                                .appendTo("#ads")
                                .attr("data-id", val["post_id"])
                                .attr("data-title", val["post_title"])
                                .attr("data-com", val["post_com"]) // permite comentarios?
                                .attr("data-pet", val["post_pet"])
                                .attr("data-cnpj", val["post_cnpj"]);
                        ;

                        $("#post_" + val["post_id"]).each(function (index) {

                            if (val["post_status"] == "1") {
                                var post_status = "<span class='light-green-text'><img src='img/ico-ok.png' style='width:16px;display:inline-block;vertical-align:text-bottom' /> ATIVO</span>";
                            }
                            if (val["post_status"] == "2") {
                                var post_status = "<span class='grey-text'><img src='img/ico-wait.png' style='width:16px;display:inline-block;vertical-align:text-bottom' /> EM ANÁLISE</span>";
                            }
                            if (val["post_status"] == "0") {
                                var post_status = "<span class='red-text'><img src='img/ico-block.gif' style='width:16px;display:inline-block;vertical-align:text-bottom' /> BLOQUEADO</span>";
                            }
                            $(this).find(".post_title").html(val["post_title"]);
                            $(this).find(".post_txt").html(val["post_txt"]);
                            $(this).find(".post_date").html(val["post_date"]);
                            $(this).find(".post_status").html(post_status + " <br/><span style='color:#ccc'>#" + val["post_id"] + "</span>");

                            var rand = getRandomInt(1, 7);
                            if (val["img_fn"] != null) {
                                var url = localStorage.server + "/app/pic/img/" + val["img_fn"];
                            } else {
                                var url = "img/grey.jpg";
                            }
                            $(this).find(".post_img").attr("src", url);

                        }).show();

                    });

                    $(".post_txt").text(function (index, currentText) {
                        if (currentText.length > 40) {
                            return currentText.substr(0, 40) + " ...";
                        }
                    });

                    pretty();

                } // res[0]
                else {
                    $("#nenhum").show();
                }
            } // res not null
        }); // after ajax