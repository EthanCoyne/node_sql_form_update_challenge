$(function() {
  console.log('doc loaded');

  getBooks();

  // listen for a submit event from the form
  $('#book-form').on('submit', addBook);
}); // end doc ready

function getBooks() {
  $.ajax({
    url:'/books',
    type: 'GET',
    success: displayBooks
  });// end ajax
}//end getBooks

function displayBooks(books) {
  console.log('Got books from the server', books);
  $('#book-list').empty();
  books.forEach(function(book) {
    var $li = $('<li></li>');
    $li.append('<p><strong>' + book.title + '</strong></p>');
    $li.append('<p><em>' + book.author + '</em></p>');
    var date = new Date(book.publication_date).toDateString();
    $li.append('<p><time>' + date + '</time></p>');
    $li.append('<p>' + 'Edition: ' + book.edition + '</p>');
    $li.append('<p>' + 'Published by ' + book.publisher + '</p>');


    $('#book-list').append($li);
  }); // end forEach
}// end displayBooks

function addBook(event) {
  // prevent browser from refreshing, needed when a function is called on a submit event
  event.preventDefault();
  //get info out of the form, in a format ajax can use
  var formData = $(this).serialize();
  //send data to server
  $.ajax({
    url: '/books',
    type: 'POST',
    data: formData,
    success: getBooks
  }); // end ajax
} // end addBook
