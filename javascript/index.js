"use strict";

var pages = document.getElementsByClassName("page");
var buttons = document.getElementsByClassName("menu_button");
var active_page_num;
var page_urls = [];


page_urls[0] = 'html/home.html';
page_urls[1] = 'html/play.html';
page_urls[2] = 'html/statistics.html';
page_urls[3] = 'html/enterquestions.html';
page_urls[4] = 'html/links.html';


function button_over(button_num) {
    if (button_num === active_page_num) {
        buttons[button_num].style.color = "#990000";
    } else {
        buttons[button_num].style.color = "#EEEEEE";
    }
}


function button_out(button_num) {
    if (button_num === active_page_num) {
        buttons[button_num].style.color = "#990000";
    } else {
        buttons[button_num].style.color = "#FEE6CC";
    }
}


function change_display(page_num) {
    var j;

    $("#content").load(page_urls[page_num]);       // jQuery to load content

    for (j = 0; j < buttons.length; j++) {
        buttons[j].style.color = "#FEE6CC";
        buttons[j].style.backgroundColor = "#990000";
    }
    buttons[page_num].style.color = "#990000";
    buttons[page_num].style.backgroundColor = "#EEEEEE";

    active_page_num = page_num;
}