/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario
*/

interface Book {
    title: string;
    author: string;
    ISBN: string;
}

interface LoanManager {
    loanBook(ISBN: string, userID: string): void;
    returnBook(ISBN: string, userID: string): void;
}

interface EmailNotifier {
    sendEmail(userID: string, message: string): void;
}

class LibraryManager implements LoanManager {
    private books: Book[] = [];
    private loans: any[] = [];
    private emailNotifier: EmailNotifier;

    constructor(emailNotifier: EmailNotifier) {
        this.emailNotifier = emailNotifier;
    }

    addBook(title: string, author: string, ISBN: string) {
        this.books.push({ title, author, ISBN });
    }

    removeBook(ISBN: string) {
        const index = this.books.findIndex(b => b.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    searchByTitle(query: string): Book[] {
        return this.books.filter(book => book.title.includes(query));
    }

    searchByAuthor(query: string): Book[] {
        return this.books.filter(book => book.author.includes(query));
    }

    searchByISBN(query: string): Book[] {
        return this.books.filter(book => book.ISBN === query);
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            this.loans.push({ ISBN, userID, date: new Date() });
            this.emailNotifier.sendEmail(userID, `Has solicitado el libro ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            this.loans.splice(index, 1);
            this.emailNotifier.sendEmail(userID, `Has devuelto el libro con ISBN ${ISBN}. ¡Gracias!`);
        }
    }
}


class EmailNotifierI implements EmailNotifier {
    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
    }
}
const emailNotifier = new EmailNotifierI();
const library = new LibraryManager(emailNotifier);

library.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
library.addBook("1984", "George Orwell", "987654321");
library.loanBook("123456789", "user01");

const booksByTitle = library.searchByTitle("Gatsby");// busqueda por Libro
const booksByAuthor = library.searchByAuthor("F. Scott Fitzgerald");// busqueda por autor
const booksByISBN = library.searchByISBN("123456789");// busqueda por ISBN
