// Define la URL de la fuente de libros
var bookSourceUrl = "https://tunovelaligera.com";

// Define una función para obtener los libros de la fuente
function getBooks(query) {
  // Crea un objeto UrlFetchApp para hacer una solicitud HTTP
  var urlFetchApp = UrlFetchApp.fetch(bookSourceUrl + "/?s=" + query);
  // Obtiene el contenido HTML de la respuesta
  var html = urlFetchApp.getContentText();
  // Crea un objeto XmlService para analizar el HTML
  var xmlService = XmlService.parse(html);
  // Obtiene la raíz del documento HTML
  var root = xmlService.getRootElement();
  // Obtiene la lista de elementos div con la clase "post"
  var posts = root.getChild("body").getChild("div", "http://www.w3.org/1999/xhtml").getChild("div", "http://www.w3.org/1999/xhtml").getChild("div", "http://www.w3.org/1999/xhtml").getChildren("div", "http://www.w3.org/1999/xhtml");
  // Crea un array vacío para almacenar los libros
  var books = [];
  // Recorre los elementos div con la clase "post"
  for (var i = 0; i < posts.length; i++) {
    // Obtiene el elemento h2 con el título del libro
    var title = posts[i].getChild("h2", "http://www.w3.org/1999/xhtml");
    // Obtiene el elemento a con el enlace del libro
    var link = title.getChild("a", "http://www.w3.org/1999/xhtml");
    // Obtiene el elemento div con la clase "meta"
    var meta = posts[i].getChild("div", "http://www.w3.org/1999/xhtml");
    // Obtiene el elemento span con el autor del libro
    var author = meta.getChild("span", "http://www.w3.org/1999/xhtml");
    // Obtiene el elemento span con el género del libro
    var genre = meta.getChildren("span", "http://www.w3.org/1999/xhtml")[1];
    // Crea un objeto libro con los datos obtenidos
    var book = {
      name: link.getText(),
      url: link.getAttribute("href").getValue(),
      author: author.getText(),
      genre: genre.getText()
    };
    // Añade el objeto libro al array de libros
    books.push(book);
  }
  // Devuelve el array de libros
  return books;
}

// Define una función para mostrar los libros en la app Legado
function showBooks(books) {
  // Crea un objeto SpreadsheetApp para acceder a la hoja de cálculo de la app Legado
  var spreadsheetApp = SpreadsheetApp.openById("ID_DE_LA_HOJA_DE_CÁLCULO");
  // Obtiene la primera hoja de la hoja de cálculo
  var sheet = spreadsheetApp.getSheets()[0];
  // Borra el contenido de la hoja
  sheet.clear();
  // Escribe los encabezados de las columnas
  sheet.getRange(1, 1).setValue("Nombre");
  sheet.getRange(1, 2).setValue("URL");
  sheet.getRange(1, 3).setValue("Autor");
  sheet.getRange(1, 4).setValue("Género");
  // Recorre el array de libros
  for (var i = 0; i < books.length; i++) {
    // Escribe los datos del libro en la fila correspondiente
    sheet.getRange(i + 2, 1).setValue(books[i].name);
    sheet.getRange(i + 2, 2).setValue(books[i].url);
    sheet.getRange(i + 2, 3).setValue(books[i].author);
    sheet.getRange(i + 2, 4).setValue(books[i].genre);
  }
}

// Define una función principal para ejecutar el script
function main() {
  // Pide al usuario que introduzca una consulta de búsqueda
  var query = prompt("Introduce una consulta de búsqueda:");
  // Obtiene los libros de la fuente con la consulta
  var books = getBooks(query);
  // Muestra los libros en la app Legado
  showBooks(books);
}

// Ejecuta la función principal
main();
