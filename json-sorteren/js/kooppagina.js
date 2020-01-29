const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;
        default:
            number = 0;
    }
    return number;
}

const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

let shoppingcart = {
    items: [],

    getItems: function () {
        let purchase;
        if (localStorage.getItem('GekochtenLaptops') == null) {
            purchase = [];
        } else {
            purchase = JSON.parse(localStorage.getItem('GekochtenLaptops'));
        }
        purchase.forEach(item => {
            this.items.push(item);
        })
        return purchase;
    },

    deleteItems: function (opslag) {
        this.items.forEach((item, index) => {
            if (item.opslag == opslag) {
                this.items.splice(index, 1);
                opslag = 4;
            }
        })
        localStorage.setItem('GekochtenLaptops', JSON.stringify(this.items));
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
        this.uitvoeren();
    },

    countTotalPrice: function () {
        let totalPrice = 0;
        this.items.forEach(book => {
            totalPrice += book.prijs;
        });
        return totalPrice;
    },

    uitvoeren: function () {
        document.getElementById('purchase').innerHTML = "";

        this.items.forEach(book => {
            let section = document.createElement('section');
            section.className = 'gekochtenlaptops';

            let main = document.createElement('main');
            main.className = 'gekochtenlaptop__main';

            let image = document.createElement('img');
            image.className = 'gekochtenlaptop__cover';
            image.setAttribute('src', book.cover);
            image.setAttribute('alt', reverseText(book.naam));

            let title = document.createElement('h3');
            title.className = 'gekochtenlaptop__title';
            title.textContent = reverseText(book.naam);

            let price = document.createElement('div');
            price.className = 'gekochtenlaptop__price';
            price.textContent = book.prijs.toLocaleString('nl-NL', {
                currency: 'EUR',
                style: 'currency'
            });

            let deleteButton = document.createElement('div');
            deleteButton.className = 'gekochtenlaptop__delete';
            deleteButton.addEventListener('click', () => {
                this.deleteItems(book.opslag);
            })

            section.appendChild(image);
            main.appendChild(title);
            section.appendChild(main);
            section.appendChild(price);
            section.appendChild(deleteButton);
            document.getElementById('purchase').appendChild(section);
        });

        let section = document.createElement('section');
        section.className = 'gekochtenlaptop';

        let totalText = document.createElement('div');
        totalText.className = 'gekochtenlaptop__totalText';
        totalText.innerHTML = 'Total: ';

        let showTotalPrice = document.createElement('div');
        showTotalPrice.className = 'gekochtenlaptop__showTotalPrice';
        showTotalPrice.textContent = this.countTotalPrice().toLocaleString('nl-NL', {
            currency: 'EUR',
            style: 'currency'

        });

        section.appendChild(totalText);
        section.appendChild(showTotalPrice);
        document.getElementById('purchase').appendChild(section);

        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
    }

}

shoppingcart.getItems();
shoppingcart.uitvoeren();
