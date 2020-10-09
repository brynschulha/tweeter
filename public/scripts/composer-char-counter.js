$(document).ready(function() {
  $("textarea").keyup(function() {
    const input = $(this);
    // ---tree traversal to find .counter ---
    const form = input.closest("form");
    const counter = form.find(".counter");
    // --- change counter to reflect remaining characters allowed ---
    counter.html(140 - $(this).val().length);
    // --- if below zero, change to red ---
    counter.css( "color",counter.html() < 0 ? "red": "black" );
  });
});
